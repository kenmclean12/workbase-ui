import type { ReactNode } from "react";
import { Home, People, Business, Work, BarChart } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useLocation } from "react-router-dom";

type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", path: "/", icon: <Home /> },
  { key: "users", label: "Users", path: "/users", icon: <People /> },
  { key: "clients", label: "Clients", path: "/clients", icon: <Business /> },
  { key: "jobs", label: "Jobs", path: "/jobs", icon: <Work /> },
  { key: "stats", label: "Stats", path: "/stats", icon: <BarChart /> },
];

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid",
          backgroundColor: "background.default",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            S
          </Box>
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            SaaS Admin
          </Box>
        </Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                backgroundColor:
                  location.pathname === item.path ? "#e3f2fd" : "transparent",
                color: location.pathname === item.path ? "#1565c0" : "inherit",
                "& .MuiListItemIcon-root": {
                  color:
                    location.pathname === item.path ? "#1565c0" : "inherit",
                },
                "&:hover": {
                  backgroundColor:
                    location.pathname === item.path ? "#e3f2fd" : "#f5f5f5",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
