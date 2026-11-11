import { AccessTime, Business, PersonOutline } from "@mui/icons-material";
import { Avatar, Box, Card, CardActionArea, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { REQUEST_PRIORITY_META, type RequestResponseDto } from "../types/request";

interface Props {
  request: RequestResponseDto;
  onClick?: () => void;
};

function getInitials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

function formatActivityDate(value: string | null | undefined) {
  if (!value) return "No activity date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No activity date" : new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric",
  }).format(date);
}

export function RequestKanbanCard({ request, onClick }: Props) {
  const displayTitle = request.title?.trim() || "Untitled request";
  const descriptionText = request.description?.trim();
  const priorityMeta = REQUEST_PRIORITY_META[request.priority] ?? REQUEST_PRIORITY_META[1];
  const clientName = request.client?.name ?? "No client";
  const reporterName = [request.createdByUser?.firstName, request.createdByUser?.lastName]
    .filter(Boolean).join(" ") || request.createdByUser?.email || "Unknown reporter";
  const activityDate = request.updatedAt ?? request.createdAt;
  const activityLabel = request.updatedAt ? "Updated" : "Created";

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        minHeight: 200,
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: theme.palette.mode === "dark" ? "#000000" : "background.paper",
        borderColor: theme.palette.divider,
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
        transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.palette.mode === "dark" ? "0 8px 20px rgba(0, 0, 0, 0.24)" : "0 8px 20px rgba(15, 23, 42, 0.10)",
          transform: "translateY(-2px)",
        },
        "&:focus-within": { borderColor: "primary.main", boxShadow: `0 0 0 2px ${theme.palette.primary.main}33` },
      })}
    >
      <CardActionArea onClick={onClick} disabled={!onClick} aria-label={`Open request ${request.id}: ${displayTitle}`} sx={{ alignItems: "stretch", height: "100%", textAlign: "left", "&.Mui-disabled": { opacity: 1 } }}>
        <Box sx={{ p: 1.5, minWidth: 0 }}>
          <Stack spacing={1.25}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={0.75} minWidth={0}>
                <Avatar sx={{ width: 24, height: 24, fontSize: "0.65rem", fontWeight: 800, bgcolor: "primary.main", color: "primary.contrastText" }}>{getInitials(clientName)}</Avatar>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 700 }}>REQ-{request.id}</Typography>
              </Stack>
              <Tooltip title={`${priorityMeta.label} priority`}>
                <Chip icon={<priorityMeta.icon />} label={priorityMeta.label} size="small" sx={{ height: 23, flexShrink: 0, borderRadius: 1, bgcolor: `${priorityMeta.color}1A`, color: priorityMeta.color, fontWeight: 800, fontSize: "0.68rem", ".MuiChip-icon": { color: "inherit", fontSize: "0.9rem" } }} />
              </Tooltip>
            </Stack>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 750, lineHeight: 1.35, display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{displayTitle}</Typography>
              {descriptionText ? <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: "0.78rem", lineHeight: 1.45, display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{descriptionText}</Typography> : null}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" minWidth={0}>
              <Tooltip title={`Reported by ${reporterName}`}>
                <Stack direction="row" spacing={0.5} alignItems="center" minWidth={0}>
                  {request.createdByUser?.avatarUrl ? <Avatar src={request.createdByUser.avatarUrl} sx={{ width: 20, height: 20 }} /> : <PersonOutline sx={{ fontSize: 17, color: "text.secondary" }} />}
                  <Typography variant="caption" color="text.secondary" noWrap>{reporterName}</Typography>
                </Stack>
              </Tooltip>
              {request.internal ? <Chip label="Internal" size="small" sx={{ height: 20, fontSize: "0.63rem", fontWeight: 700, borderRadius: 1, flexShrink: 0 }} /> : null}
            </Stack>
            <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={0.5} alignItems="center" minWidth={0}>
                  <Business sx={{ fontSize: 15, color: "text.disabled", flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary" noWrap>{clientName}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.35} alignItems="center" sx={{ color: "text.disabled", flexShrink: 0 }}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  <Typography variant="caption" color="text.disabled" noWrap>{activityLabel} {formatActivityDate(activityDate)}</Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
}
