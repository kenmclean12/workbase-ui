import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import AppLayout from "./layout/AppLayout";
import MainPage from "./pages/MainPage";
import SectionPage from "./pages/SectionPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./packages/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UsersList from "./pages/User/UserList";
import UserDetail from "./pages/User/UserDetail";

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
                      <Route
                        path="/clients"
                        element={
                          <SectionPage
                            title="Clients"
                            description="Clients content will go here."
                          />
                        }
                      />
                      <Route
                        path="/jobs"
                        element={
                          <SectionPage
                            title="Jobs"
                            description="Jobs content will go here."
                          />
                        }
                      />
                      <Route
                        path="/stats"
                        element={
                          <SectionPage
                            title="Stats"
                            description="Stats content will go here."
                          />
                        }
                      />
                      <Route
                        path="*"
                        element={
                          <SectionPage
                            title="Not Found"
                            description="Route not found."
                          />
                        }
                      />
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
