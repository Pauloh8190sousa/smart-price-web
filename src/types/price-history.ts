export interface PriceHistory {
  id: string;
  oldPrice: number;
  newPrice: number;
  changedAt: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
}
