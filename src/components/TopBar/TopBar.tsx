import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import ProfileMenu, { type ProfileMenuProps } from "../ProfileMenu/ProfileMenu";

export default function TopBar() {
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const { themeMode } = useThemeContext();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const profileMenuProps: ProfileMenuProps = {
    anchorEl,
    open: Boolean(anchorEl),
    onClose: handleMenuClose,
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
    : "U";
  const avatarContent = user?.avatarUrl ? (
    <Avatar
      sx={{ width: 34, height: 34 }}
      alt={`${user.firstName} ${user.lastName}`}
      src={user.avatarUrl}
    />
  ) : (
    <Avatar
      sx={{
        width: 34,
        height: 34,
        bgcolor: themeMode === "dark" ? "#40444d" : "#d9e2eb",
        color: themeMode === "dark" ? "#d1d5db" : "#637381",
        fontWeight: 700,
      }}
    >
      {initials.toUpperCase() || "U"}
    </Avatar>
  );

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            color="inherit"
            edge="start"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            Control Panel
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user && (
            <>
              <IconButton
                size="small"
                onClick={handleAvatarClick}
                sx={{ p: 0 }}
                aria-label="profile menu"
              >
                {avatarContent}
              </IconButton>
              <ProfileMenu {...profileMenuProps} />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
