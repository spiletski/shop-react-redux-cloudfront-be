import csv from 'csv-parser';
import {S3Client} from '@aws-sdk/client-s3';
import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import { S3CreateEvent } from "aws-lambda";

// TODO will be updated
const importProductsFile: S3CreateEvent<any> = async (event) => {
    try {
        const params = {
            Bucket: process.env.IMPORT_PRODUCT_BUCKET_NAME,
            Key: event.Records[0].s3.object.key,
        };

        const s3 = new S3Client({ region: process.env.REGION });
        const moveDeleteFile = async () => {
            await s3
                .copyObject({
                    Bucket: process.env.IMPORT_PRODUCT_BUCKET_NAME,
                    CopySource: encodeURI(`${process.env.IMPORT_PRODUCT_BUCKET_NAME}/${event.Records[0].s3.object.key}`),
                    Key: event.Records[0].s3.object.key.replace(process.env.IMPORT_PRODUCT_CATALOG_NAME, process.env.IMPORT_PRODUCT_PARSED_CATALOG_NAME),
                })
                .promise();

            await s3
                .deleteObject({
                    Bucket: process.env.IMPORT_PRODUCT_BUCKET_NAME,
                    Key: event.Records[0].s3.object.key,
                })
                .promise();
        };

        try {
            return new Promise((_, reject) => {
                s3.getObject(params)
                    .createReadStream()
                    .pipe(csv())
                    .on('data', (data) => console.log('Parsed data: ', data))
                    .on('end', moveDeleteFile);
            });
    } catch (e) {
        console.log(' importProductsFile ', e);
        return formatJSONResponse(500, {error: e});
    }
};

export const main = middyfy(importProductsFile);