import { ArrowBack, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../context";
import { useUserGetById } from "../../../hooks";
import { styles } from "./styles";

export function UserDetail() {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [showRoleChip, setShowRoleChip] = useState(true);
  const resolvedId = location.pathname.includes("profile")
    ? Number(currentUser?.id)
    : Number(id);
  const { data: user, isLoading } = useUserGetById(resolvedId);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const computeVisibility = () => {
      setShowRoleChip(element.clientWidth > 450);
    };

    computeVisibility();
    const observer = new ResizeObserver(computeVisibility);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={styles.loadingContainer}>
        <Typography variant="body1" color="text.secondary">
          No user found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <Paper elevation={1} sx={styles.headerPaper}>
        <Box ref={headerRef} sx={styles.headerRow}>
          {!location.pathname.includes("profile") && (
            <Tooltip title="Back to users">
              <IconButton onClick={() => navigate("/users")} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={styles.headerContent}>
            <Avatar
              src={user.avatarUrl || undefined}
              alt={`${user.firstName} ${user.lastName}`}
              sx={styles.avatar}
            >
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </Avatar>
            <Box sx={styles.infoContainer}>
              <Stack sx={styles.nameRow}>
                <Typography
                  sx={styles.nameText}
                  color="text.primary"
                  variant="h6"
                  component="h2"
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    ...styles.roleChip,
                    display: showRoleChip ? "inline-flex" : "none",
                  }}
                />
              </Stack>
              <Typography sx={styles.emailText} variant="body2">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            disabled
            endIcon={<Visibility />}
            sx={styles.reportsButton}
          >
            Reports
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={styles.contentPaper}>
        <Typography variant="h6" component="h3" gutterBottom>
          Assigned Jobs (0)
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
                <TableCell colSpan={3} sx={styles.tableEmptyRow}>
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
