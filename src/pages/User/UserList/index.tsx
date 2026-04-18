import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersGetAll } from "../../../hooks";
import { Role, type UserResponseDto } from "../../../types/user";
import { styles } from "./styles";

export default function UsersList() {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const { data: users = [], isLoading } = useUsersGetAll();

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

  return (
    <Box component={Paper} elevation={1} sx={styles.root}>
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
                {roleOption[0]}
                {roleOption.toLowerCase().slice(1)}
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
              No users found.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {paginatedUsers.map((user) => (
              <ListItem key={user.id} disablePadding divider>
                <ListItemButton onClick={() => navigate(`/users/${user.id}`)}>
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatarUrl || undefined}
                      alt={`${user.firstName} ${user.lastName}`}
                    >
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    secondary={user.email}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
    </Box>
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
