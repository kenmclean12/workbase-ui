import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import {
  REQUEST_PRIORITY_META,
  type RequestResponseDto,
} from "../types/request";

export type RequestKanbanCardProps = {
  request: RequestResponseDto;
  onClick?: () => void;
};

export function RequestKanbanCard({ request, onClick }: RequestKanbanCardProps) {
  const displayTitle = (request.title || "Untitled request")
    .replace(/^\s*(?:#\s*)?(?:request\s+)?\d+\s*[:\-–—.]?\s*/i, "")
    .replace(/^\s*request\s*[:\-–—.]?\s*/i, "")
    .trim() || "Untitled request";

  const clientName = request.client?.name ?? "Client";
  const clientInitials = clientName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";

  const descriptionText = request.description?.trim() ?? "";
  const createdAt = request.createdAt ? new Date(request.createdAt) : null;
  const createdDateLabel = createdAt && !Number.isNaN(createdAt.getTime())
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(createdAt)
    : "Unknown date";
  const priorityMeta = REQUEST_PRIORITY_META[request.priority] ?? REQUEST_PRIORITY_META[1];

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 1.5,
        cursor: "pointer",
        minHeight: 150,
        maxHeight: 180,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(15, 23, 42, 0.9)"
            : "rgba(255, 255, 255, 0.96)",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
        transition:
          "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        transform: "translateY(0)",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 20px rgba(15, 23, 42, 0.35)"
              : "0 8px 18px rgba(15, 23, 42, 0.12)",
          borderColor: theme.palette.primary.main,
          transform: "translateY(-2px)",
        },
      })}
      onClick={onClick}
    >
      <CardContent sx={{ p: 1.25, pb: "14px !important", flex: 1, minWidth: 0 }}>
        <Stack
          spacing={0.6}
          sx={{
            height: "100%",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              alignItems: "stretch",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.8,
                flex: 1,
                minWidth: 0,
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <Avatar
                  sx={{
                    width: 26,
                    height: 26,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    bgcolor: "transparent",
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  {clientInitials}
                </Avatar>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.35,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                    minWidth: 0,
                  }}
                >
                  {clientName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flex: 1,
                  minHeight: 0,
                  gap: 0.8,
                }}
              >
                {displayTitle && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "left",
                      minWidth: 0,
                    }}
                  >
                    {displayTitle}
                  </Typography>
                )}

                {descriptionText && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      lineHeight: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      textAlign: "left",
                      minWidth: 0,
                    }}
                  >
                    {descriptionText}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  mt: "auto",
                  pt: 0.25,
                  pb: 0.25,
                  mb: 0.25,
                  width: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{
                    display: "block",
                    textAlign: "left",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  Created {createdDateLabel}
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<priorityMeta.icon />}
              label=""
              size="small"
              aria-label={priorityMeta.label}
              sx={{
                border: `1px solid ${priorityMeta.color}`,
                color: priorityMeta.color,
                backgroundColor: "transparent",
                fontWeight: 700,
                borderRadius: 999,
                height: 24,
                minWidth: 24,
                width: 24,
                px: 0,
                ".MuiChip-icon": {
                  margin: 0,
                  color: priorityMeta.color,
                },
                ".MuiChip-label": {
                  display: "none",
                },
                flexShrink: 0,
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
