# Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   AWS Cognito   │    │   API Gateway   │
│   (Frontend)    │◄──►│  (Authentication)│    │   (REST API)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │   Lambda        │
         │                       │              │   Functions     │
         │                       │              │   (Backend)     │
         │                       │              └─────────────────┘
         │                       │                       │
         ▼                       │                       ▼
┌─────────────────┐              │              ┌─────────────────┐
│   S3 Bucket     │              │              │   DynamoDB      │
│  (Static Host)  │              │              │   (Database)    │
└─────────────────┘              │              └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│   S3 Bucket     │              │                       │
│  (Images)       │              │                       │
└─────────────────┘              │                       │
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐    ┌─────────────────┐
                        │   CloudWatch    │    │   IAM Roles     │
                        │  (Monitoring)   │    │ (Permissions)   │
                        └─────────────────┘    └─────────────────┘
```

## Component Details

### Frontend (React + Vite)
- **Location**: S3 Static Website Hosting
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Query + Context API
- **Authentication**: AWS Amplify SDK

### Authentication (AWS Cognito)
- **User Pool**: Email-based signup/login
- **Features**: Email verification, password reset
- **Security**: JWT tokens, secure password policies
- **Integration**: Seamless with API Gateway

### Backend (Lambda + API Gateway)
- **API Gateway**: RESTful endpoints with CORS
- **Lambda Functions**:
  - Properties API (CRUD operations)
  - Image Upload (pre-signed URLs)
- **Authorization**: Cognito JWT tokens
- **Error Handling**: Comprehensive error responses

### Database (DynamoDB)
- **Table**: Properties with GSI for type-based queries
- **Schema**: Optimized for real estate data
- **Features**: Auto-scaling, pay-per-request
- **Indexes**: Type + CreatedAt for efficient queries

### Storage (S3)
- **Frontend Bucket**: Static website hosting
- **Images Bucket**: Property photos with pre-signed URLs
- **Security**: Public read for images, private for uploads
- **CDN**: CloudFront ready (optional)

### Infrastructure (CloudFormation)
- **Template**: Complete infrastructure as code
- **Resources**: All AWS services defined
- **Deployment**: One-click setup
- **Cleanup**: Easy resource removal

## Data Flow

### User Registration/Login
1. User submits credentials → Cognito
2. Cognito validates → Returns JWT token
3. Frontend stores token → Uses for API calls

### Property Management
1. User creates property → Frontend
2. Frontend calls API Gateway → Lambda
3. Lambda validates JWT → Cognito
4. Lambda saves to DynamoDB → Returns property
5. Frontend updates UI → React Query cache

### Image Upload
1. User selects image → Frontend
2. Frontend requests pre-signed URL → Lambda
3. Lambda generates URL → Returns to frontend
4. Frontend uploads to S3 → Direct upload
5. Frontend saves image URL → Property data

## Security Features

- **Authentication**: JWT tokens via Cognito
- **Authorization**: API Gateway with Cognito authorizer
- **Data Protection**: DynamoDB with IAM roles
- **Image Security**: S3 pre-signed URLs
- **CORS**: Properly configured for security
- **HTTPS**: All communications encrypted

## Scalability

- **Auto-scaling**: Lambda and DynamoDB scale automatically
- **CDN Ready**: CloudFront integration possible
- **Database**: DynamoDB handles millions of requests
- **Storage**: S3 scales to unlimited capacity
- **API**: API Gateway handles high traffic

## Cost Optimization

- **Free Tier**: Designed to stay within limits
- **Pay-per-use**: Lambda and DynamoDB pricing
- **Storage**: S3 lifecycle policies possible
- **Monitoring**: CloudWatch for cost tracking

## Monitoring & Logging

- **CloudWatch**: Centralized logging
- **Lambda Logs**: Function execution logs
- **API Gateway**: Request/response logs
- **DynamoDB**: Access patterns and metrics
- **S3**: Access logs and metrics

## Development Workflow

1. **Local Development**: React dev server
2. **Testing**: Local API testing
3. **Deployment**: CloudFormation stack
4. **Monitoring**: CloudWatch dashboards
5. **Updates**: Incremental deployments

## Future Enhancements

- **Search**: OpenSearch integration
- **Real-time**: WebSocket support
- **Mobile**: React Native app
- **Analytics**: Advanced dashboards
- **CI/CD**: Automated deployments
- **Multi-region**: Global deployment
