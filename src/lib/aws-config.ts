import { Amplify } from 'aws-amplify';

// AWS Configuration
const awsConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID || '',
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || '',
    mandatorySignIn: true,
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

// Configure Amplify
Amplify.configure(awsConfig);

export default awsConfig;
