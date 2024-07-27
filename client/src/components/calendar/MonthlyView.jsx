import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { eventHosts, hostColors } from "../../assets/others/hostsData";
import EventForm from "../events/EventForm";
import EventView from "../events/EventView";

const MonthlyView = ({ setCurrentView, users, eventsData }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventViewOpen, setIsEventViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  const handleDateClick = (info) => {
    setSelectedDate(dayjs(info.date));
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setIsEventViewOpen(true);
  };

  const handlePrevMonth = () => {
    const newDate = currentDate.subtract(1, "month");
    setCurrentDate(newDate);
    calendarRef.current.getApi().gotoDate(newDate.toDate());
  };

  const handleNextMonth = () => {
    const newDate = currentDate.add(1, "month");
    setCurrentDate(newDate);
    calendarRef.current.getApi().gotoDate(newDate.toDate());
  };

  const handleToday = () => {
    const newDate = dayjs();
    setCurrentDate(newDate);
    calendarRef.current.getApi().gotoDate(newDate.toDate());
  };

  const filteredEvents = eventsData
    .filter((event) => event.isApproved)
    .map((event) => ({
      title: event.eventName,
      start: `${event.eventDate.split("T")[0]}T${event.eventSchedStart}`,
      end: `${event.eventDateEnd.split("T")[0]}T${event.eventSchedEnd}`,
      color: hostColors[event.eventHost] || "gray",
      extendedProps: event,
    }));

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(currentDate.toDate());
    }
  }, [currentDate]);

  const renderEventContent = (eventInfo) => {
    const { backgroundColor } = eventInfo.event;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor,
            marginRight: "5px",
          }}
        />
        <span>{eventInfo.event.title}</span>
      </div>
    );
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

        <div className="text-2xl font-bold flex items-center space-x-2 mb-2 md:mb-0">
          <span>{currentDate.format("MMMM")}</span>
          <span>{currentDate.format("YYYY")}</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView("month")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Month
          </button>
          <button
            onClick={() => setCurrentView("week")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Week
          </button>
          <button
            onClick={() => setCurrentView("day")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Day
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={false}
          initialDate={currentDate.toDate()}
          height="auto"
          eventContent={renderEventContent}
        />
      </div>

      <EventForm
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        users={users}
        events={eventsData}
        eventHosts={eventHosts}
        hostColors={hostColors}
      />

      {selectedEvent && (
        <EventView
          event={selectedEvent}
          isOpen={isEventViewOpen}
          onRequestClose={() => setIsEventViewOpen(false)}
        />
      )}
    </div>
  );
};

export default MonthlyView;
