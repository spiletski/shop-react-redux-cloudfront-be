import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from '../../services/productService';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const getProductsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(' getProductsList ', event);
  try {
    const products = await ProductService.getProductsList();

    return formatJSONResponse(200, { products });
  } catch (e) {
    console.log(' getProductsList ', e);
    return formatJSONResponse(500, { error: e });
  }
};

export const main = middyfy(getProductsList);
