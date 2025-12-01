export type User = { id: string; name: string; email: string; role: string };

export type HistoryEntry = {
  stage: string;
  timestamp: string;
  actorId?: string;
  actorName?: string;
  action?: string;
};

export type MaybeUserRef =
  | string
  | {
      _id: string;
      name?: string;
      email?: string;
    }
  | null;
export type Order = {
  _id?: string;
  items: string[];
  currentStage: number;
  stageName?: string;
  buyerId?: MaybeUserRef;
  sellerId?: MaybeUserRef;
  buyer?: Partial<User>;
  seller?: Partial<User>;
  history?: HistoryEntry[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const STAGE_NAMES = [
  "Order Placed",
  "Buyer Associated",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export type Stats = {
  totalOrders: number;
  ordersByStage: Record<string, number>;
  avgDeliveryTime?: number | null;
};
