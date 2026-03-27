import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Home,
  Business,
  Work,
  People,
  BarChart,
  Add,
  PersonAdd,
} from "@mui/icons-material";

const pageConfig = [
  { path: "/", label: "Dashboard", icon: <Home /> },
  { path: "/clients", label: "Clients", icon: <Business /> },
  { path: "/jobs", label: "Tasks", icon: <Work /> },
  { path: "/users", label: "Users", icon: <People /> },
  { path: "/stats", label: "Stats", icon: <BarChart /> },
];

export default function TopBar() {
  const location = useLocation();
  const currentPage =
    pageConfig.find((item) => item.path === location.pathname) || pageConfig[0];

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
        >
          {currentPage.icon}
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            {currentPage.label}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <></>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
