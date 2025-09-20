# Get AWS Configuration Values
# This script helps you get the remaining AWS configuration values

Write-Host "🔍 Getting AWS Configuration Values..." -ForegroundColor Blue
Write-Host ""

# Check if AWS CLI is installed
try {
    $null = Get-Command aws -ErrorAction Stop
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed" -ForegroundColor Red
    Write-Host "📖 Please install AWS CLI first: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    Write-Host "📋 Then use get-aws-info.md for manual instructions" -ForegroundColor Yellow
    exit 1
}

# Check if AWS is configured
try {
    $null = aws sts get-caller-identity 2>$null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not configured" -ForegroundColor Red
    Write-Host "🔧 Please run: aws configure" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Getting CloudFormation stack outputs..." -ForegroundColor Blue

try {
    $outputs = aws cloudformation describe-stacks --stack-name real-estate-system-dev --query 'Stacks[0].Outputs' --output json | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "🎯 Found the following outputs:" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    
    $config = @{}
    
    foreach ($output in $outputs) {
        $key = $output.OutputKey
        $value = $output.OutputValue
        
        Write-Host "$key : $value" -ForegroundColor White
        
        # Map to environment variables
        switch ($key) {
            "FrontendWebsiteURL" { $config.FRONTEND_URL = $value }
            "ApiGatewayURL" { $config.API_URL = $value }
            "ImagesBucketName" { $config.S3_BUCKET = $value }
            "UserPoolId" { $config.USER_POOL_ID = $value }
            "UserPoolClientId" { $config.USER_POOL_CLIENT_ID = $value }
        }
    }
    
    Write-Host ""
    Write-Host "📝 Create a .env file with these values:" -ForegroundColor Yellow
    Write-Host "=======================================" -ForegroundColor Cyan
    
    $envContent = @"
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=$($config.USER_POOL_ID)
VITE_USER_POOL_CLIENT_ID=$($config.USER_POOL_CLIENT_ID)
VITE_API_URL=$($config.API_URL)
VITE_S3_BUCKET=$($config.S3_BUCKET)
"@
    
    Write-Host $envContent -ForegroundColor White
    
    # Ask if user wants to create the .env file
    $create = Read-Host "`n🤔 Do you want to create the .env file automatically? (y/n)"
    
    if ($create -eq "y" -or $create -eq "Y") {
        $envContent | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ .env file created successfully!" -ForegroundColor Green
        Write-Host "🚀 You can now run: npm run dev" -ForegroundColor Blue
    } else {
        Write-Host "📋 Please copy the values above to create your .env file manually" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error getting stack outputs: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔍 Make sure your CloudFormation stack is deployed and named 'real-estate-system-dev'" -ForegroundColor Yellow
    Write-Host "📖 Use get-aws-info.md for manual instructions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Blue
Write-Host "1. Create/update your .env file with the values above"
Write-Host "2. Run: npm run dev"
Write-Host "3. Visit: http://localhost:5173"
Write-Host "4. Test your application!"
