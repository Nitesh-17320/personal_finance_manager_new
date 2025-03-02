import { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Login = ({ setUserName }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const userData = res.data.user;
  
      localStorage.setItem("user", JSON.stringify(userData));
  
      setUserName(userData.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <>
      <Navbar />
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
            Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
              Login
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account? <a href="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>Sign up</a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
