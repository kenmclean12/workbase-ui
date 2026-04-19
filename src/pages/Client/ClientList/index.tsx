import type { SelectChangeEvent } from "@mui/material";
import {
  Avatar,
  Box,
  Button,
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
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { clients, type Client } from "../../../testData/client";

export function ClientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const openFilters = Boolean(filterAnchor);
  const handleFiltersOpen = (event: MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };
  const handleFiltersClose = () => setFilterAnchor(null);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => matchesSearch(client, search));
  }, [search]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredClients.length / rowsPerPage),
  );
  const paginatedClients = filteredClients.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
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
          label="Search clients"
          placeholder="Search by client name"
          variant="outlined"
          size="small"
          sx={{ minWidth: 100 }}
        />
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
        <Button
          variant="outlined"
          onClick={handleFiltersOpen}
          sx={{ minWidth: 120, height: 40 }}
        >
          Filters
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box ref={listRef} sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {filteredClients.length === 0 ? (
          <Box
            sx={{
              height: "80%",
              minHeight: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No clients found.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {paginatedClients.map((client) => (
              <ListItem key={client.id} disablePadding divider>
                <ListItemButton
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar src={undefined} alt={client.name}>
                      {client.name?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={client.name}
                    secondary={client.email ?? ""}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      {filteredClients.length > 0 && (
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
            Showing {paginatedClients.length} of {filteredClients.length}{" "}
            clients
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
      )}
      <Popover
        open={openFilters}
        anchorEl={filterAnchor}
        onClose={handleFiltersClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 220 }}>
          <Typography variant="subtitle1">Filters</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No filters available yet.
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
}

const rowsPerPageOptions = [25, 50, 100] as const;

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");

const matchesSearch = (client: Client, query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return true;
  }

  return normalize(client.name).includes(normalizedQuery);
};
