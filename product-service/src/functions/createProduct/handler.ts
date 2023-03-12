import { formatJSONResponse } from '@libs/api-gateway';
import ProductService from '../../services/productService';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateData } from '@functions/validataion/validateProduct';
import { middyfy } from '@libs/lambda';
import httpErrorHandler from '@middy/http-error-handler';

export const createProduct = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(' createProduct ', event, event.body);

  try {
    // @ts-ignore
    const { title, description, price, count } = event.body;

    const errors = validateData(event.body);

    if (errors) {
      console.log('Validation error ', errors);
      return formatJSONResponse(400, { error: 'New auto data is invalid', errors: errors });
    }

    const auto = await ProductService.createProduct(title, description, price, count);

    console.log('Auto is created : ', auto);

    return formatJSONResponse(200, { auto: event.body });
  } catch (e) {
    return formatJSONResponse(500, { error: e });
  }
};

export const main = middyfy(createProduct).use(httpErrorHandler());
