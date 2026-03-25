import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';

const mainPagePaperStyles = {
  padding: 24,
};

type UserDto = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export default function MainPage() {
  const { data: users, loading, error, refetch } = useApi<UserDto[]>('/users', {
    headers: { 'Content-Type': 'application/json' },
  });

  const { token, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await login(email, password);
      await refetch();
    } catch (err) {
      setAuthError((err as Error).message || 'Login failed');
    }
  };

  return (
    <Box component={Paper} elevation={1} sx={mainPagePaperStyles}>
      <Typography variant="h4" component="h2" gutterBottom>
        Main Page
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
        />
        {!isAuthenticated ? (
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => logout()}>
            Logout
          </Button>
        )}
      </Box>

      {authError && <Typography color="error">{authError}</Typography>}

      <Typography variant="h6" gutterBottom>
        Users
      </Typography>

      {loading && <Typography>Loading users...</Typography>}
      {error && <Typography color="error">Failed to load users: {error.message}</Typography>}

      {users && (
        <List>
          {users.map((user) => (
            <ListItem key={user.id} divider>
              <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}