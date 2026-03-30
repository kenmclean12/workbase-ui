import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useThemeContext } from "../../../../context/ThemeContext";

export default function ThemeToggle() {
  const { themeMode, toggleTheme } = useThemeContext();

  return (
    <FormControlLabel
      control={<Switch checked={themeMode === "dark"} onChange={toggleTheme} />}
      label="Dark mode"
      sx={{ m: 0, color: "inherit" }}
    />
  );
}
