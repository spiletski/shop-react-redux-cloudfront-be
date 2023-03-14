// @ts-nocheck
import { allProducts } from '../utils/procducts';
import { getAllRows, getRowById, createProduct } from '../db/queries';
import * as process from 'process';
import { formatJSONResponse } from '@libs/api-gateway';

const ProductService = {
  async getProductsList() {
    const { TABLE_NAME_PRODUCTS = 'Products', TABLE_NAME_STOCKS = 'Stocks' } = process.env;

    try {
      const products = await getAllRows(TABLE_NAME_PRODUCTS);
      const stocks = await getAllRows(TABLE_NAME_STOCKS);

      const allProductsWithStocks = allProducts(products, stocks);

      console.log(' allProductsWithStocks ', allProductsWithStocks);
      return allProductsWithStocks;
    } catch (e) {
      console.log('error ', e);
    }
  },

  async getProductById(productId: string) {
    const { TABLE_NAME_PRODUCTS = 'Products', TABLE_NAME_STOCKS = 'Stocks' } = process.env;

    try {
      const product = await getRowById(TABLE_NAME_PRODUCTS, productId);
      if (!product) return formatJSONResponse(404, { error: `Auto with ${productId} not found` });

      const stock = await getRowById(TABLE_NAME_STOCKS, productId);
      if (!stock) return formatJSONResponse(404, { error: `Stock with ${productId} not found` });

      return formatJSONResponse(200, { ...product, ...stock });
    } catch (e) {
      console.log('error ', e);
    }
  },
  async createProduct(title, description, price, count) {
    try {
      const product = await createProduct(title, description, price, count);
      if (!product) return formatJSONResponse(404, { error: `Auto with ${productId} not found` });

      return product;
    } catch (e) {
      console.log('error ', e);
    }
  },
};

export default ProductService;
