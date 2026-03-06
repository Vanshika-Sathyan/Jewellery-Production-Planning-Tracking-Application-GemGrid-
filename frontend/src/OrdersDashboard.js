import React, { useEffect, useState } from "react";
import axios from "axios";

import "./dashboard.css";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import {
  Chip,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent
} from "@mui/material";

function OrdersDashboard({ search }) {

  const [orders, setOrders] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stageHistory, setStageHistory] = useState([]);
  const [targets, setTargets] = useState(null);



  const [stats, setStats] = useState({
    totalOrders: 0,
    delayedOrders: 0
  });

  const [newOrder, setNewOrder] = useState({
    orderNumber: "",
    grams: "",
    stones: "",
    productType: "",
    priority: "MEDIUM",
    shipDate: ""
  });

  const stages = [
    "Order Created",
    "Diamond Arrangement",
    "Finding Arrangement",
    "CAM Print",
    "Wax Print",
    "Casting",
    "Grinding",
    "Central Unit",
    "Cell Allocation (Cell 1 / Cell 2)",
    "Filing",
    "Drilling",
    "Pre-Polish",
    "Linking",
    "Setting",
    "Polish",
    "QC",
    "Rhodium",
    "QC",
    "Packing",
    "Shipped"
  ];

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
      const delayed = res.data.filter(o => o.isDelayed).length;

      setStats({
        totalOrders: res.data.length,
        delayedOrders: delayed
      });

    } catch (error) {
      console.error(error);
    }

  };

  const fetchDailyTarget = async () => {

  try {

    const res = await axios.get(
      "http://localhost:5000/api/orders/daily-target"
    );

    setTargets(res.data);

  } catch (error) {

    console.error("Error fetching daily target:", error);

  }

};

  const fetchCapacity = async () => {
    const res = await axios.get("http://localhost:5000/api/capacity");
    setCapacity(res.data);

  };
  const moveStage = async (orderId) => {
    await axios.post("http://localhost:5000/api/orders/move", {
      orderId,
      direction: "forward"
    });

    fetchOrders();
    fetchDailyTarget();
    fetchCapacity();

  };

  const loadOrderDetails = async (order) => {

  setSelectedOrder(order);

  try {

    const res = await axios.get(
      `http://localhost:5000/api/orders/history/${order._id}`
    );

    setStageHistory(res.data);

  } catch (error) {

    console.error("Error loading history", error);

  }

};
  
  const deleteOrder = async (orderId) => {

  await axios.delete(
    "http://localhost:5000/api/orders/delete",
    { data: { orderId } }
  );

  fetchOrders();

};

  const handleChange = (e) => {

    setNewOrder({
      ...newOrder,
      [e.target.name]: e.target.value
    });

  };

  const createOrder = async () => {

    await axios.post(
      "http://localhost:5000/api/orders/create",
      newOrder
    );

    fetchOrders();
    fetchDailyTarget();
    fetchCapacity();

    setNewOrder({
      orderNumber: "",
      grams: "",
      stones: "",
      productType: "",
      priority: "MEDIUM",
      shipDate: ""
    });

  };

  useEffect(() => {

    fetchOrders();
    fetchDailyTarget();
    fetchCapacity();

    const interval = setInterval(() => {
    fetchOrders();
    fetchDailyTarget();
    fetchCapacity();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <Box mt={4}>

      {/* KPI STATS */}

      <Grid container spacing={3} mb={4}>

        <Grid item xs={12} md={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{stats.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6">Delayed Orders</Typography>
              <Typography variant="h4">{stats.delayedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6">Active Stages</Typography>
              <Typography variant="h4">{capacity.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6">System Health</Typography>
              <Typography variant="h4" color="green">Optimal</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
  <Card className="glass-card">
    <CardContent>

      <Typography variant="h6">
        Daily Target
      </Typography>

      {targets ? (

        <Box>

          <Typography>
            Pending Orders: {targets.pendingOrders}
          </Typography>

          <Typography>
            Average Days Left: {targets.averageDaysLeft}
          </Typography>

          <Typography fontWeight="bold">
            Orders Per Day: {targets.recommendedDailyTarget}
          </Typography>

        </Box>

      ) : (

        <Typography>Loading...</Typography>

      )}

    </CardContent>
  </Card>
</Grid>

      </Grid>

      {/* CREATE ORDER */}

      <Card className="create-order" sx={{ mb: 4 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Create New Order
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12} md={2}>
              <TextField
                label="Order Number"
                name="orderNumber"
                value={newOrder.orderNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Product Type"
                name="productType"
                value={newOrder.productType}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
<TextField
label="Cell"
name="cell"
value={newOrder.cell}
onChange={handleChange}
fullWidth
/>
</Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Grams"
                name="grams"
                type="number"
                value={newOrder.grams}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="Stones"
                name="stones"
                type="number"
                value={newOrder.stones}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Priority"
                name="priority"
                value={newOrder.priority}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="HIGH">HIGH</MenuItem>
                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                <MenuItem value="LOW">LOW</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                name="shipDate"
                value={newOrder.shipDate}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="success"
                onClick={createOrder}
              >
                Create Order
              </Button>
            </Grid>

          </Grid>

        </CardContent>
      </Card>

      {/* CAPACITY */}

      <Typography variant="h6" gutterBottom>
        Stage Capacity Status
      </Typography>

      <Grid container spacing={2} mb={4}>

        {capacity.filter(stage =>
  stage.stageName.toLowerCase().includes(search.toLowerCase())
).map(stage => (

          <Grid item xs={12} md={3} key={stage.stageName}>

            <Card className="glass-card">

              <CardContent>

                <Typography fontWeight="bold">
                  {stage.stageName}
                </Typography>

                <Typography>
                  Orders: {stage.load}
                </Typography>

                <Typography>
                  Capacity: {stage.capacity}
                </Typography>

                <Chip
                  label={stage.overloaded ? "Overloaded" : "Healthy"}
                  color={stage.overloaded ? "error" : "success"}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ORDERS */}

      <Typography variant="h5" gutterBottom>
        Orders Dashboard
      </Typography>

      {orders.filter(order =>
  order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
  order.productType.toLowerCase().includes(search.toLowerCase()) ||
  order.currentStage.toLowerCase().includes(search.toLowerCase())
).map(order => {

        const currentIndex = stages.indexOf(order.currentStage);

        return (

          <Card
            key={order._id}
            className="glass-card"
            sx={{ mb:3, cursor:"pointer" }}
            onClick={() => loadOrderDetails(order)}
            >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <Typography fontWeight="bold">
                    {order.orderNumber}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography>
                    {order.productType}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>

                  <Chip
                    label={order.priority}
                    color={
                      order.priority === "HIGH"
                        ? "error"
                        : order.priority === "MEDIUM"
                        ? "warning"
                        : "default"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2}>

                  {order.isDelayed
                    ? <Chip label="Delayed" color="error"/>
                    : <Chip label="On Track" color="success"/>
                  }
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box display="flex" gap={1}>
                    <Button
                    variant="contained"
                    onClick={() => moveStage(order._id)}
                    >
                      Move Stage
                    </Button>
                    <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                      </Button>
                      </Box>
                </Grid>
              </Grid>
              {/* PIPELINE TRACKER */}
              <Box mt={3}>

                <div className="pipeline-container">

                  {stages.map((stage,index)=>{

                    let className="pipeline-stage";

                    if(index < currentIndex){
                      className+=" pipeline-complete";
                    }
                    else if(index===currentIndex){
                      className+=" pipeline-current";
                    }
                    return(
                      <div key={stage} className={className}>
                        {stage}
                      </div>
                    )
                  })}
                </div>
              </Box>

              {selectedOrder && selectedOrder._id === order._id && (

<Box mt={3} sx={{ background:"#f8f9fb", padding:2, borderRadius:2 }}>

<Typography variant="h6" gutterBottom>
Stage History
</Typography>

<Typography>
Current Stage Entry Time: {new Date(order.currentStageEntryTime).toLocaleString()}
</Typography>

{stageHistory.map((stage)=>(
<Box key={stage._id} sx={{ mt:2, borderBottom:"1px solid #ddd", pb:1 }}>

<Typography fontWeight="bold">
{stage.stageName}
</Typography>

<Typography>
Entry Time: {new Date(stage.entryTime).toLocaleString()}
</Typography>

{stage.exitTime && (
<Typography>
Exit Time: {new Date(stage.exitTime).toLocaleString()}
</Typography>
)}

{stage.hoursSpent && (
<Typography>
Hours Spent: {stage.hoursSpent.toFixed(2)}
</Typography>
)}

</Box>
))}

</Box>

)}
            </CardContent>
          </Card>
        )
      })}
    </Box>
  );
}
export default OrdersDashboard;

