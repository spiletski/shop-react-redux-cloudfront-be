import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: "products/{productId}",
        description: 'Get product by id',
        responseData: {
          200: {
            description: 'Product description',
            bodyType: 'ProductResponse',
          },
          404: 'Product not found',
        },
      },
    },
  ],
};
