import React, { useState, } from "react";
import api from "../../api/axios";
import {
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  Paper,
} from "@mui/material";
import SignupModal from "./SignupModal";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);
      const { token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("email", form.email);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  const handleSignup = async (userData: { name: string; email: string; password: string }) => {
    try {
      const res = await api.post("/auth/signup", userData);
      const { token } = res.data;

      localStorage.setItem("token", token);
      navigate("/home");

    } catch (err: any) {
      console.error("Signup failed:", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Login</Typography>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          <Typography variant="body2" textAlign="center">
            Don't have an account?{" "}
            <Link component="button" onClick={() => setOpenModal(true)}>
              Sign up here
            </Link>
          </Typography>
        </Stack>
      </Paper>

      <SignupModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSignup}
      />
    </>
  );
};

export default LoginForm;
