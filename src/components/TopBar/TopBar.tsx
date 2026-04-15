import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Home, Business, Work, People, BarChart } from "@mui/icons-material";
import { useTheme } from "@mui/material";

const pageConfig = [
  { path: "/", label: "Home", icon: <Home /> },
  { path: "/clients", label: "Clients", icon: <Business /> },
  { path: "/jobs", label: "Tasks", icon: <Work /> },
  { path: "/users", label: "Users", icon: <People /> },
  { path: "/stats", label: "Stats", icon: <BarChart /> },
];

export default function TopBar() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const location = useLocation();
  const currentPage =
    pageConfig.find((item) => item.path === location.pathname) || pageConfig[0];

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        top: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "66px !important",
          alignItems: "center",
          px: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {currentPage.icon}
          <Typography
            color={isDarkMode ? "white" : "black"}
            sx={{ fontSize: "20px", fontWeight: 500, lineHeight: 1 }}
          >
            {currentPage.label}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <></>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
