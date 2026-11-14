import { Close, EditOutlined } from "@mui/icons-material";
import {
  Avatar,
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
import { useUserUpdate } from "../hooks";
import { getUserRoleLabel, Role, type UserUpdateDto } from "../types/user";

type EditableUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  role?: string | number;
};

interface UserUpdateDialogProps {
  user: EditableUser;
  open: boolean;
  canChangeRole: boolean;
  onClose: () => void;
}

const editableRoles = [
  Role.SUPERADMIN,
  Role.ADMIN,
  Role.MANAGER,
  Role.STANDARD,
  Role.READONLY,
];

const numericRoleMap: Record<number, Role> = {
  1: Role.READONLY,
  2: Role.STANDARD,
  3: Role.ADMIN,
  4: Role.SUPERADMIN,
  5: Role.MANAGER,
};

const roleValueMap: Record<Role, number> = {
  [Role.READONLY]: 1,
  [Role.STANDARD]: 2,
  [Role.ADMIN]: 3,
  [Role.SUPERADMIN]: 4,
  [Role.MANAGER]: 5,
};

const getEditableRole = (role?: string | number): Role => {
  if (typeof role === "number") return numericRoleMap[role] ?? Role.STANDARD;
  return editableRoles.find((option) => option === role?.toUpperCase()) ?? Role.STANDARD;
};

export function UserUpdateDialog({
  user,
  open,
  canChangeRole,
  onClose,
}: UserUpdateDialogProps) {
  const updateUser = useUserUpdate(user.id);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [role, setRole] = useState(getEditableRole(user.role));

  const handleClose = () => {
    if (!updateUser.isPending) onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const update: UserUpdateDto = {};
    if (firstName !== user.firstName) update.firstName = firstName;
    if (lastName !== user.lastName) update.lastName = lastName;
    if (canChangeRole && role !== getEditableRole(user.role)) {
      update.role = roleValueMap[role];
    }

    if (!Object.keys(update).length) return;
    updateUser.mutate(update, { onSuccess: onClose });
  };

  const hasChanges =
    firstName !== user.firstName ||
    lastName !== user.lastName ||
    (canChangeRole && role !== getEditableRole(user.role));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6, pb: 1, color: "text.primary", fontWeight: 700 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={user.avatarUrl || undefined}
            sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
          >
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight={700}>
              Edit user
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update profile details for {user.firstName} {user.lastName}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="Close"
          onClick={handleClose}
          disabled={updateUser.isPending}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <EditOutlined fontSize="small" color="action" />
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  Basic information
                </Typography>
                <Chip
                  label="Profile"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.68rem" }}
                />
              </Stack>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField
                    fullWidth
                    label="First name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    inputProps={{ maxLength: 25 }}
                  />
                  <TextField
                    fullWidth
                    label="Last name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    inputProps={{ maxLength: 25 }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Email address"
                  value={user.email}
                  disabled
                  helperText="This email is linked to the account and cannot be changed here."
                />
              </Stack>
            </Box>
            {canChangeRole ? (
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ display: "block", mb: 1 }}
                >
                  Access role
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="user-edit-role-label">Role</InputLabel>
                  <Select
                    labelId="user-edit-role-label"
                    label="Role"
                    value={role}
                    onChange={(event) => setRole(event.target.value as Role)}
                  >
                    {editableRoles.map((option) => (
                      <MenuItem key={option} value={option}>
                        {getUserRoleLabel(option)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={updateUser.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateUser.isPending || !hasChanges}
          >
            {updateUser.isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
