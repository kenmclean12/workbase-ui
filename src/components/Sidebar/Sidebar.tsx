import * as React from "react";
import type { ReactNode } from "react";
import {
  People,
  Business,
  Work,
  BarChart,
  Menu as MenuIcon,
  ChevronLeft,
  BusinessCenter,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import { ProfileMenu, type ProfileMenuProps } from "./ProfileMenu";

type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  { key: "profile", label: "Profile", path: "/profile", icon: <Person /> },
  { key: "clients", label: "Clients", path: "/clients", icon: <Business /> },
  { key: "jobs", label: "Tasks", path: "/jobs", icon: <Work /> },
  { key: "users", label: "Users", path: "/users", icon: <People /> },
  { key: "stats", label: "Stats", path: "/stats", icon: <BarChart /> },
];

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 72;

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function Sidebar({ open, onToggle, disabled = false }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthContext();
  const { themeMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const profileMenuProps: ProfileMenuProps = {
    anchorEl,
    open: Boolean(anchorEl),
    onClose: handleMenuClose,
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
    : "U";

  const avatarContent = user?.avatarUrl ? (
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
      {initials.toUpperCase()}
    </Avatar>
  );

  const drawerWidth = open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED;

  return (
    <Drawer
      variant="permanent"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: drawerWidth,
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessCenter sx={{ fontSize: 24 }} />
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              WorkBase
            </Box>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={onToggle}
          disabled={disabled}
          sx={{ ml: open ? 0 : "auto", mr: open ? 0 : "auto" }}
        >
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          const button = (
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: isActive
                  ? (theme) => theme.palette.action.selected
                  : "transparent",
                color: isActive ? "primary.main" : "text.primary",
                "& .MuiListItemIcon-root": {
                  color: isActive ? "primary.main" : "inherit",
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                },
                "&:hover": {
                  backgroundColor: (theme) =>
                    isActive
                      ? theme.palette.action.selected
                      : theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
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
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            gap: open ? 2 : 0,
            minWidth: 0,
          }}
        >
          <IconButton size="small" onClick={handleAvatarClick}>
            {avatarContent}
          </IconButton>

          {open && (
            <Box
              sx={{
                overflow: "hidden",
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {user?.email}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <ProfileMenu {...profileMenuProps} />
    </Drawer>
  );
}
