import React, { useState, useEffect } from "react";
import { FaTrash, FaEllipsisV } from "react-icons/fa";
import {
  MdOutlineContentPasteSearch,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
import EventView from "../events/EventView";
import Modal from "react-modal";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../api.jsx";

Modal.setAppElement("#root");

const MyApprovedEvents = ({ profileData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [filter, setFilter] = useState("approved");
  const [actionType, setActionType] = useState("");
  const [eventIdForAction, setEventIdForAction] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchEvents = async (reset = false) => {
    try {
      const response = await api.get(`/event/retrieve?filter=${filter}`);
      const filteredEvents = response.data.events.filter(
        (event) => event.createdBy === profileData.name
      );
      const sortedEvents = filteredEvents.sort((a, b) => {
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
    fetchEvents();
  }, [filter]);

  const handleSearch = () => {
    const filteredEvents = events.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEvents(filteredEvents);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this event?")) {
        const response = await api.delete(`/event/delete/${id}`);
        if (response.status === 204) {
          alert("Event has been declined!");
          fetchEvents();
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setActionType("");
    setEventIdForAction(null);
  };

  const handleActionClick = (eventId, action) => {
    setActionType(action);
    setEventIdForAction(eventId);
    setIsModalOpen(true);
  };

  const handlePostponeCancel = async (values) => {
    try {
      const response = await api.put(
        `/event/${actionType}/${eventIdForAction}`,
        {
          reasonPostponedCancelled: values.reasonPostponedCancelled,
        }
      );
      if (response.status === 200) {
        alert(`Event has been ${actionType}!`);
        fetchEvents();
        closeModal();
      }
    } catch (error) {
      console.error(`Error ${actionType} event:`, error);
    }
  };

  const filterUpcomingEvents = (events) => {
    const currentDate = new Date();
    return events.filter((event) => new Date(event.eventDate) >= currentDate);
  };

  const toggleDropdown = (eventId) => {
    setDropdownOpen(dropdownOpen === eventId ? null : eventId);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 border-b">
        <div className="flex flex-col md:flex-row items-center mb-2 md:mb-0">
          <h2 className="text-2xl font-semibold">My Events</h2>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-2 items-center w-full md:w-auto">
          <select
            className="border p-2 rounded mb-2 md:mb-0 w-full md:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex space-x-2 items-center w-full md:w-auto">
            <input
              type="text"
              className="border p-2 rounded w-full md:w-auto"
              placeholder="Search..."
              value={searchTerm}
              onClick={() => fetchEvents(true)}
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
                <td className="py-3 px-4 flex justify-center space-x-2 border-b relative">
                  <button
                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(event.eventId);
                    }}
                  >
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen === event.eventId && (
                    <div className="absolute top-10 right-0 bg-white border shadow-lg rounded z-10">
                      {event.approvedEventStatus === "Scheduled" && (
                        <>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(event.eventId, "postpone");
                              setDropdownOpen(null);
                            }}
                          >
                            Postpone
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(event.eventId, "cancel");
                              setDropdownOpen(null);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {selectedEvent && (
        <EventView
          event={selectedEvent}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">
            {actionType === "postpone" ? "Postpone Event" : "Cancel Event"}
          </h2>
          <Formik
            initialValues={{ reasonPostponedCancelled: "" }}
            validationSchema={Yup.object({
              reasonPostponedCancelled:
                Yup.string().required("Reason is required"),
            })}
            onSubmit={handlePostponeCancel}
          >
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="reasonPostponedCancelled"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>
                <Field
                  name="reasonPostponedCancelled"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="reasonPostponedCancelled"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default MyApprovedEvents;
