import { InboxOutlined } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

interface RequestColumnEmptyStateProps {
  statusLabel: string;
}

export function RequestColumnEmptyState({
  statusLabel,
}: RequestColumnEmptyStateProps) {
  const emptyLabel =
    statusLabel.toLowerCase() === "done" ? "completed" : statusLabel.toLowerCase();

  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        minHeight: 140,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.02)"
            : "rgba(15, 23, 42, 0.02)",
        textAlign: "center",
      })}
    >
      <Stack spacing={1} alignItems="center" sx={{ maxWidth: 240 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "text.secondary",
            backgroundColor: "action.hover",
          }}
        >
          <InboxOutlined fontSize="small" />
        </Box>
        <Typography variant="body2" color="text.primary" fontWeight={700}>
          No {emptyLabel} requests yet
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Requests will show up here as work moves through the workflow.
        </Typography>
      </Stack>
    </Box>
  );
}
