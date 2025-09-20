# Real Estate Management System - AWS Deployment Script (PowerShell)
# This script deploys the infrastructure and frontend to AWS

param(
    [string]$Action = "deploy",
    [string]$StackName = "real-estate-system",
    [string]$Environment = "dev",
    [string]$Region = "us-east-1",
    [string]$Profile = "default"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if AWS CLI is installed and configured
function Test-AwsCli {
    try {
        $null = Get-Command aws -ErrorAction Stop
    }
    catch {
        Write-Error "AWS CLI is not installed. Please install it first."
        exit 1
    }
    
    try {
        $null = aws sts get-caller-identity --profile $Profile 2>$null
    }
    catch {
        Write-Error "AWS CLI is not configured or profile '$Profile' doesn't exist."
        Write-Status "Please run 'aws configure' to set up your credentials."
        exit 1
    }
    
    Write-Success "AWS CLI is configured correctly"
}

# Function to check if required tools are installed
function Test-Dependencies {
    Write-Status "Checking dependencies..."
    
    # Check Node.js
    try {
        $null = Get-Command node -ErrorAction Stop
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    # Check npm
    try {
        $null = Get-Command npm -ErrorAction Stop
    }
    catch {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }
    
    Write-Success "All dependencies are installed"
}

# Function to build the frontend
function Build-Frontend {
    Write-Status "Building frontend..."
    
    # Install dependencies
    npm install
    
    # Build the project
    npm run build
    
    Write-Success "Frontend built successfully"
}

# Function to deploy CloudFormation stack
function Deploy-Infrastructure {
    Write-Status "Deploying infrastructure..."
    
    aws cloudformation deploy `
        --template-file aws-infrastructure/cloudformation-template.yaml `
        --stack-name "$StackName-$Environment" `
        --parameter-overrides Environment=$Environment `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region `
        --profile $Profile
    
    Write-Success "Infrastructure deployed successfully"
}

# Function to get stack outputs
function Get-StackOutputs {
    Write-Status "Getting stack outputs..."
    
    aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs' `
        --output table
}

# Function to upload frontend to S3
function Upload-Frontend {
    Write-Status "Uploading frontend to S3..."
    
    # Get the S3 bucket name from CloudFormation outputs
    $BucketName = aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' `
        --output text
    
    if ([string]::IsNullOrEmpty($BucketName)) {
        Write-Error "Could not get S3 bucket name from CloudFormation stack"
        exit 1
    }
    
    Write-Status "Uploading to bucket: $BucketName"
    
    # Sync the build directory to S3
    aws s3 sync dist/ "s3://$BucketName" `
        --region $Region `
        --profile $Profile `
        --delete
    
    Write-Success "Frontend uploaded to S3 successfully"
}

# Function to create environment configuration file
function New-EnvConfig {
    Write-Status "Creating environment configuration..."
    
    # Get stack outputs
    $UserPoolId = aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' `
        --output text
    
    $UserPoolClientId = aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' `
        --output text
    
    $ApiUrl = aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayURL`].OutputValue' `
        --output text
    
    # Create .env file for the frontend
    $envContent = @"
VITE_AWS_REGION=$Region
VITE_USER_POOL_ID=$UserPoolId
VITE_USER_POOL_CLIENT_ID=$UserPoolClientId
VITE_API_URL=$ApiUrl
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Success "Environment configuration created"
}

# Function to display deployment information
function Show-DeploymentInfo {
    Write-Status "Deployment completed successfully!"
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  Real Estate Management System" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Get and display URLs
    $FrontendUrl = aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendWebsiteURL`].OutputValue' `
        --output text
    
    $ApiUrl = aws cloudformation describe-stacks `
        --stack-name "$StackName-$Environment" `
        --region $Region `
        --profile $Profile `
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayURL`].OutputValue' `
        --output text
    
    Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Green
    Write-Host "API URL: $ApiUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit the frontend URL to access the application"
    Write-Host "2. Create an account using the signup form"
    Write-Host "3. Start adding properties!"
    Write-Host ""
    Write-Host "Note: It may take a few minutes for the S3 website to be fully accessible."
    Write-Host ""
}

# Function to clean up resources
function Remove-Resources {
    Write-Warning "This will delete all AWS resources. Are you sure? (y/N)"
    $response = Read-Host
    if ($response -match "^[yY]([eE][sS])?$") {
        Write-Status "Deleting CloudFormation stack..."
        aws cloudformation delete-stack `
            --stack-name "$StackName-$Environment" `
            --region $Region `
            --profile $Profile
        
        Write-Status "Waiting for stack deletion to complete..."
        aws cloudformation wait stack-delete-complete `
            --stack-name "$StackName-$Environment" `
            --region $Region `
            --profile $Profile
        
        Write-Success "All resources have been deleted"
    }
    else {
        Write-Status "Cleanup cancelled"
    }
}

# Main deployment function
function Deploy-Application {
    Write-Status "Starting deployment of Real Estate Management System..."
    Write-Host ""
    
    Test-AwsCli
    Test-Dependencies
    Build-Frontend
    Deploy-Infrastructure
    Upload-Frontend
    New-EnvConfig
    Show-DeploymentInfo
}

# Main script logic
switch ($Action.ToLower()) {
    "deploy" {
        Deploy-Application
    }
    "cleanup" {
        Remove-Resources
    }
    "info" {
        Get-StackOutputs
    }
    "frontend" {
        Build-Frontend
        Upload-Frontend
    }
    "infrastructure" {
        Deploy-Infrastructure
    }
    default {
        Write-Host "Usage: .\deploy.ps1 {deploy|cleanup|info|frontend|infrastructure}"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  deploy         - Deploy the entire application (default)"
        Write-Host "  cleanup        - Delete all AWS resources"
        Write-Host "  info           - Show stack information"
        Write-Host "  frontend       - Build and upload frontend only"
        Write-Host "  infrastructure - Deploy infrastructure only"
        exit 1
    }
}
