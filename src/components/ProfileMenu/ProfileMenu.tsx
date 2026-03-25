import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import { useAuthContext } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle.tsx";
import { useThemeContext } from "../../context/ThemeContext";

export interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function ProfileMenu({
  anchorEl,
  open,
  onClose,
}: ProfileMenuProps) {
  const { logout } = useAuthContext();
  const { themeMode } = useThemeContext();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          mt: 1,
          "& .MuiSwitch-root": {
            width: 36,
            height: 20,
            padding: 0,
            "& .MuiSwitch-switchBase": {
              padding: "2px",
              "&.Mui-checked": {
                transform: "translateX(16px)",
              },
            },
            "& .MuiSwitch-thumb": {
              height: 16,
              width: 16,
            },
            "& .MuiSwitch-track": {
              borderRadius: 10,
            },
          },
        },
      }}
    >
      <MenuItem onClick={onClose}>
        <ThemeToggle />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );
}
