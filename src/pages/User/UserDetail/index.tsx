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
              <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
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
                      sx={(theme) => ({
                        display: "block",
                        px: 1.25,
                        py: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderLeft: request ? "3px solid" : "1px solid",
                        borderLeftColor: request ? "primary.main" : "divider",
                        borderRadius: 1.5,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#000000"
                            : "rgba(15, 23, 42, 0.02)",
                        cursor: request ? "pointer" : "default",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
                        ...(request
                          ? {
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.025)" : "action.hover",
                              },
                            }
                          : {}),
                      })}
                      onClick={() => request && setSelectedRequest(request)}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              flexShrink: 0,
                            }}
                          >
                            {clientInitials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ minWidth: 0 }}>
                              <Typography variant="caption" color="primary.main" noWrap sx={{ fontWeight: 800, flexShrink: 0 }}>
                                {request ? `REQ-${request.id}` : "REQUEST"}
                              </Typography>
                              <Typography variant="body2" color="text.primary" noWrap sx={{ fontWeight: 700 }}>
                                {request?.title ?? `Request #${entry.requestId}`}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block", mt: 0.15 }}>
                              {clientName} · {entry.action}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="caption" color="text.disabled" noWrap sx={{ flexShrink: 0, pt: 0.25 }}>
                          {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(entry.createdAt))}
                        </Typography>
                      </Stack>
                      {entry.details ? (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 4.5, mt: 0.75, overflowWrap: "anywhere", lineHeight: 1.45 }}>
                          {entry.details}
                        </Typography>
                      ) : null}
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
