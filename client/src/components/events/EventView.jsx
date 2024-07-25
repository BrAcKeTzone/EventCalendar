import React, { useRef } from "react";
import Modal from "react-modal";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../../assets/jsons/Header.json";

Modal.setAppElement("#root");

const EventView = ({ event, isOpen, onRequestClose }) => {
  const {
    eventId,
    eventName,
    eventHost,
    eventSchedStart,
    eventSchedEnd,
    eventLocation,
    eventDescription,
    invitedEmails,
    eventDate,
    createdBy,
    createdAt,
    approvedEventStatus,
    reasonPostponedCancelled,
  } = event;

  const formattedCreatedAt = dayjs(createdAt).format("MMMM D, YYYY");
  const eventViewRef = useRef();

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const downloadPDF = () => {
    const input = eventViewRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 10; // Starting Y position for the first page
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        remainingHeight -= pdfHeight;
        position -= pdfHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          position = 0; // Reset position for the new page
        }
      }

      pdf.save(`${eventName}.pdf`);
    });
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "text-blue-500";
      case "In Progress":
        return "text-yellow-500";
      case "Completed":
        return "text-green-500";
      case "Postponed":
        return "text-orange-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal bg-white rounded-lg shadow-xl p-6 mx-auto my-10 w-3/4 md:w-2/3 max-h-screen overflow-auto relative"
      overlayClassName="overlay bg-gray-900 bg-opacity-50 fixed inset-0 flex items-center justify-center z-10"
    >
      {approvedEventStatus && reasonPostponedCancelled && (
        <div className="mb-4 p-4 border border-gray-300 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="font-bold text-lg">Event Status</div>
            <div
              className={`text-xl font-semibold mt-2 ${getStatusTextColor(
                approvedEventStatus
              )}`}
            >
              {approvedEventStatus}
            </div>
            <div className="mt-2 text-center">
              <div className="font-semibold">Reason:</div>
              <div>{reasonPostponedCancelled}</div>
            </div>
          </div>
        </div>
      )}

      <div ref={eventViewRef}>
        <div className="p-4 flex flex-col items-center text-center border-b border-blue-700 pb-10">
          <img
            src={Header.logo}
            alt="Logo"
            className="w-16 h-16 mx-auto mb-2"
          />
          <div className="text-xs font-semibold">
            <div>{Header.heading}</div>
            <div className="text-sm">{Header.subHeading}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="font-bold text-lg">{createdBy}</div>
              <div>Event No. {eventId}</div>
            </div>
            <div className="text-right">
              <div>{formattedCreatedAt}</div>
              <div className="font-bold">Host - {eventHost}</div>
            </div>
          </div>
          <div>
            <div className="font-bold">TO:</div>
            <div>{invitedEmails.join(", ")}</div>
          </div>
          <div>
            <div className="font-bold">SUBJECT:</div>
            <div>
              {eventName}, {dayjs(eventDate).format("MMMM D, YYYY")} -{" "}
              {formatTime(event.eventSchedStart)} to{" "}
              {formatTime(event.eventSchedEnd)}
            </div>
          </div>
          <hr className="border-t-2 border-gray-500" />
          <div className="whitespace-pre-line">{eventDescription}</div>
        </div>
      </div>
      <button
        onClick={downloadPDF}
        className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        Download as PDF
      </button>
    </Modal>
  );
};

export default EventView;
