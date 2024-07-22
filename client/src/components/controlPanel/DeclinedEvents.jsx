import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import EventView from "../events/EventView";
import api from "../../api.jsx";

const DeclineEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDeclineEvents = async (reset = false) => {
    try {
      const response = await api.get(`/event/retrieve?filter=declined`);
      const declinedEvents = response.data.events.filter(
        (event) => event.eventRemarks !== null
      );
      const sortedEvents = declinedEvents.sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        const timeA = a.eventSchedStart;
        const timeB = b.eventSchedStart;
        return timeA.localeCompare(timeB);
      });
      setEvents(sortedEvents);
      if (reset) {
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchDeclineEvents();
  }, []);

  const handleSearch = () => {
    const filteredEvents = events.filter(
      (event) =>
        !event.isApproved &&
        (event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.eventLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.createdBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setEvents(filteredEvents);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this event?")) {
        const response = await api.delete(`/event/delete/${id}`);
        if (response.status === 204) {
          alert("Event has been declined!");
          fetchDeclineEvents();
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <h2 className="text-2xl font-semibold">Declined Events</h2>
          <h1 className="hidden md:block mx-2">|</h1>
          <p className="italic">Review feedback</p>
        </div>
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Search..."
            value={searchTerm}
            onClick={() => fetchDeclineEvents(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-gray-200 hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
            onClick={handleSearch}
          >
            <MdOutlineContentPasteSearch />
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Event Name</th>
            <th className="py-2">Location</th>
            <th className="py-2">Time</th>
            <th className="py-2">Date</th>
            <th className="py-2">Host</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.eventId}
              onClick={() => handleRowClick(event)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-2 text-center">{event.eventName}</td>
              <td className="py-2 text-center">{event.eventLocation}</td>
              <td className="py-2 text-center">
                {formatTime(event.eventSchedStart)} to{" "}
                {formatTime(event.eventSchedEnd)}
              </td>
              <td className="py-2 text-center">
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="py-2 text-center">{event.createdBy}</td>
              <td className="py-2 text-center">{event.eventRemarks}</td>
              <td className="py-2 flex justify-center space-x-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.eventId);
                  }}
                >
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && (
        <EventView
          event={selectedEvent}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
        />
      )}
    </div>
  );
};

export default DeclineEvents;
