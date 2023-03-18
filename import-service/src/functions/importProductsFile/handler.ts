import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import * as process from "process";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import * as console from "console";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
    try {
        const { name } = event.queryStringParameters;

        const params = {
            Bucket: process.env.IMPORT_PRODUCT_BUCKET_NAME,
            Key: `${process.env.IMPORT_PRODUCT_CATALOG_NAME}/${name}`,
            ContentType: 'text/csv',
        };

        const s3 = new S3Client({ region: process.env.REGION });
        const command = new GetObjectCommand(params);
        const signedUrl = await getSignedUrl(s3, command);

        return formatJSONResponse(200, {signedUrl});
    } catch (e) {
        console.log(' importProductsFile ', e);
        return formatJSONResponse(500, {error: e});
    }
};

export const main = middyfy(importProductsFile);