import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as process from 'process';

const REGION = process.env.REGION || 'us-east-1';
const ddbClient = new DynamoDBClient({ region: REGION });

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
export { ddbClient, ddbDocClient };
