import express from "express";
import { body, validationResult } from "express-validator";
import Order, { stageNames } from "../models/Order";
import User from "../models/User";
import { authenticate, authorize } from "../middleware/auth";
import { getIO, emitToRooms } from "../socket/socketManager";
import mongoose from "mongoose";

const router = express.Router();

// PUT /orders/:id/assign-seller (Admin only) - assign a seller to order
router.put(
  "/:id/assign-seller",
  authenticate,
  authorize("admin"),
  body("sellerId").isString(),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const { sellerId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(sellerId))
        return res.status(400).json({ message: "Invalid sellerId" });
      const seller = await User.findById(sellerId);
      if (!seller || seller.role !== "seller")
        return res
          .status(400)
          .json({ message: "Seller not found or invalid role" });
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      order.sellerId = seller._id;
      order.addHistory(
        "Seller Assigned",
        req.user!._id,
        req.user!.name,
        `assigned seller ${seller._id}`
      );
      await order.save();
      // notify seller and admins
      emitToRooms("seller_assigned", order, [
        "admin-room",
        `user-${seller._id}`,
      ]);
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /orders (Buyer only)
router.post(
  "/",
  authenticate,
  authorize("buyer"),
  body("items").isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const user = req.user!;
    try {
      // check active order for this buyer
      const active = await Order.findOne({
        buyerId: user._id,
        isDeleted: false,
        currentStage: { $lt: 7 },
      });
      if (active)
        return res
          .status(400)
          .json({ message: "You already have an active order" });
      const { items } = req.body;
      // Associate buyer immediately on order creation
      const order = new Order({
        items,
        sellerId: null,
        buyerId: user._id,
        currentStage: 1,
      });
      order.addHistory("Order Placed", user._id, user.name, "created by buyer");
      await order.save();
      try {
        emitToRooms("order_created", order, ["admin-room"]);
      } catch (e) {}
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /orders
router.get("/", authenticate, async (req, res) => {
  const user = req.user!;
  try {
    let filter: any = { isDeleted: false };
    if (user.role === "buyer") filter.buyerId = user._id;
    if (user.role === "seller") filter.sellerId = user._id;
    const orders = await Order.find(filter)
      .populate("buyerId", "name email")
      .populate("sellerId", "name email");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /orders/:id/associate (Admin only)
router.put(
  "/:id/associate",
  authenticate,
  authorize("admin"),
  body("buyerId").isString(),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const { buyerId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(buyerId))
        return res.status(400).json({ message: "Invalid buyerId" });
      const buyer = await User.findById(buyerId);
      if (!buyer || buyer.role !== "buyer")
        return res
          .status(400)
          .json({ message: "Buyer not found or invalid role" });
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      // ensure buyer has no active order
      const active = await Order.findOne({
        buyerId: buyer._id,
        isDeleted: false,
        currentStage: { $lt: 7 },
      });
      if (active)
        return res
          .status(400)
          .json({ message: "Buyer already has an active order" });
      
      // Store old buyer ID to notify them
      const oldBuyerId = order.buyerId;
      
      order.buyerId = buyer._id;
      order.currentStage = 2;
      order.addHistory(
        stageNames[1],
        req.user!._id,
        req.user!.name,
        `associated buyer ${buyer._id}`
      );
      await order.save();
      
      // Notify both old and new buyer, plus admin
      const rooms = ["admin-room", `user-${buyer._id}`];
      if (oldBuyerId) {
        rooms.push(`user-${oldBuyerId}`);
      }
      emitToRooms("buyer_associated", order, rooms);
      
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /orders/:id/next-stage (Seller only)
router.put(
  "/:id/next-stage",
  authenticate,
  authorize("seller"),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (
        !order.sellerId ||
        order.sellerId.toString() !== req.user!._id.toString()
      )
        return res.status(403).json({ message: "Not your order" });
      if (order.currentStage >= 7)
        return res.status(400).json({ message: "Order already delivered" });
      order.currentStage += 1;
      const stageLabel =
        stageNames[order.currentStage - 1] || `${order.currentStage}`;
      order.addHistory(
        stageLabel,
        req.user!._id,
        req.user!.name,
        "advance stage"
      );
      await order.save();
      const rooms = ["admin-room"];
      if (order.buyerId) rooms.push(`user-${order.buyerId}`);
      rooms.push(`user-${order.sellerId}`);
      emitToRooms("order_updated", order, rooms);
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /orders/:id (Seller only - soft delete)
router.delete("/:id", authenticate, authorize("seller"), async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      !order.sellerId ||
      order.sellerId.toString() !== req.user!._id.toString()
    )
      return res.status(403).json({ message: "Not your order" });
    order.isDeleted = true;
    order.addHistory("Deleted", req.user!._id, req.user!.name, "soft delete");
    await order.save();
    
    // Notify admin, seller, and buyer
    const rooms = ["admin-room", `user-${order.sellerId}`];
    if (order.buyerId) {
      rooms.push(`user-${order.buyerId}`);
    }
    emitToRooms("order_deleted", order, rooms);
    
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /orders/:id/details (Admin only)
router.get(
  "/:id/details",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "buyerId sellerId",
        "name email"
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      // compute durations between stages if possible
      const history = order.history || [];
      const stageTimes: any[] = [];
      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const cur = history[i];
        stageTimes.push({
          from: prev.stage,
          to: cur.stage,
          durationMs: cur.timestamp.getTime() - prev.timestamp.getTime(),
        });
      }
      res.json({ order, stageTimes, history });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /stats (Admin only)
router.get("/stats/all", authenticate, authorize("admin"), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ isDeleted: false });
    const ordersByStageAgg = await Order.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$currentStage", count: { $sum: 1 } } },
    ]);
    const ordersByStage: Record<string, number> = {};
    ordersByStageAgg.forEach((r: any) => (ordersByStage[r._id] = r.count));
    // average delivery time rough: find orders with history including delivered
    const delivered = await Order.find({ isDeleted: false, currentStage: 7 });
    let totalMs = 0;
    let count = 0;
    delivered.forEach((o) => {
      const placed = o.history.find((h) => h.stage === "Order Placed");
      const deliveredEntry = o.history.find((h) => h.stage === "Delivered");
      if (placed && deliveredEntry) {
        totalMs +=
          deliveredEntry.timestamp.getTime() - placed.timestamp.getTime();
        count++;
      }
    });
    const avgDeliveryTime = count ? totalMs / count : null;
    res.json({ totalOrders, ordersByStage, avgDeliveryTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /buyers (Admin only)
router.get(
  "/admin/buyers",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const buyers = await User.find({ role: "buyer" }).select(
        "_id name email"
      );
      res.json(buyers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /sellers (Admin only)
router.get(
  "/admin/sellers",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const sellers = await User.find({ role: "seller" }).select(
        "_id name email"
      );
      res.json(sellers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /orders/:id/admin (Admin only - hard/soft delete)
router.delete(
  "/:id/admin",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      if (!order)
        return res.status(404).json({ message: "Order not found" });
      order.isDeleted = true;
      order.addHistory(
        "Deleted by Admin",
        req.user!._id,
        req.user!.name,
        "admin delete"
      );
      await order.save();

      // Notify all parties
      const rooms = ["admin-room"];
      if (order.buyerId) rooms.push(`user-${order.buyerId}`);
      if (order.sellerId) rooms.push(`user-${order.sellerId}`);
      emitToRooms("order_deleted", order, rooms);

      res.json({ message: "Order deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /orders/:id/not-delivered (Seller only - mark as not delivered)
router.put(
  "/:id/not-delivered",
  authenticate,
  authorize("seller"),
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      if (!order)
        return res.status(404).json({ message: "Order not found" });
      if (
        !order.sellerId ||
        order.sellerId.toString() !== req.user!._id.toString()
      )
        return res.status(403).json({ message: "Not your order" });
      if (order.currentStage !== 7)
        return res
          .status(400)
          .json({ message: "Order is not marked as delivered" });

      // Move back to "Out for Delivery" stage
      order.currentStage = 6;
      order.addHistory(
        "Marked as Not Delivered",
        req.user!._id,
        req.user!.name,
        "moved back to out for delivery"
      );
      await order.save();

      // Notify all parties
      const rooms = ["admin-room"];
      if (order.buyerId) rooms.push(`user-${order.buyerId}`);
      rooms.push(`user-${order.sellerId}`);
      emitToRooms("order_updated", order, rooms);

      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
