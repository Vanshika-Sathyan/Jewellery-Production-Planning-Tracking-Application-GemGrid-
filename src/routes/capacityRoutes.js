const express = require("express");
const router = express.Router();
const { getCapacityStatus } = require("../controllers/capacityController");

router.get("/", getCapacityStatus);

module.exports = router;