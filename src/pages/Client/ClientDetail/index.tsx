import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clients } from "../../../testData/client";

export function ClientDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const clientId = id ? Number(id) : undefined;

  const client = useMemo(
    () => clients.find((item) => item.id === clientId),
    [clientId],
  );

  if (!client) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No client found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mx: 0, textAlign: "left" }}>
      <Paper elevation={1} sx={{ p: 1.5, mb: 1, textAlign: "left" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            flexWrap: "nowrap",
            minWidth: 0,
          }}
        >
          <Tooltip title="Back to clients">
            <IconButton onClick={() => navigate("/clients")} size="small">
              <ArrowBack fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{ width: 56, height: 56, flexShrink: 0 }}
              alt={client.name}
            >
              {client.name?.[0]}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                textAlign: "left",
                gap: 0.25,
                minWidth: 0,
                flex: 1,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                noWrap
                color="text.primary"
                sx={{
                  fontWeight: 600,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {client.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                  width: "100%",
                  display: "block",
                }}
              >
                {client.email ??
                  client.phone ??
                  client.website ??
                  "No contact info"}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" size="small" disabled>
            Contacts (0)
          </Button>
          <Stack direction="row">
            <Button variant="outlined" size="small" disabled>
              Requests
            </Button>
            <Badge badgeContent={1} color="error" overlap="circular" />
          </Stack>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Box sx={{ minWidth: 240, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Client Information
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {client.email ?? "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {client.phone ?? "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Website:</strong> {client.website ?? "—"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 240, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Address
            </Typography>
            {client.address ? (
              <Box>
                <Typography variant="body2">{client.address.city}</Typography>
                <Typography variant="body2">
                  {client.address.state}, {client.address.country}
                </Typography>
                <Typography variant="body2">
                  {client.address.postalCode}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2">No address available.</Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Active Requests (0)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No active requests at the moment.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Active Jobs (0)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No active jobs at the moment.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}
