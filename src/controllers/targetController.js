const Order = require("../models/Order");

exports.getDailyTarget = async (req, res) => {
  try {
    const orders = await Order.find({ status: "IN_PROGRESS" });

    const today = new Date();

    let totalOrders = orders.length;
    let totalDaysLeft = 0;

    for (let order of orders) {
      const shipDate = new Date(order.shipDate);

      const daysLeft = Math.ceil(
        (shipDate - today) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft > 0) {
        totalDaysLeft += daysLeft;
      }
    }

    const avgDaysLeft = totalOrders > 0 ? totalDaysLeft / totalOrders : 0;

    const dailyTarget =
      avgDaysLeft > 0 ? Math.ceil(totalOrders / avgDaysLeft) : totalOrders;

    res.json({
      pendingOrders: totalOrders,
      averageDaysLeft: avgDaysLeft.toFixed(2),
      recommendedDailyTarget: dailyTarget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};