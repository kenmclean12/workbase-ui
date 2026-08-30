import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context";
import { useAssignableUsersGetAll, useUsersGetAll } from "../hooks";
import { useRequestHistory, useRequestUpdate } from "../hooks/request";
import {
  REQUEST_PRIORITY_META,
  REQUEST_STATUS_META,
  RequestStatus,
  type RequestResponseDto,
} from "../types/request";
import { getUserRoleLabel } from "../types/user";

export function RequestDetailDialog({
  request,
  open,
  onClose,
}: {
  request: RequestResponseDto | null;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuthContext();
  const { data: users = [] } = useUsersGetAll();
  const { data: assignableUsers = [] } = useAssignableUsersGetAll();
  const { data: history = [], isLoading: isHistoryLoading } = useRequestHistory(
    request?.id,
  );
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.UNASSIGNED);
  const [assignedToUserId, setAssignedToUserId] = useState<number | null>(null);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const isUnassigned = request?.status === RequestStatus.UNASSIGNED;

  const updateRequest = useRequestUpdate(request?.id, {
    onSuccess: () => onClose(),
  });

  useEffect(() => {
    if (!request) return;
    setStatus(request.status);
    setAssignedToUserId(request.assignedToUserId ?? null);
    setTitle(request.title);
    setDescription(request.description);
  }, [request]);

  const historyEntries = useMemo(
    () => [...history].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [history],
  );

  if (!request) return null;

  const saveChanges = () => {
    const actingUserId = user?.id ?? users[0]?.id;
    if (!actingUserId) return;

    const effectiveStatus =
      status === RequestStatus.UNASSIGNED && assignedToUserId !== null
        ? RequestStatus.IN_PROGRESS
        : status;

    updateRequest.mutate(
      {
        title: isUnassigned ? request.title : title,
        description: isUnassigned ? request.description : description,
        status: effectiveStatus,
        priority: request.priority,
        assignedToUserId: assignedToUserId,
        actionUserId: actingUserId,
      },
      { onSuccess: () => onClose() },
    );
  };

  const notesCount = historyEntries.length;
  const clientName = request.client?.name ?? "Client";
  const clientInitials = clientName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";
  const createdByUser =
    request.createdByUser ??
    users.find((userOption) => userOption.id === request.createdByUserId) ??
    null;
  const selectedAssignee =
    users.find((userOption) => userOption.id === assignedToUserId) ??
    assignableUsers.find((userOption) => userOption.id === assignedToUserId) ??
    null;
  const filteredAssigneeUsers = assignableUsers.filter((userOption) => {
    if (assignedToUserId !== null && userOption.id === assignedToUserId) {
      return false;
    }

    const query = assigneeSearch.trim().toLowerCase();
    if (!query) return true;

    const fullName = `${userOption.firstName} ${userOption.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      userOption.email.toLowerCase().includes(query)
    );
  });
  const priorityMeta =
    REQUEST_PRIORITY_META[request.priority] ?? REQUEST_PRIORITY_META[1];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(148, 163, 184, 0.04)",
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  bgcolor: "#2563eb !important",
                  color: "#fff !important",
                  border: "1px solid",
                  borderColor: "#2563eb",
                }}
              >
                {clientInitials}
              </Avatar>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "text.primary",
                }}
              >
                {clientName}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(148, 163, 184, 0.03)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "text.primary",
                }}
              >
                {request.title}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<priorityMeta.icon />}
              label=""
              size="small"
              aria-label={priorityMeta.label}
              sx={{
                border: `1px solid ${priorityMeta.color}`,
                color: priorityMeta.color,
                backgroundColor: "transparent",
                width: 24,
                minWidth: 24,
                height: 24,
                px: 0,
                ".MuiChip-icon": {
                  margin: 0,
                  color: priorityMeta.color,
                },
                ".MuiChip-label": {
                  display: "none",
                },
              }}
            />
            <Chip
              label={REQUEST_STATUS_META[request.status].label}
              size="small"
              sx={{
                border: `1px solid ${REQUEST_STATUS_META[request.status].color}`,
                color: REQUEST_STATUS_META[request.status].color,
                fontWeight: 700,
                backgroundColor: "transparent",
              }}
            />
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="request details tabs"
          >
            <Tab label="Details" />
            <Tab label={`Notes (${notesCount})`} />
            <Tab label="History" />
          </Tabs>

          {activeTab === 0 ? (
            <Stack spacing={2}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "rgba(148, 163, 184, 0.04)",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                      Created by
                    </Typography>

                    {createdByUser ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.8rem",
                            bgcolor: "#2563eb !important",
                            color: "#fff !important",
                          }}
                        >
                          {createdByUser.firstName?.[0] ?? ""}
                          {createdByUser.lastName?.[0] ?? ""}
                        </Avatar>
                        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                              {createdByUser.firstName} {createdByUser.lastName}
                            </Typography>
                            <Chip
                              label={getUserRoleLabel(createdByUser.role)}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.625rem",
                                fontWeight: 700,
                                borderRadius: 999,
                                backgroundColor: "rgba(59, 130, 246, 0.12)",
                                color: "primary.main",
                              }}
                            />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                            {createdByUser.email}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unknown user
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={(theme) => ({
                      flex: 1,
                      p: 1.5,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(96, 165, 250, 0.45)"
                          : "rgba(96, 165, 250, 0.3)",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 58, 138, 0.42)"
                          : "rgba(191, 219, 254, 0.35)",
                    })}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                      Assignee
                    </Typography>

                    <Select
                      fullWidth
                      size="small"
                      displayEmpty
                      value={assignedToUserId ?? ""}
                      onChange={(event) => {
                        const nextValue = event.target.value as number | string | null;
                        setAssignedToUserId(
                          nextValue === "" || nextValue === null || nextValue === undefined
                            ? null
                            : Number(nextValue),
                        );
                        setAssigneeSearch("");
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            overflow: "hidden",
                          },
                        },
                        MenuListProps: {
                          onKeyDown: (event) => event.stopPropagation(),
                          onMouseDown: (event) => event.stopPropagation(),
                          sx: {
                            maxHeight: 250,
                            overflowY: "auto",
                            overflowX: "hidden",
                            paddingTop: 0,
                            paddingBottom: 0,
                          },
                        },
                      }}
                      sx={{
                        borderRadius: 1.5,
                        backgroundColor: "rgba(15, 23, 42, 0.02)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "divider",
                        },
                      }}
                      renderValue={() => {
                        if (!selectedAssignee) {
                          return (
                            <Typography variant="body2" color="text.secondary">
                              Unassigned
                            </Typography>
                          );
                        }

                        return (
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                            <Avatar
                              sx={{
                                width: 22,
                                height: 22,
                                fontSize: "0.68rem",
                                bgcolor: "#2563eb !important",
                                color: "#fff !important",
                              }}
                            >
                              {selectedAssignee.firstName?.[0] ?? ""}
                              {selectedAssignee.lastName?.[0] ?? ""}
                            </Avatar>
                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {selectedAssignee.firstName} {selectedAssignee.lastName}
                              </Typography>
                              <Chip
                                label={getUserRoleLabel(selectedAssignee.role)}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.6rem",
                                  fontWeight: 700,
                                  borderRadius: 999,
                                  backgroundColor: "rgba(59, 130, 246, 0.12)",
                                  color: "primary.main",
                                }}
                              />
                            </Stack>
                          </Stack>
                        );
                      }}
                    >
                      <Box sx={{ p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                        <TextField
                          autoFocus
                          fullWidth
                          size="small"
                          placeholder="Search users"
                          value={assigneeSearch}
                          onChange={(event) => setAssigneeSearch(event.target.value)}
                          onFocus={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                          onMouseDown={(event) => event.stopPropagation()}
                          onKeyDown={(event) => {
                            if (["ArrowUp", "ArrowDown", "Enter", "Escape", "Home", "End"].includes(event.key)) {
                              event.stopPropagation();
                              return;
                            }

                            event.stopPropagation();
                          }}
                          onKeyUp={(event) => event.stopPropagation()}
                          InputProps={{
                            endAdornment: assigneeSearch ? (
                              <IconButton
                                size="small"
                                edge="end"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setAssigneeSearch("");
                                }}
                                sx={{ color: "text.secondary" }}
                              >
                                <Clear fontSize="small" />
                              </IconButton>
                            ) : null,
                          }}
                        />
                      </Box>

                      {filteredAssigneeUsers.length === 0 ? (
                        <MenuItem
                          disabled
                          sx={{
                            justifyContent: "center",
                            color: "white",
                            opacity: 1,
                            py: 1.25,
                          }}
                        >
                          No users found
                        </MenuItem>
                      ) : (
                        filteredAssigneeUsers.map((userOption) => (
                          <MenuItem
                            key={userOption.id}
                            value={userOption.id}
                            sx={{
                              minHeight: 56,
                              px: 1,
                              py: 0.75,
                              mb: 0.5,
                              borderRadius: 1,
                              backgroundColor: "rgba(37, 99, 235, 0.04)",
                              "&:hover": {
                                backgroundColor: "rgba(37, 99, 235, 0.08)",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "rgba(37, 99, 235, 0.12)",
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: "100%" }}>
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  fontSize: "0.76rem",
                                  bgcolor: "#2563eb !important",
                                  color: "#fff !important",
                                }}
                              >
                                {userOption.firstName?.[0] ?? ""}
                                {userOption.lastName?.[0] ?? ""}
                              </Avatar>
                              <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    {userOption.firstName} {userOption.lastName}
                                  </Typography>
                                  <Chip
                                    label={getUserRoleLabel(userOption.role)}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.625rem",
                                      fontWeight: 700,
                                      borderRadius: 999,
                                      backgroundColor: "rgba(59, 130, 246, 0.12)",
                                      color: "primary.main",
                                    }}
                                  />
                                </Stack>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                                  {userOption.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </Box>
                </Stack>

                <Box sx={{ height: 200, maxHeight: 200, overflowY: "auto", p: 1.5, borderRadius: 1, border: "1px solid", borderColor: "divider", bgcolor: "rgba(148, 163, 184, 0.04)" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                    {request.description || "No description provided."}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          ) : activeTab === 1 ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(148, 163, 184, 0.04)",
              }}
            >
              {notesCount === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No notes for this request yet.
                </Typography>
              ) : (
                <List disablePadding>
                  {historyEntries.map((entry) => (
                    <ListItem key={entry.id} disableGutters sx={{ display: "block", py: 0.75 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2" fontWeight={600}>
                          Note
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {entry.action}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(148, 163, 184, 0.04)",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                History
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              {isHistoryLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Loading history...
                </Typography>
              ) : historyEntries.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No history for this request yet.
                </Typography>
              ) : (
                <List disablePadding>
                  {historyEntries.map((entry) => (
                    <ListItem
                      key={entry.id}
                      disableGutters
                      sx={{ display: "block", py: 0.75 }}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2" fontWeight={600}>
                          User #{entry.userId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {entry.action}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: activeTab === 0 ? "space-between" : "flex-end" }}>
        {activeTab === 0 ? (
          <>
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
            <Button
              variant="contained"
              onClick={saveChanges}
              disabled={updateRequest.isPending}
            >
              {updateRequest.isPending ? "Saving..." : "Save changes"}
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
