#!/bin/bash

echo "🚀 Setting up AWS for Real Estate App Backend Deployment"
echo "=================================================="

# Add AWS CLI to PATH
export PATH="$PATH:/Users/catscookie/Library/Python/3.9/bin"

echo ""
echo "📋 AWS Configuration Required"
echo "You need to provide AWS credentials to deploy the backend."
echo ""
echo "If you don't have AWS credentials yet:"
echo "1. Go to https://console.aws.amazon.com/"
echo "2. Sign in or create an account"
echo "3. Go to IAM (Identity and Access Management)"
echo "4. Create a new user with programmatic access"
echo "5. Attach the 'AdministratorAccess' policy (for this demo)"
echo "6. Copy the Access Key ID and Secret Access Key"
echo ""

read -p "Do you have AWS credentials ready? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔑 Please enter your AWS credentials:"
    aws configure
    echo ""
    echo "✅ AWS CLI configured successfully!"
    echo ""
    echo "🚀 Now deploying the backend infrastructure..."
    echo ""
    
    # Deploy the CloudFormation stack
    chmod +x aws-infrastructure/deploy.sh
    ./aws-infrastructure/deploy.sh
    
else
    echo ""
    echo "❌ Please set up AWS credentials first and run this script again."
    echo ""
    echo "Quick setup guide:"
    echo "1. Go to https://console.aws.amazon.com/"
    echo "2. Create an IAM user with AdministratorAccess"
    echo "3. Get Access Key ID and Secret Access Key"
    echo "4. Run: aws configure"
    echo "5. Then run this script again"
fi
