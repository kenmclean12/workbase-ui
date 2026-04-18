import type { Theme } from "@mui/material";

export const styles = {
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },

  main: (drawerWidth: number, theme: Theme) => ({
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
  }),

  content: {
    padding: 3,
    flex: 1,
    minHeight: 0,
    minWidth: 400,
    overflowY: "auto",
    overflowX: "hidden",
    overscrollBehavior: "none",
  },
};
