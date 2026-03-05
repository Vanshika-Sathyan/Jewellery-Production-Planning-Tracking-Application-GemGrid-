const mongoose = require("mongoose");

const workforceConfigSchema = new mongoose.Schema(
  {
    stageName: {
      type: String,
      required: true,
      unique: true,
    },
    manpower: {
      type: Number,
      required: true,
    },
    productivityPerDay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkforceConfig", workforceConfigSchema);