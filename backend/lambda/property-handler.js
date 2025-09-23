import { randomBytes } from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'DreamDwellFlow-Properties-dev';

export const handler = async (event, context) => {
    const propertyId = toUrlString(randomBytes(16));
    console.log('Received event (', propertyId, '): ', event);

    const httpMethod = event.httpMethod;
    const path = event.path;
    const pathParameters = event.pathParameters || {};
    const queryStringParameters = event.queryStringParameters || {};

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };

    // Handle preflight requests
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    try {
        let result;

        switch (httpMethod) {
            case 'GET':
                if (pathParameters.id) {
                    result = await getProperty(pathParameters.id);
                } else {
                    result = await getProperties(queryStringParameters);
                }
                break;
            case 'POST':
                result = await createProperty(JSON.parse(event.body || '{}'), propertyId);
                break;
            case 'PUT':
                if (!pathParameters.id) {
                    return errorResponse('Property ID is required for update', context.awsRequestId, headers);
                }
                result = await updateProperty(pathParameters.id, JSON.parse(event.body || '{}'));
                break;
            case 'DELETE':
                if (!pathParameters.id) {
                    return errorResponse('Property ID is required for deletion', context.awsRequestId, headers);
                }
                result = await deleteProperty(pathParameters.id);
                break;
            default:
                return errorResponse(`Unsupported method: ${httpMethod}`, context.awsRequestId, headers);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (err) {
        console.error(err);
        return errorResponse(err.message, context.awsRequestId, headers);
    }
};

async function getProperties(filters = {}) {
    console.log('Getting properties with filters:', filters);
    
    const params = {
        TableName: TABLE_NAME
    };

    // Add filters if provided
    if (filters.type) {
        params.FilterExpression = '#type = :type';
        params.ExpressionAttributeNames = { '#type': 'type' };
        params.ExpressionAttributeValues = { ':type': filters.type };
    }

    if (filters.minPrice) {
        if (!params.FilterExpression) {
            params.FilterExpression = '#price >= :minPrice';
            params.ExpressionAttributeNames = { '#price': 'price' };
            params.ExpressionAttributeValues = { ':minPrice': parseInt(filters.minPrice) };
        } else {
            params.FilterExpression += ' AND #price >= :minPrice';
            params.ExpressionAttributeNames['#price'] = 'price';
            params.ExpressionAttributeValues[':minPrice'] = parseInt(filters.minPrice);
        }
    }

    if (filters.maxPrice) {
        if (!params.FilterExpression) {
            params.FilterExpression = '#price <= :maxPrice';
            params.ExpressionAttributeNames = { '#price': 'price' };
            params.ExpressionAttributeValues = { ':maxPrice': parseInt(filters.maxPrice) };
        } else {
            params.FilterExpression += ' AND #price <= :maxPrice';
            params.ExpressionAttributeNames['#price'] = 'price';
            params.ExpressionAttributeValues[':maxPrice'] = parseInt(filters.maxPrice);
        }
    }

    if (filters.location) {
        if (!params.FilterExpression) {
            params.FilterExpression = 'contains(#location, :location)';
            params.ExpressionAttributeNames = { '#location': 'location' };
            params.ExpressionAttributeValues = { ':location': filters.location };
        } else {
            params.FilterExpression += ' AND contains(#location, :location)';
            params.ExpressionAttributeNames['#location'] = 'location';
            params.ExpressionAttributeValues[':location'] = filters.location;
        }
    }

    const response = await ddb.send(new ScanCommand(params));
    return response.Items || [];
}

async function getProperty(propertyId) {
    console.log('Getting property:', propertyId);
    
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: propertyId
        }
    };

    const response = await ddb.send(new GetCommand(params));
    
    if (!response.Item) {
        throw new Error('Property not found');
    }
    
    return response.Item;
}

async function createProperty(propertyData, propertyId) {
    console.log('Creating property:', propertyData);
    
    const property = {
        id: propertyId,
        title: propertyData.title || 'Untitled Property',
        price: propertyData.price || 0,
        location: propertyData.location || 'Unknown Location',
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        area: propertyData.area || 0,
        image: propertyData.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
        type: propertyData.type || 'sale',
        featured: propertyData.featured || false,
        description: propertyData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: propertyData.userId || 'demo-user'
    };

    const params = {
        TableName: TABLE_NAME,
        Item: property
    };

    await ddb.send(new PutCommand(params));
    return property;
}

async function updateProperty(propertyId, updateData) {
    console.log('Updating property:', propertyId, updateData);
    
    // First check if property exists
    const existingProperty = await getProperty(propertyId);
    
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    
    // Build update expression dynamically
    Object.keys(updateData).forEach(key => {
        if (key !== 'id' && updateData[key] !== undefined) {
            updateExpression.push(`#${key} = :${key}`);
            expressionAttributeNames[`#${key}`] = key;
            expressionAttributeValues[`:${key}`] = updateData[key];
        }
    });
    
    // Always update the updatedAt timestamp
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: propertyId
        },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const response = await ddb.send(new UpdateCommand(params));
    return response.Attributes;
}

async function deleteProperty(propertyId) {
    console.log('Deleting property:', propertyId);
    
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: propertyId
        }
    };

    await ddb.send(new DeleteCommand(params));
    return { message: 'Property deleted successfully', id: propertyId };
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, headers) {
    return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
    };
}
