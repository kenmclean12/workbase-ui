import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState, type ReactNode } from "react";
import { Sidebar, TopBar } from "../components";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(!isSmallScreen);
  const toggleDrawer = () => {
    setSidebarOpen((prev) => !prev);
    setDesktopSidebarOpen((prev) => !prev);
  };
  const drawerWidth = sidebarOpen ? 240 : 72;

  useEffect(() => {
    if (isSmallScreen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(desktopSidebarOpen);
    }
  }, [isSmallScreen, desktopSidebarOpen]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={toggleDrawer}
        disabled={isSmallScreen}
      />
      <Box
        component="main"
        sx={{
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
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
