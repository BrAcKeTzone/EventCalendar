import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  MdOutlineContentPasteSearch,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
import EventEditForm from "./EventEditForm";
import EventView from "../events/EventView";
import api from "../../api.jsx";

const MyPendingEvents = ({ profileData, users, eventHosts, hostColors }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [approveds, setApproveds] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);

  const fetchApprovedEvents = async () => {
    try {
      const response = await api.get(`/event/retrieve?filter=approved`);
      setApproveds(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
    }
  };

  const fetchPendingEvents = async (reset = false) => {
    try {
      const response = await api.get(`/event/retrieve?filter=unapproved`);
      const approvedEvents = response.data.events.filter(
        (event) => !event.isApproved && event.createdBy === profileData.name
      );
      const sortedEvents = approvedEvents.sort((a, b) => {
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
    fetchApprovedEvents();
    fetchPendingEvents();
  }, []);

  const handleSearch = () => {
    const filteredEvents = events.filter(
      (event) =>
        event.isApproved &&
        (event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.eventLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.createdBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setEvents(filteredEvents);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEditFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this event?")) {
        const response = await api.delete(`/event/delete/${id}`);
        if (response.status === 204) {
          alert("Event has been declined!");
          fetchPendingEvents();
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const filterUpcomingEvents = (events) => {
    const currentDate = new Date();
    return events.filter((event) => new Date(event.eventDate) >= currentDate);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 border-b">
        <div className="flex flex-col md:flex-row items-center">
          <h2 className="text-2xl font-semibold">My Pending Events</h2>
        </div>
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Search..."
            value={searchTerm}
            onClick={() => fetchPendingEvents(true)}
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
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Event Name
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Location
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Date
            </th>
            <th className="py-3 px-4 text-center text-gray-600 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {(showUpcoming ? filterUpcomingEvents(events) : events).map(
            (event) => (
              <tr
                key={event.eventId}
                onClick={() => handleRowClick(event)}
                className="hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <td className="py-3 px-4 border-b">{event.eventName}</td>
                <td className="py-3 px-4 border-b">{event.eventLocation}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className="py-3 px-4 flex justify-center space-x-2 border-b">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.eventId);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {isViewOpen && selectedEvent && (
        <EventView
          event={selectedEvent}
          isOpen={isViewOpen}
          onRequestClose={() => setIsViewOpen(false)}
        />
      )}
      {isEditFormOpen && selectedEvent && (
        <EventEditForm
          isOpen={isEditFormOpen}
          onRequestClose={() => {
            fetchPendingEvents();
            setIsEditFormOpen(false);
          }}
          eventData={selectedEvent}
          api={api}
          users={users}
          events={approveds}
          eventHosts={eventHosts}
          hostColors={hostColors}
        />
      )}
    </div>
  );
};

export default MyPendingEvents;
