const Order = require("../models/Order");

exports.getDailyTarget = async (req, res) => {

  const orders = await Order.find({
    status: "IN_PROGRESS"
  });

  const pendingOrders = orders.length;

  const today = new Date();

  const daysRemaining = orders.map(order => {

    const diff =
      (new Date(order.shipDate) - today) / (1000 * 60 * 60 * 24);

    return diff;

  });

  const avgDays =
    daysRemaining.reduce((a, b) => a + b, 0) / daysRemaining.length;

  const recommendedDailyTarget =
    Math.ceil(pendingOrders / avgDays);

  res.json({
    pendingOrders,
    averageDaysLeft: avgDays.toFixed(2),
    recommendedDailyTarget
  });

};