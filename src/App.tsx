import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider, useThemeContext } from "./context";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./layout";
import ProtectedRoute from "./packages/ProtectedRoute";
import {
  ClientDetail,
  ClientList,
  LoginPage,
  RegisterPage,
  RequestsPage,
  UserDetail,
  UsersList,
} from "./pages";

const queryClient = new QueryClient();

function ThemedApp() {
  const { theme } = useThemeContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/profile" replace />} />
                      <Route path="/users" element={<UsersList />} />
                      <Route path="/company" element={<ClientDetail />} />
                      <Route path="/clients/:id/users" element={<UsersList />} />
                      <Route path="/users/:id" element={<UserDetail />} />
                      <Route path="/profile" element={<UserDetail />} />
                      <Route path="/requests" element={<RequestsPage />} />
                      <Route path="/clients" element={<ClientList />} />
                      <Route path="/clients/:id" element={<ClientDetail />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
