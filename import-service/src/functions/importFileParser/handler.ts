import csv from 'csv-parser';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client
} from '@aws-sdk/client-s3';
import {formatJSONResponse} from '@libs/api-gateway';
import * as console from "console";
import { Readable } from 'stream';
export const asStream = (response: GetObjectCommandOutput) => { return response.Body as Readable;};

const { IMPORT_PRODUCT_BUCKET_NAME, REGION, IMPORT_PRODUCT_PARSED_CATALOG_NAME, IMPORT_PRODUCT_CATALOG_NAME } = process.env;

const importFileParser = async (event) => {
    try {
        const { object } = event.Records[0].s3;
        const params = {
            Bucket: IMPORT_PRODUCT_BUCKET_NAME,
            Key: object.key,
        };

        const s3 = new S3Client({ region: REGION });
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);

        const stream = asStream(response).pipe(csv());

        const moveFile = async () => {
           const copyCommand = new CopyObjectCommand({
                CopySource: `${IMPORT_PRODUCT_BUCKET_NAME}/${object.key}`,
                Bucket: IMPORT_PRODUCT_BUCKET_NAME,
                Key: object.key.replace(IMPORT_PRODUCT_CATALOG_NAME, IMPORT_PRODUCT_PARSED_CATALOG_NAME),
            });

           await s3.send(copyCommand);

            const deleteCommand = new DeleteObjectCommand({
                Bucket: IMPORT_PRODUCT_BUCKET_NAME,
                Key: object.key,
            });

            await s3.send(deleteCommand);
        };

        stream
            .on('data',  (data) => {
                console.log(' Parsed data: ', data);
            })
            .on('end', moveFile);
    } catch (e) {
        console.log(' importProductsFile ', e);
        return formatJSONResponse(500, {error: e});
    }
};

export const main = importFileParser;