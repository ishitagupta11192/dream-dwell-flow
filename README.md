# Real Estate Management System on AWS

A beginner-friendly, full-stack real estate management system built with React, AWS services, and modern web technologies. This project demonstrates how to build a scalable web application using AWS Free Tier services.

## 🏗️ Architecture

```
Frontend (React + Vite) → S3 + CloudFront
Authentication → AWS Cognito
Backend API → API Gateway + Lambda
Database → DynamoDB
Images → S3
Monitoring → CloudWatch
```

## ✨ Features

- **User Authentication**: Email signup/login with AWS Cognito
- **Property Management**: CRUD operations for real estate listings
- **Image Upload**: Secure image storage with S3 pre-signed URLs
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui
- **Real-time Updates**: React Query for efficient data fetching
- **Search & Filter**: Advanced property search capabilities
- **Mobile-First**: Fully responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd dream-dwell-flow
npm install
```

### 2. Deploy to AWS

#### Option A: PowerShell (Windows)
```powershell
.\aws-infrastructure\deploy.ps1
```

#### Option B: Bash (Linux/Mac)
```bash
chmod +x aws-infrastructure/deploy.sh
./aws-infrastructure/deploy.sh
```

### 3. Access Your Application

After deployment, you'll see output like:
```
Frontend URL: http://your-bucket.s3-website-us-east-1.amazonaws.com
API URL: https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

Visit the Frontend URL to access your application!

## 📋 Manual Setup (Step by Step)

If you prefer to set up each component manually:

### 1. Create S3 Buckets

```bash
# Frontend hosting bucket
aws s3 mb s3://your-app-frontend-dev --region us-east-1
aws s3 website s3://your-app-frontend-dev --index-document index.html --error-document index.html

# Images bucket
aws s3 mb s3://your-app-images-dev --region us-east-1
```

### 2. Create Cognito User Pool

```bash
aws cognito-idp create-user-pool \
  --pool-name "RealEstateUserPool" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  }' \
  --username-attributes email \
  --auto-verified-attributes email
```

### 3. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name Properties \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=type,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=TypeIndex,KeySchema='[{AttributeName=type,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
  --billing-mode PAY_PER_REQUEST
```

### 4. Deploy Lambda Functions

The CloudFormation template includes Lambda functions for:
- Properties API (CRUD operations)
- Image upload (pre-signed URLs)

### 5. Create API Gateway

The CloudFormation template sets up:
- REST API with Cognito authorizer
- Endpoints: `/properties`, `/properties/{id}`, `/upload`
- CORS configuration

## 🔧 Configuration

### Environment Variables

After deployment, a `.env` file is created with:

```env
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=your-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-client-id
VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### AWS Permissions

Your AWS user/role needs these permissions:
- CloudFormation (full access)
- S3 (full access)
- Cognito (full access)
- DynamoDB (full access)
- Lambda (full access)
- API Gateway (full access)
- IAM (for creating roles)

## 💰 Cost Control (Free Tier)

This application is designed to stay within AWS Free Tier limits:

- **S3**: 5 GB storage + 20,000 GET requests/month
- **Lambda**: 1M free requests/month
- **DynamoDB**: 25 GB + 25 RCUs/WCUs free
- **Cognito**: 50,000 MAUs free
- **API Gateway**: 1M API calls free

### Monitoring Costs

```bash
# Check your current usage
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 🛠️ Development

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding New Features

1. **Frontend**: Add components in `src/components/`
2. **API**: Modify Lambda functions in CloudFormation template
3. **Database**: Update DynamoDB schema as needed

### Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and services
│   │   ├── aws-config.ts   # AWS configuration
│   │   ├── auth.ts         # Authentication service
│   │   └── api.ts          # API service
│   ├── contexts/           # React contexts
│   └── hooks/              # Custom hooks
├── aws-infrastructure/
│   ├── cloudformation-template.yaml  # Infrastructure as Code
│   ├── deploy.ps1          # Windows deployment script
│   └── deploy.sh           # Linux/Mac deployment script
└── public/                 # Static assets
```

## 🔒 Security Best Practices

- **Authentication**: JWT tokens via Cognito
- **Authorization**: API Gateway with Cognito authorizer
- **Data**: DynamoDB with proper IAM roles
- **Images**: S3 with pre-signed URLs
- **CORS**: Properly configured for your domain

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API Gateway has proper CORS configuration
2. **Authentication Fails**: Check Cognito User Pool settings
3. **Images Not Loading**: Verify S3 bucket permissions
4. **API Errors**: Check CloudWatch logs for Lambda functions

### Debug Commands

```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name real-estate-system-dev

# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/real-estate-system

# Test API endpoint
curl -X GET https://your-api-url/properties
```

## 📚 Learning Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [React Documentation](https://react.dev/)
- [AWS Amplify](https://docs.amplify.aws/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review AWS CloudWatch logs
3. Open an issue on GitHub
4. Check AWS documentation

## 🎯 Next Steps

Once you have the basic system running, consider adding:

- **Advanced Search**: OpenSearch integration
- **Real-time Updates**: WebSocket support
- **Mobile App**: React Native version
- **Analytics**: CloudWatch dashboards
- **CI/CD**: GitHub Actions for deployment
- **Monitoring**: CloudWatch alarms and notifications

---

**Happy Building! 🏠✨**

This project demonstrates modern full-stack development with AWS services while staying within free tier limits. Perfect for learning cloud development and building real-world applications.