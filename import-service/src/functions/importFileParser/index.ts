import { handlerPath } from '@libs/handler-resolver';
import * as process from "process";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: process.env.IMPORT_PRODUCT_BUCKET_NAME,
                event: "s3:ObjectCreated:*",
                rules: [
                    {
                        prefix: `uploaded/`
                    },
                ],
                existing: true
            },
        },
    ],
};