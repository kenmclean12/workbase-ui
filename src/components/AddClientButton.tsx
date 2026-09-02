import { Add, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { useClientCreate } from "../hooks";

type FormValues = {
  name: string;
  initUserEmail: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

const initialValues: FormValues = {
  name: "",
  initUserEmail: "",
  email: "",
  phone: "",
  website: "",
  description: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export function AddClientButton() {
  const [open, setOpen] = useState(false);
  const [includeAddress, setIncludeAddress] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    setOpen(false);
    setIncludeAddress(false);
    setValues(initialValues);
    setSubmitted(false);
  };

  const createClient = useClientCreate({ onSuccess: close });

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const requiredFields: Array<keyof FormValues> = includeAddress
    ? ["name", "initUserEmail", "street", "city", "state", "country", "postalCode"]
    : ["name", "initUserEmail"];
  const hasErrors = requiredFields.some((field) => !values[field].trim());

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;

    createClient.mutate(
      {
        name: values.name.trim(),
        initUserEmail: values.initUserEmail.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        website: values.website.trim() || undefined,
        description: values.description.trim() || undefined,
        ...(includeAddress
          ? {
              addressDTO: {
                street: values.street.trim(),
                city: values.city.trim(),
                state: values.state.trim(),
                country: values.country.trim(),
                postalCode: values.postalCode.trim(),
              },
            }
          : {}),
      },
    );
  };

  const field = (name: keyof FormValues, label: string, required = false, multiline = false) => (
    <TextField
      fullWidth
      label={label}
      value={values[name]}
      onChange={(event) => updateValue(name, event.target.value)}
      required={required}
      error={submitted && required && !values[name].trim()}
      helperText={submitted && required && !values[name].trim() ? "Required" : undefined}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
    />
  );

  return (
    <>
      <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setOpen(true)}>
        Add Client
      </Button>
      <Dialog open={open} onClose={close} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 6, pb: 1, color: "text.primary", fontWeight: 700 }}>
          Add Client
          <IconButton aria-label="Close" onClick={close} disabled={createClient.isPending} sx={{ position: "absolute", right: 12, top: 12 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={submit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Organization
                </Typography>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {field("name", "Company Name", true)}
                  <Typography variant="caption" color="text.secondary" sx={{ mb: -1 }}>
                    The initial user email is used to create the first user account for this client, and send a user invite.
                  </Typography>
                  {field("initUserEmail", "Initial User Email", true)}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Description
                    </Typography>
                    <Chip label="Optional" size="small" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                  </Stack>
                  {field("description", "Description", false, true)}
                </Stack>
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Contact details
                  </Typography>
                  <Chip label="Optional" size="small" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                </Stack>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {field("email", "Company Email")}
                  {field("phone", "Phone")}
                  {field("website", "Website")}
                </Stack>
              </Box>
              <Box>
                <FormControlLabel
                  control={<Checkbox checked={includeAddress} onChange={(event) => setIncludeAddress(event.target.checked)} />}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={600}>Add an address</Typography>
                      <Chip label="Optional" size="small" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                    </Stack>
                  }
                />
                {includeAddress ? (
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Every address field is required when an address is added.
                    </Typography>
                    {field("street", "Street", true)}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      {field("city", "City", true)}
                      {field("state", "State", true)}
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      {field("country", "Country", true)}
                      {field("postalCode", "Postal Code", true)}
                    </Stack>
                  </Stack>
                ) : null}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={close} disabled={createClient.isPending}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createClient.isPending}>
              {createClient.isPending ? "Creating..." : "Create Client"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
