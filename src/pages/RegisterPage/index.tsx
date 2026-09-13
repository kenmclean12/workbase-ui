import BusinessCenter from "@mui/icons-material/BusinessCenter";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import {
  Box, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../context";
import { styles } from "./styles";

export function RegisterPage() {
  const { register, token, loading } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token")?.trim() ?? "";
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inviteIsValid = Boolean(inviteToken);

  useEffect(() => {
    if (token && !loading) navigate("/", { replace: true });
  }, [token, loading, navigate]);

  useEffect(() => {
    if (!inviteIsValid) {
      enqueueSnackbar("This registration link is missing its invitation token.", {
        variant: "warning",
        preventDuplicate: true,
      });
    }
  }, [inviteIsValid]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteIsValid) {
      enqueueSnackbar("This registration link is missing its invitation token.", { variant: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      await register({ ...form, email: form.email.trim(), inviteToken });
      enqueueSnackbar("Account created. Welcome to Workbase!", { variant: "success" });
      navigate("/");
    } catch (cause) {
      enqueueSnackbar(cause instanceof Error ? cause.message : "Unable to create your account. Please try again.", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <Box sx={styles.root}>
      <Paper component="main" elevation={0} sx={styles.card}>
        <Box sx={styles.brandRow}>
          <Box sx={styles.brandMark}><BusinessCenter fontSize="small" /></Box>
          <Typography variant="h6" fontWeight={700}>Workbase</Typography>
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} letterSpacing="-0.03em">
          Create your account
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Set up your profile to start collaborating with your team.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={styles.form} noValidate>
          <Box sx={styles.nameRow}>
            <TextField label="First name" autoComplete="given-name" value={form.firstName} onChange={update("firstName")} fullWidth required disabled={submitting || !inviteIsValid} />
            <TextField label="Last name" autoComplete="family-name" value={form.lastName} onChange={update("lastName")} fullWidth required disabled={submitting || !inviteIsValid} />
          </Box>
          <TextField label="Work email" type="email" autoComplete="email" value={form.email} onChange={update("email")} fullWidth required disabled={submitting || !inviteIsValid} />
          <TextField
            label="Create password" type={showPassword ? "text" : "password"} autoComplete="new-password"
            helperText="Use at least 8 characters." value={form.password} onChange={update("password")}
            inputProps={{ minLength: 8 }} fullWidth required disabled={submitting || !inviteIsValid}
            InputProps={{
              endAdornment: <InputAdornment position="end"><IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                edge="end" onClick={() => setShowPassword((value) => !value)}
              >{showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</IconButton></InputAdornment>,
            }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={submitting || !inviteIsValid} sx={styles.submit}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : "Create account"}
          </Button>
        </Box>

        <Typography variant="body2" sx={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
