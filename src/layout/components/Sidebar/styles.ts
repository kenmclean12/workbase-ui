import type { Theme } from "@mui/material";

export const styles = {
  drawer: (width: number) => ({
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width,
    flexShrink: 0,
    transition: (theme: Theme) =>
      theme.transitions.create("width", {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
      }),
    "& .MuiDrawer-paper": {
      width,
      boxSizing: "border-box",
      borderRight: "1px solid",
      borderColor: "divider",
      backgroundColor: "background.paper",
      transition: (theme: Theme) =>
        theme.transitions.create("width", {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        }),
      overflowX: "hidden",
      display: "flex",
      flexDirection: "column",
    },
  }),

  brand: {
    p: 2,
    borderBottom: "1px solid",
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandLeft: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  brandText: {
    fontWeight: 700,
    fontSize: 18,
  },

  list: {
    flexGrow: 1,
  },

  listItemButton: (open: boolean, active: boolean) => ({
    minHeight: 48,
    justifyContent: open ? "initial" : "center",
    px: 2.5,
    backgroundColor: active ? "action.selected" : "transparent",
    color: active ? "primary.main" : "text.primary",
    "& .MuiListItemIcon-root": {
      color: active ? "primary.main" : "inherit",
      minWidth: 0,
      mr: open ? 2 : "auto",
      justifyContent: "center",
    },
    "&:hover": {
      backgroundColor: active ? "action.selected" : "action.hover",
    },
  }),

  listItemIcon: {
    minWidth: 0,
  },

  footer: (open: boolean) => ({
    p: 2,
    borderTop: "1px solid",
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    justifyContent: open ? "flex-start" : "center",
    gap: open ? 2 : 0,
  }),

  userInfo: {
    overflow: "hidden",
    flex: 1,
    minWidth: 0,
  },

  userName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  userEmail: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
