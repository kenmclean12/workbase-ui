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
import { RequestKanbanCard } from "../../../components/RequestKanbanCard";
import { useAuthContext } from "../../../context";
import { useRequestsGetByUser, useUserGetById, useUsersGetAll } from "../../../hooks";
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
  const { data: assignedRequests = [] } = useRequestsGetByUser(resolvedId || undefined);
  const user = routeUserId ? userById ?? null : currentUser ?? users[0] ?? null;
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
        </Box>
      </Paper>
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
      <RequestDetailDialog
        request={selectedRequest}
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </Box>
  );
}
