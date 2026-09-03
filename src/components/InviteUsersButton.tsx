import { Add, Close, Email } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { IS_CLIENT_USER } from "../config/appMode";
import { useAuthContext } from "../context";
import { useUserInviteCreate, useUsersGetAll } from "../hooks";

const roles = [
  { value: 1, label: "Read Only" },
  { value: 2, label: "Standard" },
  { value: 3, label: "Admin" },
];

export function InviteUsersButton() {
  const { user } = useAuthContext();
  const { data: users = [] } = useUsersGetAll();
  const inviter = user ?? users[0] ?? null;
  const [open, setOpen] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [role, setRole] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const inviteUsers = useUserInviteCreate({ onSuccess: close });

  function close() {
    setOpen(false);
    setEmailText("");
    setRole(2);
    setSubmitted(false);
  }

  const emails = emailText
    .split(/\r?\n/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const validEmails = emails.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const hasInvalidEmail = emails.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const hasErrors = emails.length === 0 || hasInvalidEmail || !inviter?.id || (IS_CLIENT_USER && !user?.clientId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors || !inviter?.id) return;

    inviteUsers.mutate({
      emails: validEmails,
      role,
      ...(IS_CLIENT_USER && user?.clientId ? { clientId: user.clientId } : {}),
      invitedByUserId: inviter.id,
    });
  };

  return (
    <>
      <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setOpen(true)}>
        Invite Users
      </Button>
      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6, pb: 1, color: "text.primary", fontWeight: 700 }}>
          Invite Users
          <IconButton
            aria-label="Close"
            onClick={close}
            disabled={inviteUsers.isPending}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={submit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Email addresses
                  </Typography>
                  <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={6}
                  label="User emails"
                  placeholder={"name@company.com\nanother@company.com"}
                  value={emailText}
                  onChange={(event) => setEmailText(event.target.value)}
                  error={submitted && (emails.length === 0 || hasInvalidEmail)}
                  helperText={submitted && emails.length === 0 ? "Add at least one email address." : submitted && hasInvalidEmail ? "Check that every email address is valid." : "Enter one email address per line."}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Access role
                  </Typography>
                  <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                </Stack>
                <Select fullWidth size="small" value={role} onChange={(event) => setRole(Number(event.target.value))}>
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </Box>
              {IS_CLIENT_USER ? (
                <Typography variant="caption" color="text.secondary">
                  These invitations will be associated with your organization.
                </Typography>
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={close} disabled={inviteUsers.isPending}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                inviteUsers.isPending ||
                !inviter ||
                validEmails.length === 0 ||
                hasInvalidEmail
              }
            >
              {inviteUsers.isPending ? "Sending..." : "Send Invites"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}