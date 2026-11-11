import {
  Business,
  BusinessCenter,
  ChevronLeft,
  Menu as MenuIcon,
  People,
  Person,
  RequestPage,
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
import { useUsersGetAll } from "../../../hooks";
import { IS_CLIENT_USER } from "../../../config/appMode";
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
  const { data: users = [] } = useUsersGetAll();
  const { themeMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const displayUser = user ?? users[0] ?? null;

  return (
    <Drawer variant="permanent" sx={styles.drawer(open ? 240 : 72)}>
      <Box sx={styles.brand}>
        {open && (
          <Box sx={styles.brandLeft}>
            <Box
              component={NavLink}
              to="/profile"
              aria-label="Go to profile"
              sx={styles.brandLink}
            >
              <BusinessCenter sx={{ fontSize: 24 }} />
              <Box component="span" sx={styles.brandText}>
              WorkBase
              </Box>
            </Box>
          </Box>
        )}
        <IconButton size="small" onClick={onToggle} disabled={disabled}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>
      <List sx={styles.list}>
        {(IS_CLIENT_USER ? clientMenuItems : internalMenuItems).map((item) => {
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
      {displayUser && (
        <Box sx={styles.footer(open)}>
          <IconButton
            size="small"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            {displayUser?.avatarUrl ? (
              <Avatar sx={{ width: 40, height: 40 }} src={displayUser.avatarUrl} />
            ) : (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: themeMode === "dark" ? "#303034" : "#d9e2eb",
                  color: themeMode === "dark" ? "#e4e4e7" : "#637381",
                  fontWeight: 700,
                }}
              >
                {(
                  displayUser
                    ? `${displayUser.firstName?.[0] ?? ""}${displayUser.lastName?.[0] ?? ""}`
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
                {displayUser.firstName} {displayUser.lastName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={styles.userEmail}
              >
                {displayUser.email}
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

const internalMenuItems: MenuItem[] = [
  { key: "profile", label: "Profile", path: "/profile", icon: <Person /> },
  { key: "users", label: "Users", path: "/users", icon: <People /> },
  { key: "clients", label: "Clients", path: "/clients", icon: <Business /> },
  {
    key: "requests",
    label: "Requests",
    path: "/requests",
    icon: <RequestPage />,
  },
];

const clientMenuItems: MenuItem[] = [
  { key: "profile", label: "Profile", path: "/profile", icon: <Person /> },
  { key: "company", label: "Company", path: "/company", icon: <Business /> },
  { key: "users", label: "Users", path: "/users", icon: <People /> },
  {
    key: "requests",
    label: "Requests",
    path: "/requests",
    icon: <RequestPage />,
  },
];
