import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import EventPage from "./pages/EventPage.jsx";
import ControlPanel from "./pages/ControlPanel.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Layout from "./components/common/Layout.jsx";

const routesConfig = [
  { path: "/", element: <LoginPage /> },
  { path: "/sig", element: <SignupPage /> },
  { path: "/for", element: <ForgotPassPage /> },
  { path: "/cal", element: <CalendarPage /> },
  { path: "/eve", element: <EventPage /> },
  { path: "/usr", element: <ControlPanel /> },
  { path: "*", element: <NotFoundPage /> },
];

function App() {
  return (
    <Router>
      <Routes>
        {routesConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<Layout>{route.element}</Layout>}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
