import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { testUser } from "../../../testData";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = testUser;

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/users")}
        sx={{ mb: 2 }}
      >
        Back to Users
      </Button>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user.avatarUrl || undefined}
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h2">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Chip label={`Role: ${user.role}`} size="small" sx={{ mt: 1 }} />
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              ID
            </Typography>
            <Typography variant="body1">{user.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Avatar URL
            </Typography>
            <Typography variant="body1">{user.avatarUrl || "None"}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Assigned Jobs
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
                    No assigned jobs at the moment.
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
