const mongoose = require("mongoose");

const stageConfigSchema = new mongoose.Schema(
  {
    stageName: {
      type: String,
      required: true,
      unique: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    expectedDurationHours: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StageConfig", stageConfigSchema);