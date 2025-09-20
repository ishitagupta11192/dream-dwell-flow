# Quick Setup Guide - Real Estate Management System

## 🚀 5-Minute Setup

### Step 1: Prerequisites
- [ ] AWS Account with CLI configured
- [ ] Node.js 18+ installed
- [ ] Git installed

### Step 2: Deploy Everything
```bash
# Clone and setup
git clone <your-repo>
cd dream-dwell-flow
npm install

# Deploy to AWS (Windows)
.\aws-infrastructure\deploy.ps1

# OR Deploy to AWS (Linux/Mac)
chmod +x aws-infrastructure/deploy.sh
./aws-infrastructure/deploy.sh
```

### Step 3: Access Your App
After deployment, you'll see:
- **Frontend URL**: Your React app hosted on S3
- **API URL**: Your backend API

Visit the Frontend URL to start using your app!

## 🎯 What Gets Created

### AWS Resources (Free Tier)
- ✅ **S3 Buckets**: Frontend hosting + image storage
- ✅ **Cognito**: User authentication
- ✅ **DynamoDB**: Property database
- ✅ **Lambda**: Backend API functions
- ✅ **API Gateway**: REST API endpoints
- ✅ **CloudFormation**: Infrastructure management

### Frontend Features
- ✅ **Authentication**: Sign up, login, logout
- ✅ **Property Listings**: View all properties
- ✅ **Search & Filter**: Find properties by criteria
- ✅ **Responsive Design**: Works on all devices
- ✅ **Modern UI**: Beautiful interface with shadcn/ui

## 🔧 Configuration

The deployment script automatically creates a `.env` file with your AWS configuration:

```env
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=your-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-client-id
VITE_API_URL=https://your-api-url
```

## 🧪 Testing Your Setup

1. **Visit your Frontend URL**
2. **Create an account** (check email for confirmation code)
3. **Sign in** with your credentials
4. **Browse properties** (starts with sample data)
5. **Test search and filters**

## 🆘 Common Issues

### "AWS CLI not configured"
```bash
aws configure
# Enter your Access Key ID, Secret Key, Region (us-east-1), Output (json)
```

### "Permission denied" on deploy script
```bash
# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Linux/Mac
chmod +x aws-infrastructure/deploy.sh
```

### "Stack creation failed"
- Check AWS permissions
- Ensure you're in the correct region (us-east-1)
- Verify AWS CLI is working: `aws sts get-caller-identity`

## 💰 Cost Monitoring

Your app stays within AWS Free Tier:
- **S3**: 5GB storage + 20K requests/month
- **Lambda**: 1M requests/month
- **DynamoDB**: 25GB + 25 RCUs/WCUs
- **Cognito**: 50K monthly active users
- **API Gateway**: 1M API calls/month

## 🎉 Success!

You now have a fully functional real estate management system running on AWS! 

### Next Steps:
- Add your own properties
- Customize the UI
- Add more features
- Scale as needed

### Cleanup (when done testing):
```bash
# Windows
.\aws-infrastructure\deploy.ps1 cleanup

# Linux/Mac
./aws-infrastructure/deploy.sh cleanup
```

---

**Need help?** Check the full README.md for detailed documentation and troubleshooting.
