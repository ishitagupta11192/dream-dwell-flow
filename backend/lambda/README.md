# Dream Dwell Flow - Lambda Backend

This directory contains the AWS Lambda function and infrastructure for the Dream Dwell Flow real estate application.

## 🏗️ Architecture

```
Frontend (React) → API Gateway → Lambda Function → DynamoDB
```

## 📁 Files

- `property-handler.js` - Main Lambda function for property CRUD operations
- `package.json` - Lambda function dependencies
- `cloudformation-lambda.yaml` - Infrastructure as Code template
- `deploy-lambda.sh` - Deployment script
- `README.md` - This file

## 🚀 Quick Deployment

### Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws configure
   ```

2. **Node.js 18+ installed**

### Deploy to AWS

```bash
./deploy-lambda.sh
```

This script will:
- Install dependencies
- Deploy CloudFormation stack
- Create DynamoDB table
- Deploy Lambda function
- Set up API Gateway
- Provide you with the API URL

## 📊 API Endpoints

Once deployed, you'll have these endpoints:

- `GET /properties` - Get all properties (with optional filters)
- `GET /properties/{id}` - Get specific property
- `POST /properties` - Create new property
- `PUT /properties/{id}` - Update property
- `DELETE /properties/{id}` - Delete property

### Example Usage

```bash
# Get all properties
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/properties

# Get properties with filters
curl "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/properties?type=sale&minPrice=100000&maxPrice=500000"

# Create a property
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Home",
    "price": 350000,
    "location": "Austin, TX",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 1800,
    "type": "sale",
    "description": "A beautiful family home"
  }'
```

## 🗄️ DynamoDB Schema

### Properties Table

```json
{
  "id": "string (Primary Key)",
  "title": "string",
  "price": "number",
  "location": "string",
  "bedrooms": "number",
  "bathrooms": "number",
  "area": "number",
  "image": "string (URL)",
  "type": "string (sale|rent)",
  "featured": "boolean",
  "description": "string",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "userId": "string"
}
```

### Global Secondary Indexes

- **TypeIndex**: Query properties by type and creation date
  - Partition Key: `type`
  - Sort Key: `createdAt`

## 🔧 Local Development

### Test the Lambda Function Locally

```bash
# Install dependencies
npm install

# Test with sample event
node -e "
import('./property-handler.js').then(module => {
  const event = {
    httpMethod: 'GET',
    path: '/properties',
    queryStringParameters: {}
  };
  module.handler(event, {}).then(console.log);
});
"
```

## 🌍 Environment Variables

The Lambda function uses these environment variables:

- `TABLE_NAME` - DynamoDB table name (set automatically)
- `ENVIRONMENT` - Environment name (dev/staging/prod)

## 💰 Cost Estimation

This setup is designed to stay within AWS Free Tier:

- **Lambda**: 1M free requests/month
- **DynamoDB**: 25 GB storage + 25 RCUs/WCUs free
- **API Gateway**: 1M API calls free

## 🧹 Cleanup

To remove all resources:

```bash
aws cloudformation delete-stack --stack-name dream-dwell-flow-lambda
```

## 🔒 Security

- Lambda function has minimal IAM permissions
- DynamoDB table uses pay-per-request billing
- API Gateway has CORS enabled for development
- No authentication configured (add Cognito for production)

## 📈 Monitoring

- CloudWatch logs are automatically enabled
- DynamoDB metrics available in CloudWatch
- API Gateway metrics and logs available

## 🚀 Production Considerations

For production deployment:

1. **Add Authentication**: Integrate with AWS Cognito
2. **Enable CORS properly**: Configure for your domain
3. **Add rate limiting**: Use API Gateway throttling
4. **Enable caching**: Use CloudFront CDN
5. **Add monitoring**: Set up CloudWatch alarms
6. **Backup strategy**: Enable DynamoDB point-in-time recovery
