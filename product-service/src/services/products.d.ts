export type Product = {
    "id": string;
    "count": number;
    "price": number;
    "title": string;
    "description": string;
}

export interface ProductsResponse {
    products: Product[];
}

export interface ProductResponse {
    product: Product
}