import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import ProductService from '../../services/productService';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { productId } = event.pathParameters;

    if (!productId) return formatJSONResponse(400, { error: "Please provide auto id"})

    try {
        const auto = await ProductService.getProductById(productId);

        if (!auto) return formatJSONResponse(404, { error: `Auto with ${productId} not found`})

        return formatJSONResponse(200, { auto });
    } catch (e) {
        return formatJSONResponse(500, { error: e });
    }
};

export const main = middyfy(getProductById);
