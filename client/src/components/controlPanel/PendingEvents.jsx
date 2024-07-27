import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import Modal from "react-modal";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import EventView from "../events/EventView";
import api from "../../api.jsx";
import "../../assets/styles/Loader.css";

Modal.setAppElement("#root");

const PendingEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineEventId, setDeclineEventId] = useState(null);
  const [isEventViewOpen, setIsEventViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingEvents = async (reset = false) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/event/retrieve?filter=unapproved`);
      const unapprovedEvents = response.data.events.filter(
        (event) => !event.isApproved
      );
      const sortedEvents = unapprovedEvents.sort((a, b) => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
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

  const handleApprove = async (id) => {
    setIsLoading(true);
    try {
      if (window.confirm("Are you sure you want to approve this events?")) {
        const response = await api.put(`/event/approve/${id}`);
        if (response.status === 200) {
          alert("Event has been approved!");
          fetchPendingEvents();
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (id, eventRemarks) => {
    setIsLoading(true);

    try {
      const response = await api.put(`/event/decline/${id}`, {
        eventRemarks,
      });
      if (response.status === 200) {
        alert("Event has been declined!");
        fetchPendingEvents();
        closeModal();
      }
    } catch (error) {
      console.error("Error declining event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeclineModal = (id) => {
    setDeclineEventId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeclineEventId(null);
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsEventViewOpen(true);
  };

  const closeEventViewModal = () => {
    setIsEventViewOpen(false);
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
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
          <div className="loader"></div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex flex-col md:flex-row items-center">
              <h2 className="text-2xl font-semibold">Pending Events</h2>
              <h1 className="hidden md:block mx-2">|</h1>
              <p className="italic">Under consideration</p>
            </div>
            <div className="flex space-x-2  items-center">
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
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Event Name</th>
                <th className="py-2 hidden sm:table-cell">Location</th>
                <th className="py-2 hidden sm:table-cell">Time</th>
                <th className="py-2 hidden sm:table-cell">Date</th>
                <th className="py-2">Host</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.eventId}
                  onClick={() => handleRowClick(event)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="py-2 text-center">{event.eventName}</td>
                  <td className="py-2 text-center hidden sm:table-cell">
                    {event.eventLocation}
                  </td>
                  <td className="py-2 text-center hidden sm:table-cell">
                    {formatTime(event.eventSchedStart)} to{" "}
                    {formatTime(event.eventSchedEnd)}
                  </td>
                  <td className="py-2 text-center hidden sm:table-cell">
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-2 text-center">{event.createdBy}</td>
                  <td className="py-2 flex justify-center space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(event.eventId);
                      }}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeclineModal(event.eventId);
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
              isOpen={isEventViewOpen}
              onRequestClose={closeEventViewModal}
            />
          )}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4">Decline Event</h2>
              <Formik
                initialValues={{ eventRemarks: "" }}
                validationSchema={Yup.object({
                  eventRemarks: Yup.string().required(
                    "Event remarks are required"
                  ),
                })}
                onSubmit={(values) => {
                  handleDecline(declineEventId, values.eventRemarks);
                }}
              >
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="eventRemarks"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Remarks
                    </label>
                    <Field
                      name="eventRemarks"
                      as="textarea"
                      placeholder="Why is the event declined?"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      cols="50"
                    />
                    <ErrorMessage
                      name="eventRemarks"
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
        </>
      )}
    </div>
  );
};

export default PendingEvents;
