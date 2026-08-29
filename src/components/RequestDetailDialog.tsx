import {
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
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context";
import { useRequestHistory, useRequestUpdate } from "../hooks/request";
import {
  REQUEST_STATUS_META,
  RequestPriority,
  RequestStatus,
  type RequestResponseDto,
} from "../types/request";

const statusOptions = [
  RequestStatus.UNASSIGNED,
  RequestStatus.IN_PROGRESS,
  RequestStatus.DONE,
] as const;

const priorityOptions = [
  RequestPriority.LOW,
  RequestPriority.MEDIUM,
  RequestPriority.HIGH,
  RequestPriority.CRITICAL,
] as const;

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
  const { data: history = [], isLoading: isHistoryLoading } = useRequestHistory(
    request?.id,
  );
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.UNASSIGNED);
  const [priority, setPriority] = useState<RequestPriority>(RequestPriority.LOW);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const updateRequest = useRequestUpdate(request?.id, {
    onSuccess: () => onClose(),
  });

  useEffect(() => {
    if (!request) return;
    setStatus(request.status);
    setPriority(request.priority);
    setTitle(request.title);
    setDescription(request.description);
  }, [request]);

  const historyEntries = useMemo(
    () => [...history].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [history],
  );

  if (!request) return null;

  const saveChanges = () => {
    if (!user?.id) return;

    updateRequest.mutate({
      title,
      description,
      status,
      priority,
      assignedToUserId: request.assignedToUserId,
      actionUserId: user.id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h6">#{request.id} {request.title}</Typography>
          <Chip
            label={REQUEST_STATUS_META[request.status].label}
            size="small"
            sx={{
              backgroundColor: REQUEST_STATUS_META[request.status].color,
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              minRows={4}
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="request-status-label">Status</InputLabel>
                <Select
                  labelId="request-status-label"
                  value={status}
                  label="Status"
                  onChange={(event) => setStatus(event.target.value as RequestStatus)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {REQUEST_STATUS_META[option].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="request-priority-label">Priority</InputLabel>
                <Select
                  labelId="request-priority-label"
                  value={priority}
                  label="Priority"
                  onChange={(event) =>
                    setPriority(event.target.value as RequestPriority)
                  }
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

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
