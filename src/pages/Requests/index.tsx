import { Box, Chip, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IS_CLIENT_USER } from "../../config/appMode";
import { RequestDetailDialog } from "../../components/RequestDetailDialog";
import { RequestKanbanCard } from "../../components/RequestKanbanCard";
import { useClientsGetAll, useRequestsGetAll, useRequestsGetByClient } from "../../hooks";
import { REQUEST_STATUS_META, RequestStatus, type RequestResponseDto } from "../../types/request";

const columns = [
  { key: RequestStatus.UNASSIGNED, label: "Unassigned" },
  { key: RequestStatus.IN_PROGRESS, label: "In Progress" },
  { key: RequestStatus.DONE, label: "Done" },
] as const;

export function RequestsPage() {
  const { data: clients = [] } = useClientsGetAll({ enabled: IS_CLIENT_USER });
  const clientId = IS_CLIENT_USER ? clients[0]?.id : undefined;
  const { data: allRequests = [], isLoading: isAllRequestsLoading } = useRequestsGetAll({
    enabled: !IS_CLIENT_USER,
  });
  const { data: clientRequests = [], isLoading: isClientRequestsLoading } = useRequestsGetByClient(
    clientId,
    { enabled: IS_CLIENT_USER && !!clientId },
  );
  const requests = IS_CLIENT_USER ? clientRequests : allRequests;
  const isLoading = IS_CLIENT_USER
    ? clients.length === 0 || isClientRequestsLoading
    : isAllRequestsLoading;
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
            <Box sx={{ p: 1.5, pb: 1 }}>
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
                    border: "none",
                    height: 22,
                  }}
                />
              </Stack>
            </Box>
            <Divider />
            <Box
              sx={{
                p: 1.5,
                pt: 0.75,
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
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
                (groupedRequests[column.key] ?? []).map((request) => (
                  <RequestKanbanCard
                    key={request.id}
                    request={request}
                    onClick={() => setSelectedRequest(request)}
                  />
                ))
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
