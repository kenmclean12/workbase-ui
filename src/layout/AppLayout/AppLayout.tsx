import { useState, type ReactNode } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import TopBar from "../../components/TopBar";
import { Sidebar } from "../../components/Sidebar/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleDrawer = () => setSidebarOpen((prev) => !prev);
  const drawerWidth = sidebarOpen ? 240 : 72;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
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
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <TopBar />
        <Box
          sx={{
            padding: 3,
            flex: 1,
            minHeight: 0,
            minWidth: 400,
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "none",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
