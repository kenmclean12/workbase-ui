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
} from "@mui/material";
import { testUsers, type User } from "../../../testData";

export default function UsersList() {
  const navigate = useNavigate();

  return (
    <Box component={Paper} elevation={1} sx={{ p: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Users
      </Typography>
      <List disablePadding>
        {testUsers.map((user: User) => (
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
