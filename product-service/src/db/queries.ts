// @ts-nocheck
import { ddbDocClient } from './connection';
import { QueryCommand, ScanCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import * as process from 'process';
import * as console from 'console';
import { v4 as uuidv4 } from 'uuid';

export const getAllRows = async (tableName: string) => {
  const params = (tableName) => ({
    TableName: tableName,
    KeyConditionExpression: '',
    Limit: 100,
  });

  try {
    const data = await ddbDocClient.send(new ScanCommand(params(tableName)));
    console.log('success', data.Items);
    return data.Items;
  } catch (err) {
    console.log('Error', err);
  }
};

export const getRowById = async (tableName: string, productId: string) => {
  console.log('@@@@@@@@@@ getRowById ', tableName, productId);

  const getAdditionalParams = () =>
    tableName === process.env.TABLE_NAME_PRODUCTS
      ? {
          ProjectionExpression: 'id, title, description, price',
          ExpressionAttributeValues: { ':id': productId },
          KeyConditionExpression: 'id = :id',
        }
      : {
          ProjectionExpression: 'product_id, #c',
          ExpressionAttributeValues: { ':product_id': productId },
          ExpressionAttributeNames: { '#c': 'count' },
          KeyConditionExpression: 'product_id = :product_id',
        };

  const getParams = (tableName) => ({
    TableName: tableName,
    Limit: 1,
    ...getAdditionalParams(),
  });

  try {
    const data = await ddbDocClient.send(new QueryCommand(getParams(tableName)));
    console.log('success', data.Items);
    return data.Items[0];
  } catch (err) {
    console.log('Error', err);
  }
};

export const createProduct = async (
  title: string,
  description: string,
  price: number,
  count: number
) => {
  const { TABLE_NAME_PRODUCTS = 'Products', TABLE_NAME_STOCKS = 'Stocks' } = process.env;

  const id = uuidv4();
  const params = {
    TransactItems: [
      {
        Put: {
          Item: {
            id: id,
            title: title,
            description: description,
            price: price,
          },
          TableName: TABLE_NAME_PRODUCTS,
        },
      },
      {
        Put: {
          Item: {
            product_id: id,
            count: count,
          },
          TableName: TABLE_NAME_STOCKS,
        },
      },
    ],
  };
  try {
    const data = await ddbDocClient.send(new TransactWriteCommand(params));
    console.log('success', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
