import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { eventHosts, hostColors } from "../../assets/others/hostsData";
import EventView from "../events/EventView";
import EventForm from "../events/EventForm";

const DailyView = ({
  setCurrentView,
  users,
  eventsData,
  currentDate: initialDate,
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs(initialDate));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventViewOpen, setIsEventViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (info) => {
    setSelectedDate(dayjs(info.date));
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setIsEventViewOpen(true);
  };

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => prevDate.add(1, "day"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const filteredEvents = eventsData
    .filter((event) => event.isApproved)
    .map((event) => ({
      title: event.eventName,
      start: `${event.eventDate.split("T")[0]}T${event.eventSchedStart}`,
      end: `${event.eventDate.split("T")[0]}T${event.eventSchedEnd}`,
      color: hostColors[event.eventHost] || "gray",
      extendedProps: event,
      display: "block",
    }));

  const eventContent = (eventInfo) => (
    <div className="flex flex-col cursor-pointer">
      <div className="text-xs">
        {dayjs(eventInfo.event.start).format("HH:mm")} -{" "}
        {dayjs(eventInfo.event.end).format("HH:mm")}
      </div>
      <div>
        <span
          className="mr-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: eventInfo.event.backgroundColor }}
        ></span>
        <span>{eventInfo.event.title}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-2">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <button
            onClick={handlePrevDay}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            <MdOutlineNavigateBefore />
          </button>
          <button
            onClick={handleNextDay}
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
          <span>{currentDate.format("MMMM D")}</span>
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
          key={currentDate.toString()} // Force re-render when currentDate changes
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          events={filteredEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={false}
          initialDate={currentDate.toDate()}
          eventContent={eventContent}
          height="auto"
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

export default DailyView;
