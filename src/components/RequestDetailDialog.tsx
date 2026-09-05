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
  Popover,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  Clear,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useAuthContext } from "../context";
import { useAssignableUsersGetAll, useUsersGetAll } from "../hooks";
import {
  useRequestHistory,
  useRequestNoteCreate,
  useRequestNoteDelete,
  useRequestNoteUpdate,
  useRequestNotesGetByRequest,
  useRequestUpdate,
} from "../hooks/request";
import {
  REQUEST_PRIORITY_META,
  REQUEST_STATUS_META,
  RequestStatus,
  type RequestNoteResponseDto,
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
  const { data: notes = [], isLoading: isNotesLoading } = useRequestNotesGetByRequest(
    request?.id,
  );
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.UNASSIGNED);
  const [assignedToUserId, setAssignedToUserId] = useState<number | null>(null);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [noteAnchorEl, setNoteAnchorEl] = useState<HTMLElement | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const updateRequest = useRequestUpdate(request?.id);
  const createNote = useRequestNoteCreate();
  const updateNote = useRequestNoteUpdate();
  const deleteNote = useRequestNoteDelete();

  useEffect(() => {
    if (!request) return;
    setStatus(request.status);
    setAssignedToUserId(request.assignedToUserId ?? null);
  }, [request]);

  const historyEntries = useMemo(() => {
    const safeHistory = Array.isArray(history) ? history : [];

    return safeHistory
      .filter((entry): entry is typeof entry => !!entry)
      .sort((a, b) => {
        const aTime = new Date(a.createdAt ?? 0).getTime();
        const bTime = new Date(b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
  }, [history]);

  const shouldShowStatusSelect = status === RequestStatus.IN_PROGRESS;
  const statusOptions = shouldShowStatusSelect
    ? [RequestStatus.IN_PROGRESS, RequestStatus.DONE]
    : [];

  const handleStatusChange = (nextStatus: RequestStatus) => {
    if (!request) return;
    if (nextStatus === status) return;

    if (
      nextStatus === RequestStatus.DONE &&
      !window.confirm(
        "Are you sure you want to move this request to Done? This cannot be reversed, and the client will be notified that this task has been completed.",
      )
    ) {
      return;
    }

    setStatus(nextStatus);

    const actingUserId = user?.id ?? users[0]?.id ?? request.createdByUserId;
    if (!actingUserId) return;

    const payload = {
      status: nextStatus,
      actionUserId: actingUserId,
    } as {
      status: RequestStatus;
      actionUserId: number;
      assignedToUserId?: number | null;
    };

    if (request.assignedToUserId !== null && nextStatus !== RequestStatus.DONE) {
      payload.assignedToUserId = request.assignedToUserId;
    }

    updateRequest.mutate(payload);
  };

  const closeNoteEditor = () => {
    setIsNoteEditorOpen(false);
    setNoteAnchorEl(null);
    setEditingNoteId(null);
    setNoteDraft("");
  };

  const handleClose = () => {
    setActiveTab(0);
    closeNoteEditor();
    onClose();
  };

  const openNoteEditor = (
    event: MouseEvent<HTMLElement> | null,
    existingNote?: RequestNoteResponseDto | null,
  ) => {
    if (existingNote) {
      setEditingNoteId(existingNote.id);
      setNoteDraft(existingNote.content ?? "");
    } else {
      setEditingNoteId(null);
      setNoteDraft("");
    }

    setNoteAnchorEl(event?.currentTarget ?? null);
    setIsNoteEditorOpen(true);
  };

  const originalNoteText = useMemo(() => {
    if (editingNoteId === null) return "";

    const currentNote = notes.find((note) => note.id === editingNoteId);
    return currentNote?.content ?? "";
  }, [editingNoteId, notes]);

  const isNoteSaveDisabled =
    !noteDraft.trim() ||
    (editingNoteId !== null && noteDraft.trim() === originalNoteText.trim());

  const saveNote = () => {
    const content = noteDraft.trim();
    if (!request || !content) return;

    if (editingNoteId !== null) {
      updateNote.mutate({ id: editingNoteId, content });
      closeNoteEditor();
      return;
    }

    const actingUserId = user?.id ?? request.createdByUserId;
    if (!actingUserId) {
      return;
    }

    createNote.mutate({
      requestId: request.id,
      createdByUserId: actingUserId,
      content,
    });

    closeNoteEditor();
  };

  const deleteNoteEntry = (noteId: number) => {
    deleteNote.mutate(noteId);
  };

  if (!request) return null;

  const notesCount = notes.length;
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: (theme) => ({
          height: "64vh",
          maxHeight: "64vh",
          minHeight: "64vh",
          width: "min(1020px, 84vw)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.24)"
              : "rgba(148, 163, 184, 0.28)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 18px 45px rgba(15, 23, 42, 0.55)"
              : "0 18px 45px rgba(15, 23, 42, 0.12)",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(15, 23, 42, 0.97) 0%, rgba(15, 23, 42, 0.92) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
        }),
      }}
    >
      <DialogTitle sx={(theme) => ({
        borderBottom: "1px solid",
        borderColor: theme.palette.divider,
        pb: 1.75,
      })}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(148, 163, 184, 0.06)",
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
                py: 0.8,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(148, 163, 184, 0.04)",
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
                backgroundColor: "rgba(148, 163, 184, 0.04)",
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
              label={REQUEST_STATUS_META[status].label}
              size="small"
              sx={{
                border: `1px solid ${REQUEST_STATUS_META[status].color}`,
                color: REQUEST_STATUS_META[status].color,
                fontWeight: 700,
                backgroundColor: "rgba(148, 163, 184, 0.04)",
                px: 1,
              }}
            />
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          overflow: "hidden",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="request details tabs"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              minHeight: 44,
              ".MuiTabs-indicator": {
                height: 3,
                borderRadius: "999px 999px 0 0",
              },
            }}
          >
            <Tab label="Details" sx={{ minHeight: 44, textTransform: "none", fontWeight: 600 }} />
            <Tab label="History" sx={{ minHeight: 44, textTransform: "none", fontWeight: 600 }} />
            <Tab label={`Notes (${notesCount})`} sx={{ minHeight: 44, textTransform: "none", fontWeight: 600 }} />
          </Tabs>

          {activeTab === 0 ? (
            <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
              <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Box
                    sx={(theme) => ({
                      flex: 1,
                      p: 1.5,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(96, 165, 250, 0.28)"
                          : "rgba(147, 197, 253, 0.7)",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(15, 23, 42, 0.18)"
                          : "rgba(248, 250, 252, 0.96)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "none"
                          : "0 4px 14px rgba(59, 130, 246, 0.08)",
                    })}
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
                      p: 1.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(96, 165, 250, 0.38)"
                          : "rgba(96, 165, 250, 0.35)",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(180deg, rgba(30, 58, 138, 0.38) 0%, rgba(15, 23, 42, 0.22) 100%)"
                          : "linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(224, 242, 254, 0.86) 100%)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "none"
                          : "0 10px 26px rgba(59, 130, 246, 0.08)",
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
                        const nextAssignedToUserId =
                          nextValue === "" || nextValue === null || nextValue === undefined
                            ? null
                            : Number(nextValue);

                        const actingUserId = user?.id ?? users[0]?.id;
                        if (!actingUserId) return;

                        const nextStatus =
                          nextAssignedToUserId !== null ? RequestStatus.IN_PROGRESS : status;

                        setAssignedToUserId(nextAssignedToUserId);
                        setStatus(nextStatus);
                        setAssigneeSearch("");

                        updateRequest.mutate({
                          status: nextStatus,
                          assignedToUserId: nextAssignedToUserId,
                          actionUserId: actingUserId,
                        });
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

                  {shouldShowStatusSelect ? (
                    <Box
                      sx={(theme) => ({
                        flex: 1,
                        p: 1.75,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "rgba(96, 165, 250, 0.25)"
                            : "rgba(148, 163, 184, 0.38)",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(15, 23, 42, 0.2)"
                            : "rgba(255, 255, 255, 0.9)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "none"
                            : "0 8px 24px rgba(15, 23, 42, 0.04)",
                      })}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                        Status
                      </Typography>

                      <Select
                        fullWidth
                        size="small"
                        value={status}
                        onChange={(event) => handleStatusChange(Number(event.target.value) as RequestStatus)}
                        sx={{
                          borderRadius: 1.5,
                          backgroundColor: "rgba(15, 23, 42, 0.02)",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "divider",
                          },
                        }}
                      >
                        {statusOptions.map((statusOption) => (
                          <MenuItem key={statusOption} value={statusOption}>
                            {REQUEST_STATUS_META[statusOption].label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  ) : null}
                </Stack>

                <Box
                  sx={(theme) => ({
                    flex: 1,
                    minHeight: 220,
                    maxHeight: "100%",
                    overflowY: "auto",
                    p: 1.75,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(96, 165, 250, 0.25)"
                        : "rgba(148, 163, 184, 0.32)",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(15, 23, 42, 0.2)"
                        : "rgba(255, 255, 255, 0.9)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "none"
                        : "0 10px 24px rgba(15, 23, 42, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                  })}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "pre-wrap",
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
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
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                History
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              {isHistoryLoading ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                  Loading history...
                </Typography>
              ) : historyEntries.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                  No history for this request yet.
                </Typography>
              ) : (
                <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {historyEntries.map((entry) => (
                    <ListItem
                      key={entry.id}
                      disableGutters
                      sx={{
                        display: "block",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(15, 23, 42, 0.02)",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.72rem",
                              bgcolor: "#2563eb !important",
                              color: "#fff !important",
                            }}
                          >
                            {(entry.user?.firstName?.[0] ?? "U") + (entry.user?.lastName?.[0] ?? "")}
                          </Avatar>
                          <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                {entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : `User #${entry.userId}`}
                              </Typography>
                              {entry.user ? (
                                <Chip
                                  label={getUserRoleLabel(entry.user.role)}
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
                              ) : null}
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                              {entry.action}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      {entry.details ? (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                          {entry.details}
                        </Typography>
                      ) : null}
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
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Notes
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add fontSize="small" />}
                  onClick={(event) => openNoteEditor(event)}
                  sx={{
                    minWidth: 0,
                    minHeight: 28,
                    px: 1,
                    py: 0.25,
                    ".MuiButton-startIcon": { mr: 0.5 },
                  }}
                >
                  Add
                </Button>
              </Stack>
              <Divider sx={{ mb: 1.5 }} />

              <Popover
                open={isNoteEditorOpen}
                anchorEl={noteAnchorEl}
                onClose={closeNoteEditor}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      p: 1.5,
                      width: 500,
                      maxWidth: "90vw",
                      borderRadius: 2,
                    },
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={8}
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    placeholder="Write a note..."
                  />
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="text" onClick={closeNoteEditor}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      disabled={isNoteSaveDisabled}
                      onClick={saveNote}
                    >
                      {editingNoteId !== null ? "Save" : "Add"}
                    </Button>
                  </Stack>
                </Box>
              </Popover>

              {isNotesLoading ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                  Loading notes...
                </Typography>
              ) : notesCount === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                  No notes for this request yet.
                </Typography>
              ) : (
                <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {notes.map((note) => {
                    const noteAuthor =
                      users.find((userOption) => userOption.id === note.createdByUserId) ??
                      note.createdByUser ??
                      null;

                    return (
                      <ListItem
                        key={note.id}
                        disableGutters
                        sx={{
                          display: "block",
                          px: 1.5,
                          py: 1.25,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "rgba(15, 23, 42, 0.02)",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: "0.72rem",
                                bgcolor: "#2563eb !important",
                                color: "#fff !important",
                              }}
                            >
                              {noteAuthor ? `${noteAuthor.firstName?.[0] ?? ""}${noteAuthor.lastName?.[0] ?? ""}` : "U"}
                            </Avatar>
                            <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                  {noteAuthor ? `${noteAuthor.firstName} ${noteAuthor.lastName}` : `User #${note.createdByUserId}`}
                                </Typography>
                                {noteAuthor ? (
                                  <Chip
                                    label={getUserRoleLabel(noteAuthor.role)}
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
                                ) : null}
                              </Stack>
                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                                {new Date(note.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconButton
                              size="small"
                              onClick={(event) => openNoteEditor(event, note)}
                              aria-label="edit note"
                              sx={{ color: "text.secondary" }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => deleteNoteEntry(note.id)}
                              aria-label="delete note"
                              sx={{ color: "error.main" }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>

                        <Typography variant="body2" color="text.primary" sx={{ mt: 1.5, whiteSpace: "pre-wrap" }}>
                          {note.content}
                        </Typography>
                        {note.updatedAt ? (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
                            Updated {new Date(note.updatedAt).toLocaleString()}
                          </Typography>
                        ) : null}
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleClose} variant="outlined" disabled={updateRequest.isPending}>
          {updateRequest.isPending ? "Updating..." : "Close"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
