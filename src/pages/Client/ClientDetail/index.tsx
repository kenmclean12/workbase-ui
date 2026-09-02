import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
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
import { useClientGetById, useClientsGetAll, useRequestsGetByClient } from "../../../hooks";
import { REQUEST_STATUS_META, RequestStatus, type RequestResponseDto } from "../../../types/request";

export function ClientDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data: clients = [] } = useClientsGetAll({ enabled: IS_CLIENT_USER && !id });
  const clientId = id ? Number(id) : (IS_CLIENT_USER ? clients[0]?.id : undefined);
  const { data: client } = useClientGetById(clientId);
  const { data: requests = [] } = useRequestsGetByClient(clientId);
  const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

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
          pb: 2.25,
          mb: 0,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          textAlign: "left",
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
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowClientDetails((current) => !current)}
            sx={{ flexShrink: 0, ml: "auto" }}
          >
            {showClientDetails ? "Hide Client Details" : "View Client Details"}
          </Button>
        </Box>
        {showClientDetails ? <Divider sx={{ my: 1 }} /> : null}
        {showClientDetails ? (
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
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>Email</Typography>
                <Typography variant="body2" noWrap>{client.email ?? "—"}</Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>Phone</Typography>
                <Typography variant="body2" noWrap>{client.phone ?? "—"}</Typography>
              </Box>
              <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper", gridColumn: { xs: "auto", sm: "1 / -1" } }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>Website</Typography>
                <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{client.website ?? "—"}</Typography>
              </Box>
            </Box>
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  columnGap: 2,
                  rowGap: 0.5,
                }}
              >
                <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" }, p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper", minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>Street</Typography>
                  <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{client.address.street}</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper", minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>City</Typography>
                  <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{client.address.city}</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper", minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>State</Typography>
                  <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{client.address.state}</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper", minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>Country</Typography>
                  <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{client.address.country}</Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "background.paper", minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>Postal Code</Typography>
                  <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{client.address.postalCode}</Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No address available.
              </Typography>
            )}
          </Box>
        </Stack>
        ) : null}
        {showClientDetails ? <Divider sx={{ my: 1 }} /> : null}
      </Paper>
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 1.5,
          pt: 1.75,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
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
