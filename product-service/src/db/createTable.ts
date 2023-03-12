/*
aws dynamodb create-table \
    --table-name Products \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --billing-mode PROVISIONED

aws dynamodb create-table \
    --table-name Stocks \
    --attribute-definitions \
        AttributeName=product_id,AttributeType=S \
    --key-schema \
        AttributeName=product_id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --billing-mode PROVISIONED

*/
