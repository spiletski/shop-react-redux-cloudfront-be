export const allProducts = (products, stocks) => {
  return products.map((product) => ({
    ...stocks.find((stock) => stock.product_id === product.id && stock),
    ...product,
  }));
};
