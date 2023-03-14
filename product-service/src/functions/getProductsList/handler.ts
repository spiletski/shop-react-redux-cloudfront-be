import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import ProductService from '../../services/productService';
import { APIGatewayProxyResult} from "aws-lambda";

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    try {
        const products = await ProductService.getProductsList();

        return formatJSONResponse(200, { products });
    } catch (e) {
        return formatJSONResponse(500, { error: e });
    }
};

export const main = middyfy(getProductsList);
