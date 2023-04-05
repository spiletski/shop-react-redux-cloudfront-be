import { formatJSONResponse } from '@libs/api-gateway';
import { SQSEvent } from 'aws-lambda';
import ProductService from '../../services/productService';
import { middyfy } from '@libs/lambda';

export const catalogBatchProcess = async (event: SQSEvent)=> {
  try {
    const products = event.Records.map(record => JSON.parse(record.body));

    await Promise.all(products.map(async (product) => {
      const { title, description, price, count } = product;

      await ProductService.createProduct(title, description, Number(price), Number(count));
      await ProductService.publishToTopic(JSON.stringify(product));
    }
  ));

    return formatJSONResponse(200, { auto: event });
  } catch (e) {
    return formatJSONResponse(500, { error: e });
  }
};

export const main = middyfy(catalogBatchProcess);
