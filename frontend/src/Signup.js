import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      alert("Account created successfully");

      window.location.href = "/login";

    } catch (err) {

      alert("Signup failed");

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
          Create Account
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleSignup}
        >
          SIGNUP
        </Button>

        <Typography align="center" mt={2}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </Typography>

      </Paper>

    </Box>

  );

}

export default Signup;