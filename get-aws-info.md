# Get Your AWS Configuration Values

Since you already have the Cognito values, here's how to get the remaining configuration:

## Current Values (from your env.example):
```
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=us-east-1_uge27csqR
VITE_USER_POOL_CLIENT_ID=1cg1285uf0uuaotiojlc3mblli
```

## Missing Values to Get:

### 1. API Gateway URL
1. Go to [AWS API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Click on your API (should be named something like "real-estate-system-api-dev")
3. Click on "Stages" in the left sidebar
4. Click on "dev" stage
5. Copy the "Invoke URL" - it will look like: `https://abcdefghij.execute-api.us-east-1.amazonaws.com/dev`

### 2. S3 Bucket Name for Images
1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Look for a bucket named something like "real-estate-system-images-dev"
3. Copy the bucket name

### 3. Update Your .env File
Create a `.env` file in your project root with these values:

```env
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=us-east-1_uge27csqR
VITE_USER_POOL_CLIENT_ID=1cg1285uf0uuaotiojlc3mblli
VITE_API_URL=https://your-actual-api-gateway-url
VITE_S3_BUCKET=your-actual-images-bucket-name
```

## Alternative: Use AWS CLI (if installed)
If you have AWS CLI installed, you can run:
```bash
aws cloudformation describe-stacks --stack-name real-estate-system-dev --query 'Stacks[0].Outputs' --output table
```

## Test Your Configuration
Once you have all values:
1. Create the `.env` file with your actual values
2. Run `npm run dev` to start the development server
3. Visit `http://localhost:5173` to test your app
4. Try creating an account and signing in

## Deploy Frontend to S3
After testing locally, you can deploy to S3:
```bash
npm run build
aws s3 sync dist/ s3://your-frontend-bucket-name --delete
```

Your frontend will then be available at the S3 website URL!
