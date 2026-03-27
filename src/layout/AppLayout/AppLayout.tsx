import { useState, type ReactNode } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

type AppLayoutProps = {
  children: ReactNode;
};

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 72;

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleDrawer = () => setSidebarOpen((prev) => !prev);
  const drawerWidth = sidebarOpen
    ? DRAWER_WIDTH_EXPANDED
    : DRAWER_WIDTH_COLLAPSED;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={sidebarOpen} onToggle={toggleDrawer} />
      <Box
        component="main"
        sx={{
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar />
        <Box
          sx={{
            padding: 3,
            flex: 1,
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
