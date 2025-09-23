import { Amplify } from 'aws-amplify';

// Check if AWS environment variables are available
const hasAwsConfig = 
  import.meta.env.VITE_USER_POOL_ID && 
  import.meta.env.VITE_USER_POOL_CLIENT_ID &&
  import.meta.env.VITE_AWS_REGION &&
  import.meta.env.VITE_USER_POOL_ID !== 'placeholder-user-pool-id' &&
  import.meta.env.VITE_USER_POOL_CLIENT_ID !== 'placeholder-user-pool-client-id';

// Set default API URL for local development
// Use Vite proxy in development to avoid CORS issues
const defaultApiUrl = import.meta.env.DEV ? '/api' : 'https://96u9wkknn2.execute-api.us-east-1.amazonaws.com/dev';

// AWS Configuration - only configure if we have the required environment variables
if (hasAwsConfig) {
  const awsConfig = {
    Auth: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_USER_POOL_ID || '',
      userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || '',
      mandatorySignIn: false, // Set to false to allow unauthenticated access
      authenticationFlowType: 'USER_SRP_AUTH',
    },
    API: {
      endpoints: [
        {
          name: 'RealEstateAPI',
          endpoint: import.meta.env.VITE_API_URL || '',
          region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
        },
      ],
    },
    Storage: {
      AWSS3: {
        bucket: import.meta.env.VITE_S3_BUCKET || '',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      },
    },
  };

  // Configure Amplify only if we have valid config
  try {
    Amplify.configure(awsConfig);
    console.log('AWS Amplify configured successfully');
  } catch (error) {
    console.warn('Failed to configure AWS Amplify:', error);
  }
} else {
  console.log('AWS environment variables not found. Running in demo mode without authentication.');
}

export { hasAwsConfig, defaultApiUrl };
export default hasAwsConfig;
