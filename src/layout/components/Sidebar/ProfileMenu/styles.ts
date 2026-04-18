export const styles = {
  menuPaper: {
    mt: 1.5,
    width: 240,
    "& .MuiMenuItem-root": {
      py: 1,
      "&:hover": {
        backgroundColor: "action.hover",
      },
    },
  },

  header: {
    px: 2,
    py: 1.5,
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },

  avatar: {
    width: 40,
    height: 40,
    fontWeight: 700,
  },

  textContainer: {
    minWidth: 0,
  },

  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 140,
  },

  email: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 140,
    display: "block",
  },

  themeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  themeSwitch: {
    display: "flex",
    alignItems: "center",
  },

  logoutIcon: {
    fontSize: 20,
  },
};
