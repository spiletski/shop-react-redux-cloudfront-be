import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        description: 'Get all products',
        responseData: {
          200: {
            description: 'All products list',
            bodyType: 'ProductsResponse',
          },
        },
      },
    },
  ],
};
