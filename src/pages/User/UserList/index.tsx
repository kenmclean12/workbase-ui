import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useUsersFindAll, type User } from "../../../hooks";

export default function UsersList() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useUsersFindAll();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No users found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component={Paper} elevation={1} sx={{ p: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Users
      </Typography>
      <List disablePadding>
        {users.map((user: User) => (
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
    </Box>
  );
}
