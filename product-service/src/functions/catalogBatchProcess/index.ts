import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:883718311022:catalogItemsQueue',
                batchSize: 5
            }
        },
    ],
};
