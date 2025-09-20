#!/bin/bash

# Real Estate Management System - AWS Deployment Script
# This script deploys the infrastructure and frontend to AWS

set -e

# Configuration
STACK_NAME="real-estate-system"
ENVIRONMENT="dev"
REGION="us-east-1"
PROFILE="default"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if AWS CLI is installed and configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity --profile $PROFILE &> /dev/null; then
        print_error "AWS CLI is not configured or profile '$PROFILE' doesn't exist."
        print_status "Please run 'aws configure' to set up your credentials."
        exit 1
    fi
    
    print_success "AWS CLI is configured correctly"
}

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Function to build the frontend
build_frontend() {
    print_status "Building frontend..."
    
    # Install dependencies
    npm install
    
    # Build the project
    npm run build
    
    print_success "Frontend built successfully"
}

# Function to deploy CloudFormation stack
deploy_infrastructure() {
    print_status "Deploying infrastructure..."
    
    aws cloudformation deploy \
        --template-file aws-infrastructure/cloudformation-template.yaml \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --parameter-overrides Environment=$ENVIRONMENT \
        --capabilities CAPABILITY_NAMED_IAM \
        --region $REGION \
        --profile $PROFILE
    
    print_success "Infrastructure deployed successfully"
}

# Function to get stack outputs
get_stack_outputs() {
    print_status "Getting stack outputs..."
    
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs' \
        --output table
}

# Function to upload frontend to S3
upload_frontend() {
    print_status "Uploading frontend to S3..."
    
    # Get the S3 bucket name from CloudFormation outputs
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
        --output text)
    
    if [ -z "$BUCKET_NAME" ]; then
        print_error "Could not get S3 bucket name from CloudFormation stack"
        exit 1
    fi
    
    print_status "Uploading to bucket: $BUCKET_NAME"
    
    # Sync the build directory to S3
    aws s3 sync dist/ s3://$BUCKET_NAME \
        --region $REGION \
        --profile $PROFILE \
        --delete
    
    print_success "Frontend uploaded to S3 successfully"
}

# Function to create environment configuration file
create_env_config() {
    print_status "Creating environment configuration..."
    
    # Get stack outputs
    USER_POOL_ID=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
        --output text)
    
    USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
        --output text)
    
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayURL`].OutputValue' \
        --output text)
    
    # Create .env file for the frontend
    cat > .env << EOF
VITE_AWS_REGION=$REGION
VITE_USER_POOL_ID=$USER_POOL_ID
VITE_USER_POOL_CLIENT_ID=$USER_POOL_CLIENT_ID
VITE_API_URL=$API_URL
EOF
    
    print_success "Environment configuration created"
}

# Function to display deployment information
show_deployment_info() {
    print_status "Deployment completed successfully!"
    echo ""
    echo "=========================================="
    echo "  Real Estate Management System"
    echo "=========================================="
    echo ""
    
    # Get and display URLs
    FRONTEND_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendWebsiteURL`].OutputValue' \
        --output text)
    
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME-$ENVIRONMENT \
        --region $REGION \
        --profile $PROFILE \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayURL`].OutputValue' \
        --output text)
    
    echo "Frontend URL: $FRONTEND_URL"
    echo "API URL: $API_URL"
    echo ""
    echo "Next steps:"
    echo "1. Visit the frontend URL to access the application"
    echo "2. Create an account using the signup form"
    echo "3. Start adding properties!"
    echo ""
    echo "Note: It may take a few minutes for the S3 website to be fully accessible."
    echo ""
}

# Function to clean up resources
cleanup() {
    print_warning "This will delete all AWS resources. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Deleting CloudFormation stack..."
        aws cloudformation delete-stack \
            --stack-name $STACK_NAME-$ENVIRONMENT \
            --region $REGION \
            --profile $PROFILE
        
        print_status "Waiting for stack deletion to complete..."
        aws cloudformation wait stack-delete-complete \
            --stack-name $STACK_NAME-$ENVIRONMENT \
            --region $REGION \
            --profile $PROFILE
        
        print_success "All resources have been deleted"
    else
        print_status "Cleanup cancelled"
    fi
}

# Main deployment function
deploy() {
    print_status "Starting deployment of Real Estate Management System..."
    echo ""
    
    check_aws_cli
    check_dependencies
    build_frontend
    deploy_infrastructure
    upload_frontend
    create_env_config
    show_deployment_info
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "cleanup")
        cleanup
        ;;
    "info")
        get_stack_outputs
        ;;
    "frontend")
        build_frontend
        upload_frontend
        ;;
    "infrastructure")
        deploy_infrastructure
        ;;
    *)
        echo "Usage: $0 {deploy|cleanup|info|frontend|infrastructure}"
        echo ""
        echo "Commands:"
        echo "  deploy         - Deploy the entire application (default)"
        echo "  cleanup        - Delete all AWS resources"
        echo "  info           - Show stack information"
        echo "  frontend       - Build and upload frontend only"
        echo "  infrastructure - Deploy infrastructure only"
        exit 1
        ;;
esac
