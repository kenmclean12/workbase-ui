import type { Theme } from "@mui/material";

export const styles = {
  appBar: (theme: Theme) => ({
    top: 0,
    borderBottom: "1px solid",
    borderColor: "divider",
    zIndex: theme.zIndex.drawer + 1,
  }),

  toolbar: {
    minHeight: "66px !important",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flexGrow: 1,
    minHeight: 0,
  },

  title: (isDarkMode: boolean) => ({
    fontSize: "19px",
    fontWeight: 500,
    lineHeight: 1,
    color: isDarkMode ? "white" : "black",
  }),

  right: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
};
