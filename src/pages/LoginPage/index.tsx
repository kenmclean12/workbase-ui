import BusinessCenter from "@mui/icons-material/BusinessCenter";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import {
  Box, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context";
import { styles } from "./styles";

export function LoginPage() {
  const { login, token, loading } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token && !loading) navigate("/", { replace: true });
  }, [token, loading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate("/");
    } catch (cause) {
      enqueueSnackbar(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={styles.root}>
      <Paper component="main" elevation={0} sx={styles.card}>
        <Box sx={styles.brandRow}>
          <Box sx={styles.brandMark}><BusinessCenter fontSize="small" /></Box>
          <Typography variant="h6" fontWeight={700}>Workbase</Typography>
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} letterSpacing="-0.03em">
          Welcome back
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Sign in to manage your team&apos;s work in one place.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={styles.form} noValidate>
          <TextField
            label="Work email" type="email" autoComplete="email" autoFocus fullWidth required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            disabled={submitting}
          />
          <TextField
            label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" fullWidth required
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            disabled={submitting}
            InputProps={{
              endAdornment: <InputAdornment position="end"><IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                edge="end" onClick={() => setShowPassword((value) => !value)}
              >{showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</IconButton></InputAdornment>,
            }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={submitting} sx={styles.submit}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
          </Button>
        </Box>

        <Typography variant="body2" sx={styles.footer}>
          Have an invitation? Open the registration link from your email.
          <br />
          <Link to="/register">Create an account</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
