import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsersGetAll, useUsersGetByClient } from "../../../hooks";
import { Role, getUserRoleLabel, type UserResponseDto } from "../../../types/user";
import { styles } from "./styles";

export function UsersList({
  clientId: clientIdProp,
  onClose,
}: {
  clientId?: number;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const routeClientId = id ? Number(id) : undefined;
  const clientId = clientIdProp ?? routeClientId;
  const listRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [page, setPage] = useState<number>(1);

  const { data: allUsers = [], isLoading: isAllUsersLoading } = useUsersGetAll({
    enabled: !clientId,
  });
  const { data: clientUsers = [], isLoading: isClientUsersLoading } = useUsersGetByClient(clientId, {
    enabled: !!clientId,
  });

  const users = clientId ? clientUsers : allUsers;
  const isLoading = clientId ? isClientUsersLoading : isAllUsersLoading;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatches =
        roleFilter === "All" ? true : user.role === roleFilter;
      return roleMatches && matchesSearch(user, search);
    });
  }, [search, roleFilter, users]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const paperSx = {
    ...styles.root,
    height: "100%",
    borderRadius: onClose ? 0 : 0,
  } as const;

  return (
    <Paper elevation={1} sx={paperSx}>
      {onClose ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {clientId ? "Client Users" : "Users"}
          </Typography>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Stack>
      ) : null}
      <Stack direction="row" spacing={2} sx={styles.filters}>
        <TextField
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          label="Search users"
          placeholder="Search by name or email"
          size="small"
          sx={styles.searchField}
        />
        <FormControl sx={styles.roleSelect} size="small">
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            label="Role"
            onChange={(event) => {
              setRoleFilter(event.target.value as "All" | Role);
              setPage(1);
            }}
          >
            {roleOptions.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption === "All" ? "All" : roleOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={styles.rowsSelect} size="small">
          <InputLabel id="rows-per-page-label">Rows</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            label="Rows"
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
          >
            {rowsPerPageOptions.map((rows) => (
              <MenuItem key={rows} value={rows}>
                {rows}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Divider sx={styles.divider} />
      <Box ref={listRef} sx={styles.listContainer}>
        {isLoading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={styles.emptyContainer}>
            <Typography variant="body1" color="text.secondary">
              {clientId ? "No users found for this client." : "No users found."}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {paginatedUsers.map((user) => (
              <Card
                key={user.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: "divider",
                  background: "rgba(148, 163, 184, 0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: 1,
                    borderColor: "primary.light",
                    background: "rgba(59, 130, 246, 0.02)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                      <Avatar
                        src={user.avatarUrl || undefined}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{
                          width: 52,
                          height: 52,
                          fontSize: "1rem",
                          fontWeight: 700,
                          bgcolor: "#2563eb",
                          color: "#fff",
                          border: "1px solid rgba(37, 99, 235, 0.25)",
                        }}
                      >
                        {user.firstName?.[0] ?? ""}
                        {user.lastName?.[0] ?? ""}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              lineHeight: 1.2,
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/users/${user.id}`)}
                          >
                            {`${user.firstName} ${user.lastName}`}
                          </Typography>
                          <Chip
                            label={getUserRoleLabel(user.role)}
                            size="small"
                            sx={{
                              height: 22,
                              fontWeight: 600,
                              backgroundColor: "rgba(59, 130, 246, 0.12)",
                              color: "primary.main",
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
                          <Typography variant="body2" color="text.secondary">Email:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user.email}
                          </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.secondary">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
      {!isLoading && filteredUsers.length > 0 && (
        <Box sx={styles.footer}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </Typography>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
          />
        </Box>
      )}
    </Paper>
  );
}

const rowsPerPageOptions = [25, 50, 100] as const;
const roleOptions: Array<Role | "All"> = [
  "All",
  Role.SUPERADMIN,
  Role.ADMIN,
  Role.STANDARD,
  Role.READONLY,
];

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");

const matchesSearch = (user: UserResponseDto, query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  const nameValue = normalize(`${user.firstName}${user.lastName}`);
  if (nameValue.includes(normalizedQuery)) return true;

  return user.email.toLowerCase().includes(normalizedQuery);
};
