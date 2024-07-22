import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import {
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
  MdOutlineEdit,
  MdOutlineDelete,
} from "react-icons/md";
import EventEditForm from "./EventEditForm";
import EventView from "./EventView";
import api from "../../api";

const EventList = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/event/retrieve?filter=approved`);
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const handleEdit = (event) => {
    console.log("Editing event:", event);

    setSelectedEvent(event);
    setIsEditFormOpen(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      console.log("Delete event with ID:", eventId);
      // Here you can implement the logic to delete the event from data source
    }
  };

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value);
    setCurrentDate(currentDate.month(newMonth));
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    setCurrentDate(currentDate.year(newYear));
  };

  // Filter events to display only those that are approved
  const filteredEventsData = events.filter((event) => event.isApproved);

  const eventsByYearMonthDay = filteredEventsData.reduce((acc, event) => {
    const date = dayjs(event.eventDate);
    const year = date.year();
    const month = date.month();
    const day = date.date();

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][month]) {
      acc[year][month] = {};
    }

    if (!acc[year][month][day]) {
      acc[year][month][day] = [];
    }

    acc[year][month][day].push(event);
    return acc;
  }, {});

  const daysInMonth = currentDate.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );
  const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i);

  const currentYear = currentDate.year();
  const currentMonth = currentDate.month();

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-2">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <button
            onClick={handlePrevMonth}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            <MdOutlineNavigateBefore />
          </button>
          <button
            onClick={handleNextMonth}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            <MdOutlineNavigateNext />
          </button>
          <button
            onClick={handleToday}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 h-10"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={handleYearChange}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 h-10"
          >
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        {days.map((day) => {
          const dateToShow = currentDate.date(day);
          const rowClassName = dateToShow.isBefore(dayjs(), "day")
            ? "text-gray-400"
            : "";

          const eventsForDay =
            eventsByYearMonthDay[currentYear]?.[currentMonth]?.[day] || [];

          return (
            <div key={day} className={`mb-4 ${rowClassName}`}>
              <div className="flex justify-between items-center mb-2">
                <div className={`font-bold ${rowClassName}`}>
                  {dateToShow.format("dddd")}
                </div>
                <div className={`${rowClassName}`}>
                  {dateToShow.format("MMMM D, YYYY")}
                </div>
              </div>
              <table className="min-w-full bg-white shadow-md rounded-lg">
                {eventsForDay.length > 0 && (
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-600 font-medium border-b w-1/3">
                        Time
                      </th>
                      <th className="py-3 px-4 text-left text-gray-600 font-medium border-b">
                        Event
                      </th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {eventsForDay.length > 0 ? (
                    eventsForDay.map((event) => (
                      <tr
                        key={event.eventId}
                        className="hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                        onClick={() => handleView(event)}
                      >
                        <td className="py-3 px-4 border-b w-1/3">
                          {formatTime(event.eventSchedStart)} to{" "}
                          {formatTime(event.eventSchedEnd)}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {event.eventName}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="py-3 px-4 border-b text-center w-1/3"
                        colSpan="2"
                      >
                        No events
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <EventView
          event={selectedEvent}
          isOpen={isViewOpen}
          onRequestClose={() => setIsViewOpen(false)}
        />
      )}

      {selectedEvent && (
        <EventEditForm
          isOpen={isEditFormOpen}
          onRequestClose={() => setIsEditFormOpen(false)}
          eventData={selectedEvent}
        />
      )}
    </div>
  );
};

export default EventList;
