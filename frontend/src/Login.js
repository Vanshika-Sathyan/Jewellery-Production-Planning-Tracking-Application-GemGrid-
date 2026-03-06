import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {

      alert("Invalid email or password");

    }

  };

  return (

    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg,#1e3a5f,#4f6d8c)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <Paper
        elevation={6}
        sx={{
          padding: 5,
          width: 360,
          borderRadius: 3
        }}
      >
        <Typography
          variant="h5"
          align="center"
          mb={3}
          fontWeight="bold"
        >
          GemGrid - Jewellery Production Planning & Tracking
        </Typography>
        
        <Typography
          variant="h4"
          align="center"
          mb={3}
          fontWeight="bold"
        >
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            padding: 1.2,
            fontWeight: "bold"
          }}
          onClick={handleLogin}
        >
          LOGIN
        </Button>

        <Typography align="center" mt={2}>
          Don't have an account?{" "}
          <Link to="/signup">Signup</Link>
        </Typography>

      </Paper>

    </Box>

  );

}

export default Login;