import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {formatJSONResponse} from '@libs/api-gateway';
import * as console from "console";
import ImportService from "../../services/importService";

const { REGION, SQS_URL } = process.env;
const importFileParser = async (event) => {
    try {
        const {object} = event.Records[0].s3;
        const stream = await ImportService.getStream(object);

        const sqsClient = new SQSClient({region: REGION});

        return new Promise(() => {
            stream
                .on('data', (product) => {
                    sqsClient.send(new SendMessageCommand({
                        QueueUrl: SQS_URL,
                        MessageBody: JSON.stringify(product),
                    }), (err, data) => {
                        if (err) {
                            console.log("Error, message was sent :", JSON.stringify(err));
                        } else {
                            console.log("Success, message sent :", JSON.stringify(data));
                        }
                    });
                })
                .on('end', () => ImportService.moveFile(object));
        });
    } catch (e) {
        console.log(' importFileParser ', e);
        return formatJSONResponse(500, {error: e});
    }
};

export const main = importFileParser;