import { BusinessOutlined, Close, LocationOnOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { useClientUpdate } from "../hooks";
import type { ClientResponseDto, ClientUpdateDto } from "../types/client";

type ClientFormValues = {
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
};

interface ClientDetailsDialogProps {
  client: ClientResponseDto;
  open: boolean;
  canEdit: boolean;
  onClose: () => void;
}

const getClientFormValues = (client: ClientResponseDto): ClientFormValues => ({
  name: client.name,
  email: client.email ?? "",
  phone: client.phone ?? "",
  website: client.website ?? "",
  description: client.description ?? "",
});

const clientField = (
  label: string,
  value: string,
  maxLength: number,
  canEdit: boolean,
  onChange: (value: string) => void,
  multiline = false,
) => (
  <TextField
    fullWidth
    size="small"
    label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={value ? undefined : "Not provided"}
    multiline={multiline}
    minRows={multiline ? 2 : undefined}
    inputProps={{ maxLength, readOnly: !canEdit }}
  />
);

const addressField = (label: string, value: string | undefined) => (
  <TextField
    fullWidth
    size="small"
    label={label}
    value={value ?? ""}
    placeholder={value ? undefined : "Not provided"}
    inputProps={{ readOnly: true }}
  />
);

export function ClientDetailsDialog({
  client,
  open,
  canEdit,
  onClose,
}: ClientDetailsDialogProps) {
  const originalValues = getClientFormValues(client);
  const [values, setValues] = useState(originalValues);
  const updateClient = useClientUpdate(client.id, { onSuccess: onClose });
  const updateValue = (field: keyof ClientFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };
  const hasChanges = (Object.keys(originalValues) as Array<keyof ClientFormValues>)
    .some((field) => values[field] !== originalValues[field]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const update: ClientUpdateDto = {};
    for (const field of Object.keys(originalValues) as Array<keyof ClientFormValues>) {
      if (values[field] !== originalValues[field]) update[field] = values[field];
    }

    if (Object.keys(update).length) updateClient.mutate(update);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6, pb: 1, color: "text.primary", fontWeight: 700 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 44, height: 44, bgcolor: "primary.main" }}>
            {client.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight={700}>
              Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {canEdit ? "Update client information" : client.name}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={submit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <BusinessOutlined fontSize="small" color="action" />
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  Client information
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {clientField("Company name", values.name, 30, canEdit, (value) => updateValue("name", value))}
                {clientField("Description", values.description, 300, canEdit, (value) => updateValue("description", value), true)}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  {clientField("Email", values.email, 50, canEdit, (value) => updateValue("email", value))}
                  {clientField("Phone", values.phone, 16, canEdit, (value) => updateValue("phone", value))}
                </Stack>
                {clientField("Website", values.website, 50, canEdit, (value) => updateValue("website", value))}
              </Stack>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <LocationOnOutlined fontSize="small" color="action" />
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  Address
                </Typography>
              </Stack>
              {canEdit ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                  Address editing is not supported yet.
                </Typography>
              ) : null}
              <Stack spacing={1.5}>
                {addressField("Street", client.address?.street)}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  {addressField("City", client.address?.city)}
                  {addressField("State / province", client.address?.state)}
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  {addressField("Country", client.address?.country)}
                  {addressField("Postal code", client.address?.postalCode)}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={updateClient.isPending}>
            Cancel
          </Button>
          <Tooltip
            title={canEdit ? "" : "Only admins and super admins can update clients."}
            disableHoverListener={canEdit}
          >
            <span>
              <Button
                type="submit"
                variant="contained"
                disabled={!canEdit || !hasChanges || updateClient.isPending}
              >
                {updateClient.isPending ? "Saving..." : "Save changes"}
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
