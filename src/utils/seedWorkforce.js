const WorkforceConfig = require("../models/WorkforceConfig");

const workforce = [

{ stageName: "Order Created", manpower: 3, productivityPerDay: 10 },
{ stageName: "Diamond Arrangement", manpower: 4, productivityPerDay: 5 },
{ stageName: "Finding Arrangement", manpower: 4, productivityPerDay: 5 },
{ stageName: "CAM Print", manpower: 3, productivityPerDay: 5 },
{ stageName: "Wax Print", manpower: 3, productivityPerDay: 5 },
{ stageName: "Casting", manpower: 3, productivityPerDay: 4 },
{ stageName: "Grinding", manpower: 4, productivityPerDay: 5 },
{ stageName: "Central Unit", manpower: 3, productivityPerDay: 6 },
{ stageName: "Cell Allocation", manpower: 3, productivityPerDay: 6 },
{ stageName: "Filing", manpower: 4, productivityPerDay: 6 },
{ stageName: "Drilling", manpower: 3, productivityPerDay: 6 },
{ stageName: "Pre-Polish", manpower: 4, productivityPerDay: 6 },
{ stageName: "Linking", manpower: 3, productivityPerDay: 6 },
{ stageName: "Setting", manpower: 4, productivityPerDay: 5 },
{ stageName: "Polish", manpower: 4, productivityPerDay: 5 },
{ stageName: "QC 1", manpower: 2, productivityPerDay: 10 },
{ stageName: "Rhodium", manpower: 2, productivityPerDay: 8 },
{ stageName: "QC 2", manpower: 2, productivityPerDay: 10 },
{ stageName: "Packing", manpower: 3, productivityPerDay: 12 },
{ stageName: "Shipped", manpower: 1, productivityPerDay: 100 }
];

const seedWorkforce = async () => {

await WorkforceConfig.deleteMany();

await WorkforceConfig.insertMany(workforce);

console.log("Workforce seeded successfully");

};

module.exports = seedWorkforce;