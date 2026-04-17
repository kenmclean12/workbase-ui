import {
  BarChart,
  Business,
  Home,
  People,
  Person,
  RequestPage,
  Work,
} from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { styles } from "./styles";

const pageConfig = [
  { path: "/clients", label: "Clients", icon: <Business /> },
  { path: "/requests", label: "Requests", icon: <RequestPage /> },
  { path: "/jobs", label: "Tasks", icon: <Work /> },
  { path: "/users", label: "Users", icon: <People /> },
  { path: "/profile", label: "Profile", icon: <Person /> },
  { path: "/stats", label: "Stats", icon: <BarChart /> },
  { path: "/", label: "Home", icon: <Home /> },
];

export function TopBar() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const location = useLocation();
  const currentPage =
    pageConfig.find((p) => location.pathname.startsWith(p.path)) ||
    pageConfig[pageConfig.length - 1];

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

        <Box sx={styles.right} />
      </Toolbar>
    </AppBar>
  );
}
