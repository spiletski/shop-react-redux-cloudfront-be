import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'task-4',
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
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks',
    },
  },
  functions: { getProductsList, getProductById, createProduct },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: true,
      packager: 'npm',
      excludeFiles: 'src/**/*.test.js',
    },
  },
};

module.exports = serverlessConfiguration;
