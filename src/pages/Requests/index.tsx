import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { RequestDetailDialog } from "../../components/RequestDetailDialog";
import { useRequestsGetAll } from "../../hooks/request";
import {
  REQUEST_PRIORITY_META,
  REQUEST_STATUS_META,
  RequestStatus,
  type RequestResponseDto,
} from "../../types/request";

const columns = [
  { key: RequestStatus.UNASSIGNED, label: "Unassigned" },
  { key: RequestStatus.IN_PROGRESS, label: "In Progress" },
  { key: RequestStatus.DONE, label: "Done" },
] as const;

export function RequestsPage() {
  const { data: requests = [], isLoading } = useRequestsGetAll();
  const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);

  const groupedRequests = useMemo(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column.key] = requests.filter(
            (request) => request.status === column.key,
          );
          return acc;
        },
        {} as Record<number, RequestResponseDto[]>,
      ),
    [requests],
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ height: "100%", alignItems: "stretch" }}
      >
        {columns.map((column) => (
          <Box
            key={column.key}
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
              minHeight: 0,
              height: "100%",
            }}
          >
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight={700}>
                  {column.label}
                </Typography>
                <Chip
                  label={groupedRequests[column.key]?.length ?? 0}
                  size="small"
                  sx={{
                    backgroundColor: REQUEST_STATUS_META[column.key].color,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />
              </Stack>
            </Box>
            <Divider />
            <Box
              sx={{
                p: 2,
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {(groupedRequests[column.key] ?? []).length === 0 ? (
                <Box
                  sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  No requests
                </Box>
              ) : (
                (groupedRequests[column.key] ?? []).map((request) => {
                  const displayTitle = request.title
                    .replace(/^request\s*/i, "")
                    .replace(/^#?\s*\d+\s*[-:.)]?\s*/i, "")
                    .trim();
                  const clientName = request.client?.name ?? "Client";
                  const clientInitials = clientName
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("") || "C";
                  const descriptionText = request.description?.trim() ?? "";
                  const priorityMeta = REQUEST_PRIORITY_META[request.priority] ?? REQUEST_PRIORITY_META[1];

                  return (
                    <Card
                      key={request.id}
                      variant="outlined"
                      sx={(theme) => ({
                        borderRadius: 2,
                        cursor: "pointer",
                        minHeight: 128,
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
                      onClick={() => setSelectedRequest(request)}
                    >
                      <CardContent sx={{ p: 1.5, pb: "18px !important", flex: 1, minWidth: 0 }}>
                        <Stack spacing={0.8} sx={{ height: "100%", textAlign: "left" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                              <Avatar
                                sx={{
                                  width: 26,
                                  height: 26,
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  bgcolor: "primary.main",
                                  color: "#fff",
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
                            <Chip
                              label={priorityMeta.label}
                              size="small"
                              sx={{
                                backgroundColor: priorityMeta.color,
                                color: priorityMeta.textColor,
                                fontWeight: 700,
                                borderRadius: 999,
                                height: 24,
                                fontSize: "0.68rem",
                                px: 0.8,
                                flexShrink: 0,
                              }}
                            />
                          </Box>

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
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Box>
          </Box>
        ))}
      </Stack>
      <RequestDetailDialog
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </Box>
  );
}
