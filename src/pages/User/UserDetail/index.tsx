import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
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
import { testUser, testUsers, type User } from "../../../testData";

export default function UserDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const resolvedUser: User = useMemo(() => {
    if (id) {
      const found = testUsers.find((item) => item.id === Number(id));
      return found ?? testUser;
    }

    return testUser;
  }, [id]);

  const user = resolvedUser;
  const [showRoleChip, setShowRoleChip] = useState(true);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const computeVisibility = () => {
      setShowRoleChip(element.clientWidth > 420);
    };

    computeVisibility();
    const observer = new ResizeObserver(() => computeVisibility());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ width: "100%", mx: 0 }}>
      <Paper elevation={1} sx={{ p: 1.5, mb: 0.75 }}>
        <Box
          ref={headerRef}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Back to users">
            <IconButton onClick={() => navigate("/users")} size="small">
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
              minHeight: 0,
            }}
          >
            <Avatar
              src={user.avatarUrl || undefined}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 56, height: 56 }}
            >
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 0.25,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  flexWrap: "nowrap",
                  minWidth: 0,
                  flexShrink: 1,
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    flexShrink: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    display: showRoleChip ? "inline-flex" : "none",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                  flexShrink: 1,
                  maxWidth: "100%",
                  whiteSpace: "normal",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            size="small"
            disabled
            startIcon={<Visibility />}
            sx={{ flexShrink: 0 }}
          >
            Reports
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, mt: 0 }}>
        <Typography variant="h6" component="h3" gutterBottom>
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
