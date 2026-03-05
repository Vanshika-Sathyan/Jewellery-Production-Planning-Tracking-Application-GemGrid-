require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedStages = require("./utils/seedStages");
const orderRoutes = require("./routes/orderRoutes");
const seedWorkforce = require("./utils/seedWorkforce");
const capacityRoutes = require("./routes/capacityRoutes");
const targetRoutes = require("./routes/targetRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB().then(() => {
  seedStages();
  seedWorkforce();
});

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/capacity", capacityRoutes);
app.use("/api/targets", targetRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Production Planning System API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});