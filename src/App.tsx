import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider, useThemeContext } from "./context";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./packages/ProtectedRoute";
import { LoginPage } from "./pages";
import ClientDetail from "./pages/Client/ClientDetail";
import ClientList from "./pages/Client/ClientList";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import UserDetail from "./pages/User/UserDetail";
import UsersList from "./pages/User/UserList";

const queryClient = new QueryClient();

function ThemedApp() {
  const { theme } = useThemeContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
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
                      <Route path="/" element={<MainPage />} />
                      <Route path="/users" element={<UsersList />} />
                      <Route path="/users/:id" element={<UserDetail />} />
                      <Route path="/profile" element={<UserDetail />} />
                      <Route path="/requests" element={<></>} />
                      <Route path="/clients" element={<ClientList />} />
                      <Route path="/clients/:id" element={<ClientDetail />} />
                      <Route path="/jobs" element={<></>} />
                      <Route path="/stats" element={<></>} />
                      <Route path="*" element={<></>} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
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
