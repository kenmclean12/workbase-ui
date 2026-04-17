import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { ArrowBack, Visibility } from "@mui/icons-material";
import { useUserGetById } from "../../../hooks/user";
import { useAuthContext } from "../../../context/AuthContext";

export default function UserDetail() {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedId = location.pathname.includes("profile")
    ? currentUser?.id
    : id;
  const userId = resolvedId ? Number(resolvedId) : undefined;
  const { data: user, isLoading } = useUserGetById(userId);
  const [showRoleChip, setShowRoleChip] = useState(true);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const computeVisibility = () => {
      setShowRoleChip(element.clientWidth > 450);
    };

    computeVisibility();
    const observer = new ResizeObserver(() => computeVisibility());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No user found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mx: 0, textAlign: "left" }}>
      <Paper elevation={1} sx={{ p: 1.5, mb: 0.75, textAlign: "left" }}>
        <Box
          ref={headerRef}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            flexWrap: "nowrap",
            minWidth: 0,
          }}
        >
          {!location.pathname.includes("profile") && (
            <Tooltip title="Back to users">
              <IconButton onClick={() => navigate("/users")} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
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
              src={user?.avatarUrl || undefined}
              alt={`${user?.firstName} ${user?.lastName}`}
              sx={{ width: 56, height: 56, flexShrink: 0 }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
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
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1,
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
                    width: "fit-content",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    display: showRoleChip ? "inline-flex" : "none",
                  }}
                />
              </Stack>
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
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            size="small"
            disabled
            endIcon={<Visibility />}
            sx={{ flexShrink: 0 }}
          >
            Reports
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, mt: 0 }}>
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
