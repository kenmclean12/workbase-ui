import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import MainPage from './pages/MainPage';
import SectionPage from './pages/SectionPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProtectedRoute from './packages/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
                    <Route
                      path="/users"
                      element={
                        <SectionPage title="Users" description="Users content will go here." />
                      }
                    />
                    <Route
                      path="/clients"
                      element={
                        <SectionPage title="Clients" description="Clients content will go here." />
                      }
                    />
                    <Route
                      path="/jobs"
                      element={
                        <SectionPage title="Jobs" description="Jobs content will go here." />
                      }
                    />
                    <Route
                      path="/stats"
                      element={
                        <SectionPage title="Stats" description="Stats content will go here." />
                      }
                    />
                    <Route path="*" element={<SectionPage title="Not Found" description="Route not found." />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
