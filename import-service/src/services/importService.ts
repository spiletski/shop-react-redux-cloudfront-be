import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client
} from "@aws-sdk/client-s3";
import csv from "csv-parser";
import {Readable} from "stream";

const { IMPORT_PRODUCT_BUCKET_NAME, REGION, IMPORT_PRODUCT_PARSED_CATALOG_NAME, IMPORT_PRODUCT_CATALOG_NAME } = process.env;

const asStream = (response: GetObjectCommandOutput) => response.Body as Readable;

const s3 = new S3Client({region: REGION});

const ImportService = {
    async getStream(object) {
        const params = {
            Bucket: IMPORT_PRODUCT_BUCKET_NAME,
            Key: object.key,
        };

        const command = new GetObjectCommand(params);
        const response = await s3.send(command);

        return asStream(response).pipe(csv({separator: ','}));
    },

    async moveFile (object) {
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
    }
};
export default ImportService;