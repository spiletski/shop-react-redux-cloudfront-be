import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-dotenv-plugin', 'serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_BUCKET: 'app-shop-bucket',
      S3_KEY_PRODUCTS: 'uploaded',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: 'arn:aws:s3:::app-shop-bucket'
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: 'arn:aws:s3:::app-shop-bucket/*'
          },
          {
            Effect: 'Allow',
            Action: [
                'sqs:*'
            ],
            Resource: [
                'arn:aws:sqs:us-east-1:883718311022:catalogItemsQueue/*'
            ]
          }
        ]
      }
    },
  },

  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.WWW-Authenticate': "'Basic'",
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ResponseType: 'UNAUTHORIZED',
          StatusCode: '401'
        }
      },
      GatewayResponseForbidden: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ResponseType: 'ACCESS_DENIED',
          StatusCode: '403'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
