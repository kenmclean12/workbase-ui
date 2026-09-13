import {
  BarChart,
  Business,
  People,
  Person,
  RequestPage,
  Work,
} from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { IS_CLIENT_USER } from "../../../config/appMode";
import { AddClientButton } from "../../../components/AddClientButton";
import { AddRequestButton } from "../../../components/AddRequestButton";
import { InviteUsersButton } from "../../../components/InviteUsersButton";
import { styles } from "./styles";

const pageConfig = [
  { path: "/company", label: "Company", icon: <Business /> },
  { path: "/clients", label: "Clients", icon: <Business /> },
  { path: "/requests", label: "Requests", icon: <RequestPage /> },
  { path: "/jobs", label: "Tasks", icon: <Work /> },
  { path: "/users", label: "Users", icon: <People /> },
  { path: "/profile", label: "Profile", icon: <Person /> },
  { path: "/stats", label: "Stats", icon: <BarChart /> },
];

export function TopBar() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const location = useLocation();
  const currentPage =
    pageConfig.find((p) => location.pathname.startsWith(p.path)) ||
    pageConfig.find((p) => p.path === "/profile")!;

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={styles.appBar(theme)}
    >
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.left}>
          {currentPage.icon}
          <Typography sx={styles.title(isDarkMode)}>
            {currentPage.label}
          </Typography>
        </Box>

        <Box sx={styles.right}>
          {!IS_CLIENT_USER && location.pathname === "/clients" ? <AddClientButton /> : null}
          {IS_CLIENT_USER && location.pathname.startsWith("/requests") ? <AddRequestButton /> : null}
          {location.pathname === "/users" ? <InviteUsersButton /> : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
