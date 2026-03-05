const express = require("express");
const router = express.Router();
const { getDailyTarget } = require("../controllers/targetController");

router.get("/", getDailyTarget);

module.exports = router;
