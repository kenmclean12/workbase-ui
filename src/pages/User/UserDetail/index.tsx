import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RequestDetailDialog } from "../../../components/RequestDetailDialog";
import { useAuthContext } from "../../../context";
import { useRequestsGetByUser, useUsersGetAll } from "../../../hooks";
import {
  REQUEST_PRIORITY_META,
  REQUEST_STATUS_META,
  RequestStatus,
  type RequestResponseDto,
} from "../../../types/request";
import { styles } from "./styles";

export function UserDetail() {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [showRoleChip, setShowRoleChip] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);
  const { data: users = [] } = useUsersGetAll();
  const defaultUserId = currentUser?.id ?? users[0]?.id ?? 0;
  const resolvedId = location.pathname.includes("profile")
    ? Number(defaultUserId)
    : Number(id ?? defaultUserId);
  const { data: assignedRequests = [] } = useRequestsGetByUser(resolvedId || undefined);
  const user = users.find((item) => item.id === resolvedId) ?? currentUser ?? users[0] ?? null;
  const isLoading = false;

  const groupedRequests = useMemo(() => {
    return {
      [RequestStatus.IN_PROGRESS]: assignedRequests.filter(
        (request) => request.status === RequestStatus.IN_PROGRESS,
      ),
      [RequestStatus.DONE]: assignedRequests.filter(
        (request) => request.status === RequestStatus.DONE,
      ),
    } as Record<number, RequestResponseDto[]>;
  }, [assignedRequests]);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const computeVisibility = () => {
      setShowRoleChip(element.clientWidth > 450);
    };

    computeVisibility();
    const observer = new ResizeObserver(computeVisibility);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={styles.loadingContainer}>
        <Typography variant="body1" color="text.secondary">
          No user found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <Paper elevation={1} sx={styles.headerPaper}>
        <Box ref={headerRef} sx={styles.headerRow}>
          {!location.pathname.includes("profile") && (
            <Tooltip title="Back to users">
              <IconButton onClick={() => navigate("/users")} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={styles.headerContent}>
            <Avatar
              src={user.avatarUrl || undefined}
              alt={`${user.firstName} ${user.lastName}`}
              sx={styles.avatar}
            >
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </Avatar>
            <Box sx={styles.infoContainer}>
              <Stack sx={styles.nameRow}>
                <Typography
                  sx={styles.nameText}
                  color="text.primary"
                  variant="h6"
                  component="h2"
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    ...styles.roleChip,
                    display: showRoleChip ? "inline-flex" : "none",
                  }}
                />
              </Stack>
              <Typography sx={styles.emailText} variant="body2">
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ ...styles.contentPaper, p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Assigned Requests
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ alignItems: "stretch" }}
        >
          {[RequestStatus.IN_PROGRESS, RequestStatus.DONE].map((status) => (
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
              <Box sx={{ p: 2, pb: 1.5 }}>
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
                    }}
                  />
                </Stack>
              </Box>
              <Box
                sx={{
                  p: 2,
                  pt: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
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
                    const priorityMeta = REQUEST_PRIORITY_META[request.priority] ?? REQUEST_PRIORITY_META[1];

                    return (
                      <Box
                        key={request.id}
                        onClick={() => setSelectedRequest(request)}
                        sx={(theme) => ({
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          p: 1.5,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(15, 23, 42, 0.9)"
                              : "rgba(255, 255, 255, 0.96)",
                          cursor: "pointer",
                          minHeight: 128,
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
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
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
                            <Stack spacing={0.8} sx={{ textAlign: "left", flex: 1, minWidth: 0 }}>
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
                                }}
                              >
                                {clientName}
                              </Typography>

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
                            </Stack>
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
