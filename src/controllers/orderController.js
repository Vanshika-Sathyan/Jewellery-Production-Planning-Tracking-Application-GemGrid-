const Order = require("../models/Order");
const StageConfig = require("../models/StageConfig");
const StageMovement = require("../models/StageMovement");


exports.createOrder = async (req, res) => {
  try {
    const { orderNumber, grams, stones, productType, priority, shipDate } =
      req.body;

    // Get first stage (sequence = 1)
    const firstStage = await StageConfig.findOne({ sequence: 1 });

    if (!firstStage) {
      return res.status(400).json({ message: "Stage configuration missing" });
    }

    const now = new Date();

    const newOrder = await Order.create({
      orderNumber,
      grams,
      stones,
      productType,
      priority,
      shipDate,
      currentStage: firstStage.stageName,
      currentStageEntryTime: now,
    });

    // Create stage movement entry
    await StageMovement.create({
      orderId: newOrder._id,
      stageName: firstStage.stageName,
      entryTime: now,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.moveStage = async (req, res) => {
  try {
    const { orderId, direction } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStage = await StageConfig.findOne({
      stageName: order.currentStage,
    });

    let newSequence =
      direction === "forward"
        ? currentStage.sequence + 1
        : currentStage.sequence - 1;

    const nextStage = await StageConfig.findOne({
      sequence: newSequence,
    });

    if (!nextStage) {
      return res.status(400).json({ message: "No further stage available" });
    }

    const now = new Date();

    // Close previous stage
    const lastMovement = await StageMovement.findOne({
      orderId: order._id,
      stageName: order.currentStage,
      exitTime: null,
    });

    if (lastMovement) {
      lastMovement.exitTime = now;
      lastMovement.durationHours =
        (now - lastMovement.entryTime) / (1000 * 60 * 60);
      await lastMovement.save();
    }

    // Update order
    order.currentStage = nextStage.stageName;
    order.currentStageEntryTime = now;
    await order.save();

    // Create new movement
    await StageMovement.create({
      orderId: order._id,
      stageName: nextStage.stageName,
      entryTime: now,
    });

    res.json({ message: "Stage moved successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

const priorityRank = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

orders.sort((a, b) => {
  if (priorityRank[b.priority] !== priorityRank[a.priority]) {
    return priorityRank[b.priority] - priorityRank[a.priority];
  }

  return new Date(a.shipDate) - new Date(b.shipDate);
});

    const enrichedOrders = [];

    for (let order of orders) {
      const stageConfig = await StageConfig.findOne({
        stageName: order.currentStage,
      });

      const now = new Date();
      const hoursSpent =
        (now - order.currentStageEntryTime) / (1000 * 60 * 60);

      const isDelayed =
        stageConfig && hoursSpent > stageConfig.expectedDurationHours;

      enrichedOrders.push({
        ...order.toObject(),
        hoursSpent: hoursSpent.toFixed(2),
        isDelayed,
      });
    }

    res.json(enrichedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {

    const { orderId } = req.body;

    await Order.findByIdAndDelete(orderId);

    res.json({ message: "Order deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};