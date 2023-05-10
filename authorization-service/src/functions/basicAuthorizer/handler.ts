import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import schema from './schema';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import basicAuthorizationService from '../../services/basicAuthorizationService';

const basicAuthorizer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event: APIGatewayTokenAuthorizerEvent,
  _,
  cb,
) => {
  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const { authorizationToken, methodArn } = event;

    const { username, password, encodedCredentials } =
      basicAuthorizationService.getCredentials(authorizationToken);
    const effect = basicAuthorizationService.getPolicyEffect(username, password);
    const policy = basicAuthorizationService.generatePolicy(encodedCredentials, methodArn, effect);

    cb(null, policy);
  } catch (error) {
    cb(error.code);
  }
};

export const main = basicAuthorizer;
