import React, { useState, useEffect } from "react";
import MonthlyView from "../components/calendar/MonthlyView.jsx";
import WeeklyView from "../components/calendar/WeeklyView.jsx";
import DailyView from "../components/calendar/DailyView.jsx";
import api from "../api.jsx";

const CalendarPage = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState("month");

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/event/retrieve?filter=approved`);
      setEvents(response.data.events);
      // events.forEach((event) => {
      //   if (
      //     event.approvedEventStatus === "Scheduled" &&
      //     isToday(event.eventDate)
      //   ) {
      //     handleMarkInProgress(event.eventId);
      //   }
      // });
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
    }
  };

  console.log(events);

  const handleMarkInProgress = async (eventId) => {
    try {
      const response = await api.put(`/event/inprogress/${eventId}`);
      if (response.status === 200) {
        console.log(`Event ${eventId} marked as In Progress!`);
        fetchEvents();
      }
    } catch (error) {
      console.error("Error marking event in progress:", error);
    }
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString.startsWith(today);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/find?filter=Approved`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "week":
        return (
          <WeeklyView
            setCurrentView={setCurrentView}
            users={users}
            eventsData={events}
          />
        );
      case "day":
        return (
          <DailyView
            setCurrentView={setCurrentView}
            eventsData={events}
            users={users}
          />
        );
      case "month":
      default:
        return (
          <MonthlyView
            setCurrentView={setCurrentView}
            users={users}
            eventsData={events}
          />
        );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4">Calendar</h1>
      <div className="mx-auto">{renderView()}</div>
    </div>
  );
};

export default CalendarPage;
