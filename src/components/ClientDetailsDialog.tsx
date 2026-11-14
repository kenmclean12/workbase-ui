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
  Typography,
} from "@mui/material";
import type { ClientResponseDto } from "../types/client";

interface ClientDetailsDialogProps {
  client: ClientResponseDto;
  open: boolean;
  onClose: () => void;
}

const readOnlyField = (
  label: string,
  value: string | null | undefined,
  multiline = false,
) => (
  <TextField
    fullWidth
    size="small"
    label={label}
    value={value?.trim() || "Not provided"}
    multiline={multiline}
    minRows={multiline ? 2 : undefined}
    inputProps={{ readOnly: true }}
  />
);

export function ClientDetailsDialog({
  client,
  open,
  onClose,
}: ClientDetailsDialogProps) {
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
              {client.name}
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
              {readOnlyField("Company name", client.name)}
              {readOnlyField("Description", client.description, true)}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                {readOnlyField("Email", client.email)}
                {readOnlyField("Phone", client.phone)}
              </Stack>
              {readOnlyField("Website", client.website)}
            </Stack>
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <LocationOnOutlined fontSize="small" color="action" />
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Address
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              {readOnlyField("Street", client.address?.street)}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                {readOnlyField("City", client.address?.city)}
                {readOnlyField("State / province", client.address?.state)}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                {readOnlyField("Country", client.address?.country)}
                {readOnlyField("Postal code", client.address?.postalCode)}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
