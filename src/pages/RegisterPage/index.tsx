import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context";
import { styles } from "./styles";

export function RegisterPage() {
  const { register, token, loading } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token && !loading) {
      navigate("/", { replace: true });
    }
  }, [token, loading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password, firstName, lastName } = form;
    await register({ email, password, firstName, lastName });
    navigate("/");
  };

  return (
    <Box sx={styles.root}>
      <Paper sx={styles.paper} elevation={3}>
        <Typography variant="h5" gutterBottom sx={styles.title}>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <TextField
            label="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            required
          />
          <TextField
            label="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            required
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            inputProps={{ minLength: 8 }}
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
          <Typography variant="body2" sx={styles.footerText}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
