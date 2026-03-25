import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { useAuthContext } from '../../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuthContext();

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` : 'U';
  const avatarContent = user?.avatarUrl ? (
    <Avatar sx={{ width: 34, height: 34 }} alt={`${user.firstName} ${user.lastName}`} src={user.avatarUrl} />
  ) : (
    <Avatar sx={{ width: 34, height: 34, bgcolor: '#d9e2eb', color: '#637381', fontWeight: 700 }}>
      {initials.toUpperCase() || 'U'}
    </Avatar>
  );

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" color="inherit" edge="start" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            Control Panel
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {avatarContent}
          {user && (
            <Button size="small" color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}