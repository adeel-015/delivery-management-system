import mongoose, { Schema, Document, Types } from "mongoose";

type HistoryEntry = {
  stage: string;
  timestamp: Date;
  actorId?: Types.ObjectId;
  actorName?: string;
  action?: string;
};

export interface IOrder extends Document {
  items: string[];
  currentStage: number;
  buyerId?: Types.ObjectId | null;
  sellerId?: Types.ObjectId | null;
  history: HistoryEntry[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  addHistory(
    stage: string,
    actorId?: Types.ObjectId,
    actorName?: string,
    action?: string
  ): void;
}

const OrderSchema: Schema = new Schema(
  {
    items: { type: [String], required: true },
    currentStage: { type: Number, default: 1, min: 1, max: 7 },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    history: [
      {
        stage: String,
        timestamp: { type: Date, default: Date.now },
        actorId: { type: Schema.Types.ObjectId, ref: "User" },
        actorName: String,
        action: String,
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const stageNames = [
  "Order Placed",
  "Buyer Associated",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

OrderSchema.virtual("stageName").get(function (this: IOrder) {
  return stageNames[this.currentStage - 1] || "Unknown";
});

OrderSchema.methods.addHistory = function (
  stage: string,
  actorId?: Types.ObjectId,
  actorName?: string,
  action?: string
) {
  this.history.push({
    stage,
    timestamp: new Date(),
    actorId,
    actorName,
    action,
  });
};

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
