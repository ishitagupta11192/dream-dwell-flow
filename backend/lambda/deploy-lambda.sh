#!/bin/bash

# Dream Dwell Flow Lambda Deployment Script
# This script deploys the Lambda function and infrastructure to AWS

set -e

# Configuration
STACK_NAME="dream-dwell-flow-lambda"
ENVIRONMENT="dev"
REGION="us-east-1"
LAMBDA_FUNCTION_NAME="DreamDwellFlow-PropertyHandler-dev"

echo "🚀 Deploying Dream Dwell Flow Lambda Backend"
echo "=============================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Install dependencies
echo "📦 Installing Lambda dependencies..."
cd "$(dirname "$0")"
npm install

# Create deployment package
echo "📦 Creating deployment package..."
zip -r function.zip . -x "*.git*" "*.DS_Store*" "deploy-lambda.sh" "cloudformation-lambda.yaml"

# Deploy CloudFormation stack
echo "☁️  Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file cloudformation-lambda.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

# Get the Lambda function ARN
LAMBDA_ARN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunctionArn`].OutputValue' \
    --output text)

# Update Lambda function code
echo "🔄 Updating Lambda function code..."
aws lambda update-function-code \
    --function-name $LAMBDA_FUNCTION_NAME \
    --zip-file fileb://function.zip \
    --region $REGION

# Get API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
    --output text)

# Clean up
rm function.zip

echo ""
echo "🎉 Deployment completed successfully!"
echo "======================================"
echo "📊 API Gateway URL: $API_URL"
echo "🏠 Properties endpoint: $API_URL/properties"
echo "🔧 Lambda Function: $LAMBDA_FUNCTION_NAME"
echo ""
echo "🧪 Test the API:"
echo "curl $API_URL/properties"
echo ""
echo "📝 To update the frontend to use this API, set:"
echo "VITE_API_URL=$API_URL"
echo ""
echo "🚀 Your Dream Dwell Flow backend is now live on AWS!"
