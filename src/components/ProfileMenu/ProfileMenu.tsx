import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useAuthContext } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function ProfileMenu({
  anchorEl,
  open,
  onClose,
}: ProfileMenuProps) {
  const { user, logout } = useAuthContext();

  const safeText = (value: unknown, fallback = "") =>
    typeof value === "string" ? value : fallback;

  const safeInitial = (value: unknown) =>
    typeof value === "string" && value.length > 0 ? value[0] : "";

  const safeName = () => {
    const first = safeText(user?.firstName);
    const last = safeText(user?.lastName);
    return `${first} ${last}`.trim() || "User";
  };

  const safeEmail = () => {
    const email = safeText(user?.email);
    return email || "user@example.com";
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const initials = user
    ? `${safeInitial(user.firstName)}${safeInitial(user.lastName)}`.toUpperCase()
    : "U";

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          mt: 1.5,
          width: 240,
          "& .MuiMenuItem-root": {
            py: 1,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user?.avatarUrl ? (
            <Avatar src={user.avatarUrl} sx={{ width: 40, height: 40 }} />
          ) : (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#40444d" : "#d9e2eb",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#d1d5db" : "#637381",
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 140,
              }}
            >
              {safeName()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 140,
                display: "block",
              }}
            >
              {safeEmail()}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <MenuItem onClick={onClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="body2">Theme</Typography>
          <ThemeToggle />
        </Box>
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );
}
