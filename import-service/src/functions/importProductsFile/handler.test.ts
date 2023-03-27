import * as AWSMock from 'aws-sdk-mock';
import { main } from './handler';
import {APIGatewayProxyEvent, Context} from "aws-lambda";

jest.mock('@middy/core', () => {
    return (handler) => {
        return {
            use: jest.fn().mockReturnValue(handler),
        }
    }
})

beforeAll(() => {
    AWSMock.mock('S3', 'getSignedUrlPromise', (_, __, callback) => {
        callback(null, null);
    });
});

afterAll(() => {
    AWSMock.restore('S3');
});

describe('Import products file', () => {
    test('should return 200 status code', async () => {
        const dummyProxyEvent: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { name: 'name_of_file' },
            body: '',
        };

        const dummyContext: Partial<Context> = {
            functionName: "functionName"
        };

        const response = await main(dummyProxyEvent as any, dummyContext as Context);

        expect(response.statusCode).toBe(200);
    });

    test('should return 500 status code when the file name is missed', async () => {
        const dummyProxyEvent: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { wrong_name: 'name_of_file' },
            body: '',
        };

        const dummyContext: Partial<Context> = {
            functionName: "functionName"
        };
        const response = await main(dummyProxyEvent as any, dummyContext as Context);

        expect(response.statusCode).toBe(400);
    });
});