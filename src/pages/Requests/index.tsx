import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useRequestsGetAll } from "../../hooks/request";
import { REQUEST_STATUS_META, RequestStatus, type RequestResponseDto } from "../../types/request";

const columns = [
  { key: RequestStatus.UNASSIGNED, label: "Unassigned" },
  { key: RequestStatus.IN_PROGRESS, label: "In Progress" },
  { key: RequestStatus.DONE, label: "Done" },
] as const;

export function RequestsPage() {
  const { data: requests = [], isLoading } = useRequestsGetAll();

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
            <Box sx={{ p: 2, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                (groupedRequests[column.key] ?? []).map((request) => (
                  <Card key={request.id} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 1.5, pb: "12px !important" }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            #{request.id} {request.title}
                          </Typography>
                          <Chip
                            label={REQUEST_STATUS_META[request.status].label}
                            size="small"
                            sx={{
                              backgroundColor: REQUEST_STATUS_META[request.status].color,
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {request.description}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            Client #{request.clientId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Assigned #{request.assignedToUserId ?? "Unassigned"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
