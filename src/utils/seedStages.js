const StageConfig = require("../models/StageConfig");

const stages = [
  { stageName: "Order Created", sequence: 1, expectedDurationHours: 4 },
  { stageName: "Diamond Arrangement", sequence: 2, expectedDurationHours: 24 },
  { stageName: "Finding Arrangement", sequence: 3, expectedDurationHours: 24 },
  { stageName: "CAM Print", sequence: 4, expectedDurationHours: 12 },
  { stageName: "Wax Print", sequence: 5, expectedDurationHours: 12 },
  { stageName: "Casting", sequence: 6, expectedDurationHours: 24 },
  { stageName: "Grinding", sequence: 7, expectedDurationHours: 16 },
  { stageName: "Central Unit", sequence: 8, expectedDurationHours: 16 },
  { stageName: "Cell Allocation", sequence: 9, expectedDurationHours: 8 },
  { stageName: "Filing", sequence: 10, expectedDurationHours: 12 },
  { stageName: "Drilling", sequence: 11, expectedDurationHours: 12 },
  { stageName: "Pre-Polish", sequence: 12, expectedDurationHours: 16 },
  { stageName: "Linking", sequence: 13, expectedDurationHours: 12 },
  { stageName: "Setting", sequence: 14, expectedDurationHours: 24 },
  { stageName: "Polish", sequence: 15, expectedDurationHours: 16 },
  { stageName: "QC 1", sequence: 16, expectedDurationHours: 8 },
  { stageName: "Rhodium", sequence: 17, expectedDurationHours: 12 },
  { stageName: "QC 2", sequence: 18, expectedDurationHours: 8 },
  { stageName: "Packing", sequence: 19, expectedDurationHours: 8 },
  { stageName: "Shipped", sequence: 20, expectedDurationHours: 1 },
];

const seedStages = async () => {
  try {

    await StageConfig.deleteMany();   // clears old stages

    await StageConfig.insertMany(stages);

    console.log("Stages reseeded successfully");

  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};

module.exports = seedStages;