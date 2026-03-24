import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function MainPage() {
  return (
    <Box component={Paper} elevation={1} sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Main Page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This is the empty dashboard space. Start adding widgets and data cards
        here.
      </Typography>
    </Box>
  );
}
