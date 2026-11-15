import { ArrowBack, BusinessOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientDetailsDialog } from "../../../components/ClientDetailsDialog";
import { IS_CLIENT_USER } from "../../../config/appMode";
import { RequestDetailDialog } from "../../../components/RequestDetailDialog";
import { RequestKanbanCard } from "../../../components/RequestKanbanCard";
import { RequestColumnEmptyState } from "../../../components/RequestColumnEmptyState";
import { useClientGetById, useClientsGetAll, useRequestsGetByClient } from "../../../hooks";
import { useAuthContext } from "../../../context";
import { REQUEST_STATUS_META, RequestStatus, type RequestResponseDto } from "../../../types/request";
import { isAdminOrSuperAdmin } from "../../../types/user";

export function ClientDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  const canEditClients = isAdminOrSuperAdmin(currentUser?.role);
  const { data: clients = [] } = useClientsGetAll({ enabled: IS_CLIENT_USER && !id });
  const clientId = id ? Number(id) : (IS_CLIENT_USER ? clients[0]?.id : undefined);
  const { data: client } = useClientGetById(clientId);
  const { data: requests = [] } = useRequestsGetByClient(clientId);
  const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);

  const groupedRequests = useMemo(() => {
    return {
      [RequestStatus.UNASSIGNED]: requests.filter(
        (request) => request.status === RequestStatus.UNASSIGNED,
      ),
      [RequestStatus.IN_PROGRESS]: requests.filter(
        (request) => request.status === RequestStatus.IN_PROGRESS,
      ),
      [RequestStatus.DONE]: requests.filter(
        (request) => request.status === RequestStatus.DONE,
      ),
    } as Record<number, RequestResponseDto[]>;
  }, [requests]);

  if (!client) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No client found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        mx: 0,
        textAlign: "left",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          pb: 1.5,
          mb: 0.75,
          borderRadius: "12px",
          textAlign: "left",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 1.25,
            flexWrap: "nowrap",
            minWidth: 0,
          }}
        >
          {!IS_CLIENT_USER && (
            <Tooltip title="Back to clients">
              <IconButton onClick={() => navigate("/clients")} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{ width: 56, height: 56, flexShrink: 0 }}
              alt={client.name}
            >
              {client.name?.[0]}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                textAlign: "left",
                gap: 0.25,
                minWidth: 0,
                flex: "1 1 0%",
                overflow: "hidden",
                width: 0,
              }}
            >
              <Tooltip title={client.name} placement="top">
                <Typography
                  variant="h6"
                  component="h2"
                  noWrap
                  color="text.primary"
                  sx={{
                    fontWeight: 600,
                    minWidth: 0,
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {client.name}
                </Typography>
              </Tooltip>
              <Tooltip title={client.email ?? "No contact info"} placement="top">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                    flex: "1 1 0%",
                    width: "100%",
                    maxWidth: "100%",
                    display: "block",
                  }}
                >
                  {client.email ?? "No contact info"}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<BusinessOutlined />}
            onClick={() => setIsClientDetailsOpen(true)}
            sx={{ flexShrink: 0, ml: "auto" }}
          >
            Details
          </Button>
        </Box>
      </Paper>
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 1.5,
          pt: 1.75,
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" component="h3" gutterBottom>
          Client Requests
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ alignItems: "stretch", flex: 1, minHeight: 0, height: "100%" }}
        >
          {[RequestStatus.UNASSIGNED, RequestStatus.IN_PROGRESS, RequestStatus.DONE].map((status) => (
            <Box
              key={status}
              sx={{
                flex: 1,
                minWidth: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
                minHeight: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ p: 1.5, pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {REQUEST_STATUS_META[status].label}
                  </Typography>
                  <Chip
                    label={groupedRequests[status]?.length ?? 0}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: "transparent",
                      color: REQUEST_STATUS_META[status].color,
                      fontWeight: 700,
                      border: `1px solid ${REQUEST_STATUS_META[status].color}`,
                      height: 22,
                    }}
                  />
                </Stack>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  pt: 0.75,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                }}
              >
                {(groupedRequests[status] ?? []).length === 0 ? (
                  <RequestColumnEmptyState statusLabel={REQUEST_STATUS_META[status].label} />
                ) : (
                  (groupedRequests[status] ?? []).map((request) => (
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
      </Paper>
      <RequestDetailDialog
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
      {isClientDetailsOpen ? (
        <ClientDetailsDialog
          key={client.id}
          client={client}
          open
          canEdit={canEditClients}
          onClose={() => setIsClientDetailsOpen(false)}
        />
      ) : null}
    </Box>
  );
}
