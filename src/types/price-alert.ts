export interface PriceAlert {
  id: string;
  targetPrice: number;
  active: boolean;
  createdAt: string;

  userId: string;
  userName: string;

  productId: string;
  productName: string;
}
