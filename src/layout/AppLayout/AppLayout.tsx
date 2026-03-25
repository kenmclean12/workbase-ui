import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

type AppLayoutProps = {
  children: ReactNode;
};

const appLayoutStyles = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
};

const appLayoutMainStyles = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const appLayoutContentStyles = {
  padding: 24,
  flex: 1,
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={appLayoutStyles}>
      <Sidebar />
      <Box component="main" sx={appLayoutMainStyles}>
        <TopBar />
        <Box sx={appLayoutContentStyles}>{children}</Box>
      </Box>
    </Box>
  );
}
