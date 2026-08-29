import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Badge,
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
import { RequestDetailDialog } from "../../../components/RequestDetailDialog";
import { useClientGetById, useRequestsGetByClient } from "../../../hooks";
import {
  REQUEST_PRIORITY_META,
  REQUEST_STATUS_META,
  RequestStatus,
  type RequestResponseDto,
} from "../../../types/request";

export function ClientDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const clientId = id ? Number(id) : undefined;
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
          <Tooltip title="Back to clients">
            <IconButton onClick={() => navigate("/clients")} size="small">
              <ArrowBack fontSize="small" />
            </IconButton>
          </Tooltip>

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
          <Button variant="outlined" size="small" disabled>
            Contacts (0)
          </Button>
          <Stack direction="row">
            <Button variant="outlined" size="small" disabled>
              Requests
            </Button>
            <Badge badgeContent={requests.length} color="error" overlap="circular" />
          </Stack>
        </Box>
        {/* <Divider sx={{ my: 1 }} /> */}
        {/* <Stack direction="row" spacing={2} flexWrap="wrap">
          <Box sx={{ minWidth: 240, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Client Information
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {client.email ?? "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {client.phone ?? "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Website:</strong> {client.website ?? "—"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 240, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Address
            </Typography>
            {client.address ? (
              <Box>
                <Typography variant="body2">{client.address.city}</Typography>
                <Typography variant="body2">
                  {client.address.state}, {client.address.country}
                </Typography>
                <Typography variant="body2">
                  {client.address.postalCode}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2">No address available.</Typography>
            )}
          </Box>
        </Stack> */}
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
                  (groupedRequests[status] ?? []).map((request) => {
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
                      <Box
                        key={request.id}
                        onClick={() => setSelectedRequest(request)}
                        sx={(theme) => ({
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1.5,
                          p: 1.25,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(15, 23, 42, 0.9)"
                              : "rgba(255, 255, 255, 0.96)",
                          cursor: "pointer",
                          minHeight: 150,
                          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
                          transition:
                            "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                          "&:hover": {
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 8px 20px rgba(15, 23, 42, 0.4)"
                                : "0 8px 18px rgba(15, 23, 42, 0.12)",
                            borderColor: theme.palette.primary.main,
                            transform: "translateY(-2px)",
                          },
                        })}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "flex-start" }}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, flex: 1, minWidth: 0 }}>
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

                            {displayTitle && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  lineHeight: 1.5,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  textAlign: "left",
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
                                }}
                              >
                                {descriptionText}
                              </Typography>
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                mt: "auto",
                                pt: 0.25,
                                pb: 0.25,
                                mb: 0.25,
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
                      </Box>
                    );
                  })
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
