// Test your AWS configuration
// Run this with: node test-config.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing AWS Configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Please create a .env file with your AWS configuration values.');
  console.log('📋 See get-aws-info.md for instructions on how to get the values.\n');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('📋 Current Configuration:');
console.log('========================');

// Check required variables
const requiredVars = [
  'VITE_AWS_REGION',
  'VITE_USER_POOL_ID', 
  'VITE_USER_POOL_CLIENT_ID',
  'VITE_API_URL',
  'VITE_S3_BUCKET'
];

let allConfigured = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (value && value !== `your-${varName.toLowerCase().replace('vite_', '').replace('_', '-')}`) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: Not configured or using placeholder value`);
    allConfigured = false;
  }
});

console.log('\n========================');

if (allConfigured) {
  console.log('🎉 All configuration values are set!');
  console.log('🚀 You can now run: npm run dev');
  console.log('🌐 Then visit: http://localhost:5173');
} else {
  console.log('⚠️  Some configuration values are missing or using placeholders.');
  console.log('📖 Please check get-aws-info.md for instructions on how to get the values.');
}

console.log('\n💡 Tips:');
console.log('- Make sure your AWS resources are deployed');
console.log('- Check that your Cognito User Pool is active');
console.log('- Verify your API Gateway is deployed');
console.log('- Ensure your S3 buckets exist');
