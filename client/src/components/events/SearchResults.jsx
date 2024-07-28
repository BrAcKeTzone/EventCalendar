import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import api from "../../api";
import EventEditForm from "./EventEditForm";
import EventView from "./EventView";
import "../../assets/styles/Loader.css";

const SearchResults = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/event/retrieve?filter=approved`);
            setEvents(response.data.events);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSearch = () => {
        const filtered = events.filter(
            event =>
                event.isApproved &&
                event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    const handleView = event => {
        setSelectedEvent(event);
        setIsViewOpen(true);
    };

    const handleEdit = event => {
        setSelectedEvent(event);
        setIsEditFormOpen(true);
    };

    const handleDelete = eventId => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            console.log("Delete event with ID:", eventId);
            // Implement logic to delete the event from the data source
        }
    };

    const formatTime = timeString => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;
    };

    return (
        <div className="p-4">
           {isLoading && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
                    <div className="loader"></div>
                </div>
            )}
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search events..."
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-l hover:bg-gray-300 flex-grow"
                />
                <button
                    onClick={handleSearch}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r hover:bg-gray-300"
                >
                    Search
                </button>
            </div>

            <div>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => {
                        const dateToShow = dayjs(event.eventDate);
                        const isPastEvent = dateToShow.isBefore(dayjs(), "day");
                        const rowClassName = isPastEvent ? "text-gray-400" : "";

                        return (
                            <div
                                key={event.eventId}
                                className={`mb-4 ${rowClassName}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div
                                        className={`font-bold ${rowClassName}`}
                                    >
                                        {dateToShow.format("dddd")}
                                    </div>
                                    <div className={`${rowClassName}`}>
                                        {dateToShow.format("MMMM D, YYYY")}
                                    </div>
                                </div>
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">
                                                Time
                                            </th>
                                            <th className="py-2 px-4 border-b">
                                                Event
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            className={`hover:bg-gray-100 cursor-pointer ${rowClassName}`}
                                            onClick={() => handleView(event)}
                                        >
                                            <td className="py-2 px-4 border-b text-center">
                                                {formatTime(
                                                    event.eventSchedStart
                                                )}{" "}
                                                to{" "}
                                                {formatTime(
                                                    event.eventSchedEnd
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center">
                                                {event.eventName}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center mt-4">No events found</div>
                )}
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

export default SearchResults;
