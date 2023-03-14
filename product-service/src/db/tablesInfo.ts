import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const { REGION } = process.env;
const ddbClient = new DynamoDBClient({ region: REGION });
export { ddbClient };
