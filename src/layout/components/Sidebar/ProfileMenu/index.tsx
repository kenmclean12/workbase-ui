import Logout from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useAuthContext, useThemeContext } from "../../../../context";
import { styles } from "./styles";

export interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export function ProfileMenu({ anchorEl, open, onClose }: Props) {
  const { user, logout } = useAuthContext();
  const { themeMode, toggleTheme } = useThemeContext();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ sx: styles.menuPaper }}
    >
      <Box sx={styles.header}>
        <Box sx={styles.userRow}>
          {user?.avatarUrl ? (
            <Avatar src={user.avatarUrl} sx={styles.avatar} />
          ) : (
            <Avatar
              sx={{
                ...styles.avatar,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#40444d" : "#d9e2eb",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#d1d5db" : "#637381",
              }}
            >
              {`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
                "U"}
            </Avatar>
          )}
          <Box sx={styles.textContainer}>
            <Typography variant="subtitle2" fontWeight={600} sx={styles.name}>
              {user?.firstName ?? ""} {user?.lastName ?? ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={styles.email}
            >
              {user?.email ?? ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <MenuItem onClick={onClose}>
        <Box sx={styles.themeRow}>
          <Typography variant="body2">Theme</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">☀️</Typography>
            <Switch checked={themeMode === "dark"} onChange={toggleTheme} />
            <Typography variant="body2">🌙</Typography>
          </Stack>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout sx={styles.logoutIcon} />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );
}
