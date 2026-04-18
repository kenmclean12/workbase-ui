import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState, type ReactNode } from "react";
import { Sidebar, TopBar } from "./components";
import { styles } from "./styles";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const sidebarOpen = isSmallScreen ? false : desktopSidebarOpen;

  return (
    <Box sx={styles.root}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setDesktopSidebarOpen((prev) => !prev)}
        disabled={isSmallScreen}
      />

      <Box component="main" sx={styles.main(sidebarOpen ? 240 : 72, theme)}>
        <TopBar />
        <Box sx={styles.content}>{children}</Box>
      </Box>
    </Box>
  );
}
