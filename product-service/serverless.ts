import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-dotenv-plugin', 'serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: 'Products',
      STOCKS_TABLE: 'Stocks',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: '${self:custom.SNS_ARN}'
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:PutItem',
              'dynamodb:DescribeTable',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: '${self:custom.PRODUCTS_TABLE}',
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:PutItem',
              'dynamodb:DescribeTable',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: '${self:custom.STOCKS_TABLE}',
          }
        ]
      }
    },
  },
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    SQS: 'catalogItemsQueue',
    SNS: 'createProductTopic',
    SNS_ARN: 'arn:aws:sns:us-east-1:883718311022:createProductTopic',
    PRODUCTS_TABLE: 'arn:aws:dynamodb:us-east-1:883718311022:table/Products',
    STOCKS_TABLE: 'arn:aws:dynamodb:us-east-1:883718311022:table/Stocks',
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: true,
      packager: 'npm',
      excludeFiles: 'src/**/*.test.js',
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:custom.SQS}',
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${self:custom.SNS}',
          DisplayName: 'Products Topic'
        }
      },
      snsKiaSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint : 'bye-bye@tut.by',
          Protocol : 'email',
          TopicArn : { 'Ref' : 'createProductTopic' },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: {
            title: [
              'kia'
            ]
          }
        },
      },
      snsBmwSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint : 'stanislau@mail.ru',
          Protocol : 'email',
          TopicArn : { 'Ref' : 'createProductTopic' },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: {
            title: [
              'bmw'
            ]
          }
        },
      }
    }
  }
};

module.exports = serverlessConfiguration;
