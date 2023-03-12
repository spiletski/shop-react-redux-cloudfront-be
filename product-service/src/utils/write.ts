// @ts-nocheck
import { BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { connection } from '../db/connection';
import { readJsonFile } from './utils';
import { Product } from '../db/schemas';
import * as process from 'process';
import * as console from 'console';

export const getItems = (filePath: string, hashKey: string) => {
  const data = readJsonFile(filePath);

  const putItems: any[] = [];

  const getAddProps = (hashKey, item) => {
    return hashKey === 'id'
      ? {
          title: { S: item.title },
          description: { S: item.description },
          price: { N: `${item.price}` },
        }
      : {
          count: { N: `${item.count}` },
        };
  };

  data.forEach((item: Product) => {
    putItems.push({
      PutRequest: {
        Item: {
          [hashKey]: { S: item[hashKey] },
          ...getAddProps(hashKey, item),
        },
      },
    });
  });
  return putItems;
};

export const run = async () => {
  const fileName = process.argv[2] || './src/db/products.json';
  const tableName = process.argv[3] || process.env.TABLE_NAME;
  const hashKey = process.argv[4] || process.env.HAS_KEY_STOCKS;

  try {
    const putItems = getItems(fileName, hashKey);

    const params = {
      RequestItems: {
        [tableName]: putItems,
      },
    };

    const data = await connection.send(new BatchWriteItemCommand(params));
    console.log('Success, items inserted', data);
    return data;
  } catch (err) {
    console.error('Error', err);
  }
};
run();
