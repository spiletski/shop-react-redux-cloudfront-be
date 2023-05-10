const { GITHUB_USER, PASSWORD } = process.env;

const basicAuthorizationService = {
  getCredentials(token) {
    const encodedCredentials = token.split(' ')[1];
    const buff = Buffer.from(encodedCredentials, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    return { encodedCredentials, username, password };
  },

  getPolicyEffect(username, password) {
    const correctUser = username === GITHUB_USER;
    const correctPassword = PASSWORD === password;

    return correctUser && correctPassword ? 'Allow' : 'Deny';
  },

  generatePolicy(principalId, resource, effect = 'Allow') {
    return {
      principalId: principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
      context: {
        exampleKey: `effect is ${effect}, ${principalId}`,
      },
    };
  },
};
export default basicAuthorizationService;
