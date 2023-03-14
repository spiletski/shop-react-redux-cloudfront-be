export type Stock = {
  product_id: string;
  count: number;
};

export interface SticksResponse {
  stocks: Stock[];
}

export interface ProductResponse {
  stock: Stock;
}
