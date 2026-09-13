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
import { useUsersGetAll } from "../../../../hooks";
import { styles } from "./styles";

export interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export function ProfileMenu({ anchorEl, open, onClose }: Props) {
  const { user, logout } = useAuthContext();
  const { data: users = [] } = useUsersGetAll();
  const { themeMode, toggleTheme } = useThemeContext();
  const displayUser = user ?? users[0] ?? null;

  const handleLogout = async () => {
    onClose();
    await logout();
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
          {displayUser?.avatarUrl ? (
            <Avatar src={displayUser.avatarUrl} sx={styles.avatar} />
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
              {`${displayUser?.firstName?.[0] ?? ""}${displayUser?.lastName?.[0] ?? ""}`.toUpperCase() ||
                "U"}
            </Avatar>
          )}
          <Box sx={styles.textContainer}>
            <Typography variant="subtitle2" fontWeight={600} sx={styles.name}>
              {displayUser?.firstName ?? ""} {displayUser?.lastName ?? ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={styles.email}
            >
              {displayUser?.email ?? ""}
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
