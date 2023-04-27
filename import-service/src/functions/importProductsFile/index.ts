import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        response: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        authorizer: {
          name: 'BasicAuthorizer',
          arn: 'arn:aws:lambda:us-east-1:883718311022:function:authorization-service-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: 'token',
        }
      },
    },
  ],
};
