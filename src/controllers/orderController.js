const Order = require("../models/Order");
const StageConfig = require("../models/StageConfig");
const StageMovement = require("../models/StageMovement");


/*
CREATE ORDER
*/
exports.createOrder = async (req, res) => {

  try {

    const { orderNumber, grams, stones, productType, priority, shipDate, cell } = req.body;

    const firstStage = await StageConfig.findOne({ sequence: 1 });

    if (!firstStage) {
      return res.status(400).json({ message: "Stage configuration missing" });
    }

    const now = new Date();

    // Priority Scheduling Logic
    const today = new Date();
    const diffDays = (new Date(shipDate) - today) / (1000 * 60 * 60 * 24);

    let computedPriority = priority;

    if (diffDays <= 7) {
      computedPriority = "HIGH";
    }

    const newOrder = await Order.create({
      orderNumber,
      grams,
      stones,
      productType,
      priority: computedPriority,
      shipDate,
      cell,
      currentStage: firstStage.stageName,
      currentStageEntryTime: now,
    });

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



/*
MOVE ORDER TO NEXT STAGE
(Stage Movement Tracking)
*/
exports.moveStage = async (req, res) => {

  try {

    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const now = new Date();

    // Find current stage movement (without exitTime)
    const currentMovement = await StageMovement.findOne({
      orderId: order._id,
      exitTime: null
    });

    if (currentMovement) {

      currentMovement.exitTime = now;

      const hoursSpent =
        (now - currentMovement.entryTime) / (1000 * 60 * 60);

      currentMovement.hoursSpent = hoursSpent;

      await currentMovement.save();
    }

    // Get current stage config
    const currentStageConfig = await StageConfig.findOne({
      stageName: order.currentStage
    });

    const nextStage = await StageConfig.findOne({
      sequence: currentStageConfig.sequence + 1
    });

    if (!nextStage) {

      order.status = "COMPLETED";

      await order.save();

      return res.json(order);
    }

    // Move order to next stage
    order.currentStage = nextStage.stageName;
    order.currentStageEntryTime = now;

    await order.save();

    // Start next stage tracking
    await StageMovement.create({
      orderId: order._id,
      stageName: nextStage.stageName,
      entryTime: now
    });

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


/*
DELAY DETECTION
*/
exports.checkDelays = async (req, res) => {

  try {

    const stageConfigs = await StageConfig.find();

    const orders = await Order.find();

    for (let order of orders) {

      const stage = stageConfigs.find(
        s => s.stageName === order.currentStage
      );

      if (!stage) continue;

      const hoursSpent =
        (Date.now() - order.currentStageEntryTime) / (1000 * 60 * 60);

      if (hoursSpent > stage.expectedDurationHours) {
        order.isDelayed = true;
      } else {
        order.isDelayed = false;
      }

      await order.save();
    }

    res.json({ message: "Delay detection completed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/*
GET ALL ORDERS
(Priority Scheduling + Delay Calculation)
*/
exports.getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find();

    const enrichedOrders = [];

    const now = new Date();

    for (let order of orders) {

      const stageConfig = await StageConfig.findOne({
        stageName: order.currentStage
      });

      const hoursSpent =
        (now - order.currentStageEntryTime) / (1000 * 60 * 60);

      let isDelayed = false;

      if (stageConfig && hoursSpent > stageConfig.expectedDurationHours) {
        isDelayed = true;
      }

      enrichedOrders.push({
        ...order.toObject(),
        hoursSpent: hoursSpent.toFixed(2),
        isDelayed
      });

    }

    res.json(enrichedOrders);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/*
DELETE ORDER
*/
exports.deleteOrder = async (req, res) => {

  try {

    const { orderId } = req.body;

    await Order.findByIdAndDelete(orderId);

    res.json({ message: "Order deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/*
DAILY PRODUCTION TARGET
*/
exports.getDailyProductionTarget = async (req, res) => {

  try {

    const orders = await Order.find({
      status: "IN_PROGRESS"
    });

    const pendingOrders = orders.length;

    if (pendingOrders === 0) {

      return res.json({
        pendingOrders: 0,
        averageDaysLeft: 0,
        recommendedDailyTarget: 0
      });

    }

    const today = new Date();

    let totalDaysLeft = 0;

    orders.forEach(order => {

      const daysLeft =
        (new Date(order.shipDate) - today) /
        (1000 * 60 * 60 * 24);

      totalDaysLeft += Math.max(daysLeft, 1);

    });

    const averageDaysLeft =
      totalDaysLeft / pendingOrders;

    const recommendedDailyTarget =
      Math.ceil(pendingOrders / averageDaysLeft);

    res.json({

      pendingOrders,
      averageDaysLeft: averageDaysLeft.toFixed(2),
      recommendedDailyTarget

    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
exports.getStageHistory = async (req, res) => {

  try {

    const { orderId } = req.params;

    const history = await StageMovement
      .find({ orderId })
      .sort({ entryTime: 1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};