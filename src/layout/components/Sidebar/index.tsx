import {
  BarChart,
  Business,
  BusinessCenter,
  ChevronLeft,
  Menu as MenuIcon,
  People,
  Person,
  RequestPage,
  Work,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext, useThemeContext } from "../../../context";
import { ProfileMenu } from "./ProfileMenu";
import { styles } from "./styles";

type Props = {
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function Sidebar({ open, onToggle, disabled = false }: Props) {
  const location = useLocation();
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Drawer variant="permanent" sx={styles.drawer(open ? 240 : 72)}>
      <Box sx={styles.brand}>
        {open && (
          <Box sx={styles.brandLeft}>
            <BusinessCenter sx={{ fontSize: 24 }} />
            <Box component="span" sx={styles.brandText}>
              WorkBase
            </Box>
          </Box>
        )}
        <IconButton size="small" onClick={onToggle} disabled={disabled}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>
      <List sx={styles.list}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const button = (
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={styles.listItemButton(open, isActive)}
            >
              <ListItemIcon sx={styles.listItemIcon}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          );

          return (
            <ListItem key={item.key} disablePadding sx={{ display: "block" }}>
              {!open ? (
                <Tooltip title={item.label} placement="right">
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>
      {user && (
        <Box sx={styles.footer(open)}>
          <IconButton
            size="small"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            {user?.avatarUrl ? (
              <Avatar sx={{ width: 40, height: 40 }} src={user.avatarUrl} />
            ) : (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: themeMode === "dark" ? "#40444d" : "#d9e2eb",
                  color: themeMode === "dark" ? "#d1d5db" : "#637381",
                  fontWeight: 700,
                }}
              >
                {(user
                  ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
                  : "U"
                ).toUpperCase()}
              </Avatar>
            )}
          </IconButton>
          {open && (
            <Box sx={styles.userInfo}>
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={styles.userName}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={styles.userEmail}
              >
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <ProfileMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      />
    </Drawer>
  );
}

type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  { key: "profile", label: "Profile", path: "/profile", icon: <Person /> },
  { key: "users", label: "Users", path: "/users", icon: <People /> },
  { key: "clients", label: "Clients", path: "/clients", icon: <Business /> },
  {
    key: "requests",
    label: "Requests",
    path: "/requests",
    icon: <RequestPage />,
  },
  { key: "jobs", label: "Tasks", path: "/jobs", icon: <Work /> },
  { key: "stats", label: "Stats", path: "/stats", icon: <BarChart /> },
];
