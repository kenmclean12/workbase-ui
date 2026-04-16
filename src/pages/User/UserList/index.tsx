import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { testUsers, type User, type Role } from "../../../testData";

const rowsPerPageOptions = [25, 50, 100] as const;
const roleOptions: Array<Role | "All"> = [
  "All",
  "SUPERADMIN",
  "ADMIN",
  "STANDARD",
  "READONLY",
];

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");

const matchesSearch = (user: User, query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return true;
  }

  const nameValue = normalize(`${user.firstName}${user.lastName}`);
  if (nameValue.includes(normalizedQuery)) {
    return true;
  }

  return user.email.toLowerCase().includes(normalizedQuery);
};

export default function UsersList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [page, setPage] = useState<number>(1);

  const filteredUsers = useMemo(() => {
    return testUsers.filter((user) => {
      const roleMatches =
        roleFilter === "All" ? true : user.role === roleFilter;
      return roleMatches && matchesSearch(user, search);
    });
  }, [search, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRoleFilter(event.target.value as "All" | Role);
    setPage(1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box
      component={Paper}
      elevation={1}
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={search}
          onChange={handleSearchChange}
          label="Search users"
          placeholder="Search by name or email"
          variant="outlined"
          size="small"
          sx={{ minWidth: 100 }}
        />
        <FormControl sx={{ minWidth: 60, width: 190 }} size="small">
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            label="Role"
            onChange={handleRoleChange}
          >
            {roleOptions.map((roleOption: Role | "All") => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption[0]}
                {roleOption.toLowerCase().slice(1, roleOption.length)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 80, width: 160 }} size="small">
          <InputLabel id="rows-per-page-label">Rows</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            label="Rows"
            onChange={handleRowsPerPageChange}
          >
            {rowsPerPageOptions.map((rows) => (
              <MenuItem key={rows} value={rows}>
                {rows}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <List disablePadding>
          {paginatedUsers.map((user: User) => (
            <ListItem key={user.id} disablePadding divider>
              <ListItemButton
                onClick={() => {
                  setSelectedUserId(user.id);
                  navigate(`/users/${user.id}`);
                }}
              >
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
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </Typography>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          siblingCount={0}
          boundaryCount={1}
        />
      </Box>
    </Box>
  );
}
