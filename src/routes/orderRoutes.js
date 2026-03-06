const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { createOrder, moveStage, getAllOrders } = require("../controllers/orderController");
const { deleteOrder } = require("../controllers/orderController");
router.post("/create", createOrder);
router.post("/move", moveStage);
router.get("/", getAllOrders);
router.delete("/delete", deleteOrder);
router.get("/history/:orderId", orderController.getStageHistory);
router.get("/daily-target", orderController.getDailyProductionTarget);

module.exports = router;