import * as AWSMock from 'aws-sdk-mock';
import {catalogBatchProcess, main} from './handler';
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {AUTOS} from "@functions/getProductsList/autos-mock";
import ProductService from "../../services/productService";

jest.mock('@middy/core', () => {
    return (handler) => {
        return {
            use: jest.fn().mockReturnValue(handler),
        }
    }
});

afterAll(() => {
    AWSMock.restore('S3');
});

describe('catalogBatchProcess', () => {
    const event = { Records: [...AUTOS.map(auto => ({ 'body': JSON.stringify(auto) }))]};


    test('publishToTopic', async () => {
        const spyPublishToTopic = jest.spyOn(ProductService.publishToTopic, 'ProductService.publishToTopic').mockResolvedValue({});
        await catalogBatchProcess(event);
        expect(spyPublishToTopic).toHaveBeenCalled();
    });

    test('should return 500 status code when error', async () => {
        const spyPublishToTopic = jest.spyOn(ProductService.publishToTopic, 'ProductService.publishToTopic').mockRejectedValue({ error: 'some error'});
        await catalogBatchProcess(event);
        expect(spyPublishToTopic).not.toHaveBeenCalled();
        const dummyProxyEvent: Partial<APIGatewayProxyEvent> = {
            body: 'test',
        };

        const dummyContext: Partial<Context> = {
            functionName: "functionName"
        };
        const response = await main(dummyProxyEvent as any, dummyContext as Context);

        expect(response.statusCode).toBe(500);
    });
});