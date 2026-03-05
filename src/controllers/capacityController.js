const Order = require("../models/Order");
const WorkforceConfig = require("../models/WorkforceConfig");

exports.getCapacityStatus = async (req, res) => {
  try {
    const workforceConfigs = await WorkforceConfig.find();

    const results = [];

    for (let config of workforceConfigs) {
      const load = await Order.countDocuments({
        currentStage: config.stageName,
      });

      const capacity = config.manpower * config.productivityPerDay;

      results.push({
        stageName: config.stageName,
        load,
        capacity,
        overloaded: load > capacity,
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};