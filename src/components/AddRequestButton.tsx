import { Add, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { IS_CLIENT_USER } from "../config/appMode";
import { useAuthContext } from "../context";
import { useClientsGetAll, useRequestCreate, useUsersGetAll } from "../hooks";
import {
  REQUEST_PRIORITY_META,
  RequestPriority,
} from "../types/request";

const initialValues = {
  title: "",
  description: "",
  clientId: "",
  priority: String(RequestPriority.LOW),
};

export function AddRequestButton() {
  const { user } = useAuthContext();
  const isClientUser = IS_CLIENT_USER;
  const { data: clients = [], isLoading: isClientsLoading } = useClientsGetAll();
  const { data: users = [], isLoading: isUsersLoading } = useUsersGetAll();
  const creatingUser = user ?? users[0] ?? null;
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const createRequest = useRequestCreate({ onSuccess: close });

  function close() {
    setOpen(false);
    setValues(initialValues);
    setSubmitted(false);
  }

  const updateValue = (field: keyof typeof initialValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const clientId = isClientUser ? clients[0]?.id ?? 0 : Number(values.clientId);
  const requiredFields = ["title", "description"] as const;
  const hasErrors =
    requiredFields.some((field) => !values[field].trim()) ||
    !clientId ||
    (!isClientUser && !values.clientId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors || !creatingUser?.id || !clientId) return;

    createRequest.mutate({
      clientId,
      createdByUserId: creatingUser.id,
      title: values.title.trim(),
      description: values.description.trim(),
      priority: Number(values.priority) as RequestPriority,
    });
  };

  return (
    <>
      <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setOpen(true)}>
        Create
      </Button>
      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6, pb: 1, color: "text.primary", fontWeight: 700 }}>
          Create Request
          <IconButton
            aria-label="Close"
            onClick={close}
            disabled={createRequest.isPending}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={submit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              {!isClientUser ? (
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Client
                    </Typography>
                    <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                  </Stack>
                  <FormControl fullWidth size="small" error={submitted && !values.clientId}>
                    <InputLabel id="request-client-label">Client</InputLabel>
                    <Select
                      labelId="request-client-label"
                      label="Client"
                      value={values.clientId}
                      onChange={(event) => updateValue("clientId", event.target.value)}
                      disabled={isClientsLoading}
                    >
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : null}

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Request details
                </Typography>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={values.title}
                    onChange={(event) => updateValue("title", event.target.value)}
                    required
                    error={submitted && !values.title.trim()}
                    helperText={submitted && !values.title.trim() ? "Required" : undefined}
                    inputProps={{ maxLength: 100 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label="Description"
                    value={values.description}
                    onChange={(event) => updateValue("description", event.target.value)}
                    required
                    error={submitted && !values.description.trim()}
                    helperText={submitted && !values.description.trim() ? "Required" : undefined}
                    inputProps={{ maxLength: 1000 }}
                  />
                </Stack>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Request settings
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="request-priority-label">Priority</InputLabel>
                    <Select
                      labelId="request-priority-label"
                      label="Priority"
                      value={values.priority}
                      onChange={(event) => updateValue("priority", event.target.value)}
                    >
                      {Object.entries(REQUEST_PRIORITY_META).map(([value, meta]) => (
                        <MenuItem key={value} value={value}>
                          {meta.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={close} disabled={createRequest.isPending}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createRequest.isPending || isClientsLoading || isUsersLoading}
            >
              {createRequest.isPending ? "Creating..." : "Create Request"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
