import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context";
import { styles } from "./styles";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, token, loading } = useAuthContext();

  useEffect(() => {
    if (token && !loading) {
      navigate("/", { replace: true });
    }
  }, [token, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <Box sx={styles.root}>
      <Paper sx={styles.paper} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
          <Typography variant="body2" sx={styles.footerText}>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
