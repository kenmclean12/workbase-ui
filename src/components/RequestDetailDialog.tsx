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
  FormControl,
  InputLabel,
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
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context";
import { useUsersGetAll } from "../hooks";
import { useRequestHistory, useRequestUpdate } from "../hooks/request";
import {
  REQUEST_PRIORITY_META,
  REQUEST_STATUS_META,
  RequestStatus,
  type RequestResponseDto,
} from "../types/request";

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
  const { data: history = [], isLoading: isHistoryLoading } = useRequestHistory(
    request?.id,
  );
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.UNASSIGNED);
  const [assignedToUserId, setAssignedToUserId] = useState<number | null>(null);
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
                  bgcolor: "transparent",
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              >
                {clientInitials}
              </Avatar>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
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
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
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
                {!isUnassigned && (
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    fullWidth
                  />
                )}

                {isUnassigned ? (
                  <Box sx={{ height: 200, maxHeight: 200, overflowY: 'auto', p: 1.5, borderRadius: 1, border: "1px solid", borderColor: "divider", bgcolor: "rgba(148, 163, 184, 0.04)" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                      {request.description || "No description provided."}
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    multiline
                    minRows={8}
                    maxRows={12}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 260,
                        maxHeight: 260,
                        overflowY: "auto",
                      },
                    }}
                  />
                )}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="request-assignee-label">Assigned to</InputLabel>
                    <Select
                      labelId="request-assignee-label"
                      value={assignedToUserId ?? ""}
                      label="Assigned to"
                      onChange={(event) => {
                        const nextValue = event.target.value as number | string | null;
                        setAssignedToUserId(
                          nextValue === "" || nextValue === null || nextValue === undefined
                            ? null
                            : Number(nextValue),
                        );
                      }}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {users.map((userOption) => (
                        <MenuItem key={userOption.id} value={userOption.id}>
                          {userOption.firstName} {userOption.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Stack>
          ) : activeTab === 1 ? (
            <Box sx={{ p: 1.5, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
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
            <Box>
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
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={saveChanges}
          disabled={updateRequest.isPending}
        >
          {updateRequest.isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
