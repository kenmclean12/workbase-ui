import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import AppLayout from "./layout/AppLayout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./packages/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UsersList from "./pages/User/UserList";
import UserDetail from "./pages/User/UserDetail";
import ClientList from "./pages/Client/ClientList";
import ClientDetail from "./pages/Client/ClientDetail";

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
