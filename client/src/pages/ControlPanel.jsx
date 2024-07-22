import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ApprovedUsers from "../components/controlPanel/ApprovedUsers.jsx";
import PendingUsers from "../components/controlPanel/PendingUsers.jsx";
import ApprovedEvents from "../components/controlPanel/ApprovedEvents.jsx";
import PendingEvents from "../components/controlPanel/PendingEvents.jsx";
import DeclinedEvents from "../components/controlPanel/DeclinedEvents.jsx";
import SuperAccess from "../components/controlPanel/SuperAccess.jsx";

const ControlPanel = () => {
  const Id = Cookies.get("SESSION_ID");
  const sessionId = Id ? JSON.parse(Id) : null;

  const [currentView, setCurrentView] = useState("approvedUsers");

  const renderView = () => {
    switch (currentView) {
      case "superAccess":
        return (
          <SuperAccess setCurrentView={setCurrentView} sessionId={sessionId} />
        );
      case "declinedEvents":
        return <DeclinedEvents setCurrentView={setCurrentView} />;
      case "pendingEvents":
        return <PendingEvents setCurrentView={setCurrentView} />;
      case "approvedEvents":
        return <ApprovedEvents setCurrentView={setCurrentView} />;
      case "pendingUsers":
        return <PendingUsers setCurrentView={setCurrentView} />;
      case "approvedUsers":
      default:
        return (
          <ApprovedUsers
            setCurrentView={setCurrentView}
            sessionId={sessionId}
          />
        );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4">Control Panel</h1>
      <div className="flex flex-col space-y-1 md:flex-row md:space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            currentView === "approvedUsers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("approvedUsers")}
        >
          Approved Accounts
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "pendingUsers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("pendingUsers")}
        >
          Pending Accounts
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "superAccess"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("superAccess")}
        >
          Control Access
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "approvedEvents"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("approvedEvents")}
        >
          Approved Events
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "pendingEvents"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("pendingEvents")}
        >
          Pending Events
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "declinedEvents"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("declinedEvents")}
        >
          Declined Events
        </button>
      </div>
      <div className="mx-auto">{renderView()}</div>
    </div>
  );
};

export default ControlPanel;
