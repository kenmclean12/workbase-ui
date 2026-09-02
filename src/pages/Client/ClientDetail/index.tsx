import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Divider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IS_CLIENT_USER } from "../../../config/appMode";
import { RequestDetailDialog } from "../../../components/RequestDetailDialog";
import { RequestKanbanCard } from "../../../components/RequestKanbanCard";
import { useAuthContext } from "../../../context";
import { useClientGetById, useRequestsGetByClient } from "../../../hooks";
import { REQUEST_STATUS_META, RequestStatus, type RequestResponseDto } from "../../../types/request";

export function ClientDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  const clientId = id ? Number(id) : (IS_CLIENT_USER ? currentUser?.clientId ?? undefined : undefined);
  const { data: client } = useClientGetById(clientId);
  const { data: requests = [] } = useRequestsGetByClient(clientId);
  const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);

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
      <Paper elevation={1} sx={{ p: 1.5, pb: 2.25, textAlign: "left" }}>
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
                flex: 1,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                noWrap
                color="text.primary"
                sx={{
                  fontWeight: 600,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {client.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                  width: "100%",
                  display: "block",
                }}
              >
                {client.email ?? "No contact info"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Client Information
            </Typography>
            <Stack spacing={0.75}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: "text.secondary", fontWeight: 600, mr: 1 }}>
                  Email
                </Box>
                {client.email ?? "—"}
              </Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ color: "text.secondary", fontWeight: 600, mr: 1 }}>
                  Phone
                </Box>
                {client.phone ?? "—"}
              </Typography>
              <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                <Box component="span" sx={{ color: "text.secondary", fontWeight: 600, mr: 1 }}>
                  Website
                </Box>
                {client.website ?? "—"}
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Address
            </Typography>
            {client.address ? (
              <Stack spacing={0.75}>
                <Typography variant="body2">{client.address.city}</Typography>
                <Typography variant="body2">
                  {client.address.state}, {client.address.country}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.address.postalCode}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No address available.
              </Typography>
            )}
          </Box>
        </Stack>
        <Divider sx={{ my: 1 }} />
      </Paper>
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 1.5,
          pt: 1.75,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
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
                    sx={{
                      backgroundColor: REQUEST_STATUS_META[status].color,
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
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
                    No {REQUEST_STATUS_META[status].label.toLowerCase()} requests
                  </Box>
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
    </Box>
  );
}
