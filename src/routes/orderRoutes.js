const express = require("express");
const router = express.Router();
const { createOrder, moveStage, getAllOrders } = require("../controllers/orderController");
const { deleteOrder } = require("../controllers/orderController");
router.post("/create", createOrder);
router.post("/move", moveStage);
router.get("/", getAllOrders);
router.delete("/delete", deleteOrder);

module.exports = router;