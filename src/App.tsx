import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import MainPage from "./pages/MainPage";
import SectionPage from "./pages/SectionPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/users"
            element={
              <SectionPage
                title="Users"
                description="Users content will go here."
              />
            }
          />
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
              <SectionPage title="Not Found" description="Route not found." />
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
