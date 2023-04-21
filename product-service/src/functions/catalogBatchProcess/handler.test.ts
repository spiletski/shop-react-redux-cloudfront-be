import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { catalogBatchProcess } from './handler';
import { AUTOS } from '@functions/getProductsList/autos-mock';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
jest.mock('@middy/core', () => {
  return (handler) => {
    return {
      use: jest.fn().mockReturnValue(handler),
    };
  };
});

const ddbMock = mockClient(DynamoDBDocumentClient);
const snsMock = mockClient(SNSClient);

describe('catalogBatchProcess', () => {
  beforeEach(() => {
    ddbMock.reset();
    snsMock.reset();
  });

  test('should correct publish product', async () => {
    const event: any = { Records: [{ body: JSON.stringify(AUTOS[0]) }] };

    ddbMock.on(TransactWriteCommand).resolves({});
    snsMock.on(PublishCommand).resolves({});

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      product: 'success',
    });
  });

  test('should throw an error', async () => {
    const event: any = { Records: [{ body: JSON.stringify(AUTOS[0]) }] };

    ddbMock.on(TransactWriteCommand).resolves({});
    snsMock.on(PublishCommand).rejects({});

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error: {},
    });
  });
});
