import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RequestDetailDialog } from "../../../components/RequestDetailDialog";
import { RequestKanbanCard } from "../../../components/RequestKanbanCard";
import { useAuthContext } from "../../../context";
import { useRequestsGetByUser, useUserActivity, useUserGetById, useUsersGetAll } from "../../../hooks";
import { REQUEST_STATUS_META, RequestStatus, type RequestResponseDto } from "../../../types/request";
import { getUserRoleLabel } from "../../../types/user";
import { styles } from "./styles";

export function UserDetail() {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [showRoleChip, setShowRoleChip] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);
  const routeUserId = id ? Number(id) : undefined;
  const { data: users = [], isLoading: isUsersLoading } = useUsersGetAll({
    enabled: !routeUserId,
  });
  const defaultUserId = currentUser?.id ?? users[0]?.id ?? 0;
  const resolvedId = location.pathname.includes("profile")
    ? Number(defaultUserId)
    : Number(routeUserId ?? defaultUserId);
  const { data: userById, isLoading: isUserLoading } = useUserGetById(routeUserId, {
    enabled: !!routeUserId,
  });
  const user = routeUserId ? userById ?? null : currentUser ?? users[0] ?? null;
  const targetUserId = user?.id ?? resolvedId;
  const { data: assignedRequests = [] } = useRequestsGetByUser(targetUserId || undefined);
  const { data: activityEntries = [], isLoading: isActivityLoading } = useUserActivity(
    targetUserId || undefined,
    { enabled: showActivity },
  );
  const isLoading = routeUserId ? isUserLoading : isUsersLoading && !currentUser;

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
    <Box
      sx={{
        ...styles.root,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
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
                  label={getUserRoleLabel(user.role)}
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
          <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0, ml: "auto" }}>
            <Button
              variant={!showActivity ? "contained" : "outlined"}
              onClick={() => setShowActivity(false)}
            >
              Requests
            </Button>
            <Button
              variant={showActivity ? "contained" : "outlined"}
              onClick={() => setShowActivity(true)}
            >
              Activity
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>
      {showActivity ? (
        <Paper
          elevation={1}
          sx={{
            ...styles.contentPaper,
            p: 1.5,
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
            User Activity
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            {isActivityLoading ? (
              <Box sx={styles.loadingContainer}>
                <CircularProgress />
              </Box>
            ) : activityEntries.length === 0 ? (
              <Box sx={{ py: 5, textAlign: "center" }}>
                <Typography color="text.secondary">No activity found.</Typography>
              </Box>
            ) : (
              <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {activityEntries.map((entry) => {
                  const request = entry.request;
                  const clientName = request?.client?.name ?? "Client unavailable";
                  const clientInitials = clientName
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("") || "C";
                  return (
                    <ListItem
                      key={entry.id}
                      disableGutters
                      sx={{
                        display: "block",
                        px: 1.5,
                        py: 1.25,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        backgroundColor: "rgba(15, 23, 42, 0.02)",
                        cursor: request ? "pointer" : "default",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        ...(request
                          ? {
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                              },
                            }
                          : {}),
                      }}
                      onClick={() => request && setSelectedRequest(request)}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center" sx={{ minWidth: 0, mb: 1.25 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "0.72rem",
                              bgcolor: "transparent",
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.main",
                            }}
                          >
                            {clientInitials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" color="text.primary" noWrap sx={{ fontWeight: 700 }}>
                              {clientName}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                          {new Date(entry.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Box
                        sx={(theme) => ({
                          p: 1.25,
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.16)"
                              : "divider",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "#111827"
                              : "rgba(148, 163, 184, 0.06)",
                          minWidth: 0,
                        })}
                      >
                        <Typography
                          variant="caption"
                          sx={(theme) => ({
                            display: "block",
                            mb: 0.35,
                            lineHeight: 1.2,
                            color:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.7)"
                                : "text.secondary",
                          })}
                        >
                          Request
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={(theme) => ({
                            color: theme.palette.mode === "dark" ? "#fff" : "text.primary",
                          })}
                          noWrap
                        >
                          {request?.title ?? `Request #${entry.requestId}`}
                        </Typography>
                      </Box>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1 }}>
                        <Box
                          sx={(theme) => ({
                            flex: 1,
                            minWidth: 0,
                            px: 1.25,
                            py: 1,
                            borderRadius: 1,
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "#111827"
                                : "rgba(148, 163, 184, 0.06)",
                            border:
                              theme.palette.mode === "dark"
                                ? "1px solid rgba(255, 255, 255, 0.16)"
                                : "none",
                          })}
                        >
                          <Typography
                            variant="caption"
                            sx={(theme) => ({
                              display: "block",
                              lineHeight: 1.2,
                              color:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.7)"
                                  : "text.secondary",
                            })}
                          >
                            Action
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={(theme) => ({
                              color: theme.palette.mode === "dark" ? "#fff" : "text.primary",
                            })}
                            noWrap
                          >
                            {entry.action}
                          </Typography>
                        </Box>
                        {entry.details ? (
                          <Box sx={{ flex: 2, minWidth: 0, px: 1.25, py: 1, borderRadius: 1, backgroundColor: "rgba(148, 163, 184, 0.08)" }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
                              Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                              {entry.details}
                            </Typography>
                          </Box>
                        ) : null}
                      </Stack>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        </Paper>
      ) : (
      <Paper
        elevation={1}
        sx={{
          ...styles.contentPaper,
          p: 1.5,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="h3" gutterBottom>
          Assigned Requests
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ alignItems: "stretch", flex: 1, minHeight: 0, height: "100%" }}
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
      )}
      <RequestDetailDialog
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </Box>
  );
}
