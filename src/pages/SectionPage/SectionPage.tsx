import type { CSSProperties } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type SectionPageProps = {
  title: string;
  description?: string;
  style?: CSSProperties;
};

const sectionPagePaperStyles = {
  padding: 24,
};

export default function SectionPage({ title, description, style }: SectionPageProps) {
  return (
    <Box component={Paper} elevation={1} sx={{ ...sectionPagePaperStyles, ...style }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description ?? "Content goes here."}
      </Typography>
    </Box>
  );
}