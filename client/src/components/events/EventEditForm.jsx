import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import "../../assets/styles/Loader.css";

Modal.setAppElement("#root");

const EventEditForm = ({
    isOpen,
    onRequestClose,
    eventData,
    api,
    users,
    events,
    eventHosts,
    hostColors
}) => {
    const [invitedEmails, setInvitedEmails] = useState(
        eventData.invitedEmails || []
    );
    const [emailInput, setEmailInput] = useState("");
    const [manuallyAddedEmails, setManuallyAddedEmails] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (eventData) {
            setInvitedEmails(eventData.invitedEmails || []);
            // Initially set all current emails as manually added
            setManuallyAddedEmails(eventData.invitedEmails || []);
        }
    }, [eventData]);

    const validationSchema = Yup.object({
        eventName: Yup.string().required("Event Name is required"),
        eventHost: Yup.string().required("Event Host is required"),
        eventDateEnd: Yup.string()
            .required("Event Date End is required")
            .test("is-after-start", "Invalid Date", function (value) {
                const { eventDate } = this.parent;
                // console.log(eventDate);
                // console.log(value);
                // console.log(eventDate && value && eventDate <= value);
                return eventDate && value && eventDate <= value;
            }),
        eventSchedStart: Yup.string().required("Start Time is required"),
        eventSchedEnd: Yup.string()
            .required("End Time is required")
            .test("is-after-start", "Invalid Time", function (value) {
                const { eventSchedStart } = this.parent;
                return eventSchedStart && value && eventSchedStart < value;
            }),
        eventLocation: Yup.string().required("Event Location is required"),
        eventDescription: Yup.string().required(
            "Event Description is required"
        ),
        meetingLink: Yup.string().url("Invalid URL")
    });

    const handleAddEmail = () => {
        if (emailInput && !invitedEmails.includes(emailInput)) {
            setInvitedEmails([...invitedEmails, emailInput]);
            setManuallyAddedEmails([...manuallyAddedEmails, emailInput]);
            setEmailInput("");
        }
    };

    const handleRemoveEmail = emailToRemove => {
        setInvitedEmails(
            invitedEmails.filter(email => email !== emailToRemove)
        );
        setManuallyAddedEmails(
            manuallyAddedEmails.filter(email => email !== emailToRemove)
        );
    };

    const handleSave = async (values, { resetForm }) => {
        if (dayjs(eventData.eventDate).isBefore(dayjs(), "day")) {
            alert(
                "Selected date must be at least 1 day after the current date."
            );
            return;
        }

        // Find matching events on the selected date
        const matchingEvents = events.filter(event =>
            dayjs(event.eventDate).isSame(eventData.eventDate, "day")
        );

        // Check for time conflicts
        const hasConflict = matchingEvents.some(event => {
            const existingStart = dayjs(
                `${event.eventDate} ${event.eventSchedStart}`
            );
            const existingEnd = dayjs(
                `${event.eventDate} ${event.eventSchedEnd}`
            );
            const newStart = dayjs(
                `${dayjs(eventData.eventDate).format("YYYY-MM-DD")} ${
                    values.eventSchedStart
                }`
            );
            const newEnd = dayjs(
                `${dayjs(eventData.eventDate).format("YYYY-MM-DD")} ${
                    values.eventSchedEnd
                }`
            );

            const timeConflict =
                newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
            const rdConflict =
                (event.needRD || event.needARD) &&
                (values.needRD || values.needARD);

            return timeConflict || rdConflict;
        });

        if (hasConflict) {
            alert("Event conflicts with existing event.");
            return;
        }

        const updatedEventData = {
            ...values,
            invitedEmails,
            eventDate: dayjs(eventData.eventDate).format("YYYY-MM-DD")
        };

        try {
            setIsSubmitting(true);
            const response = await api.put(
                `/event/edit/${eventData.eventId}`,
                updatedEventData
            );
            if (response.status === 200) {
                alert("Event Updated Successfully");
                resetForm();
                setEmailInput("");
                setInvitedEmails([]);
                setManuallyAddedEmails([]);
                onRequestClose();
            }
        } catch (error) {
            console.error("Error updating event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal bg-white rounded-lg shadow-xl p-6 mx-auto my-10 md:w-3/4 max-h-screen overflow-auto"
            overlayClassName="overlay bg-gray-900 bg-opacity-50 fixed inset-0 flex items-center justify-center z-10"
        >
            <Formik
                initialValues={{
                    eventName: eventData.eventName || "",
                    eventHost: eventData.eventHost || "",
                    eventDate: eventData.eventDate
                        ? dayjs(eventData.eventDate).format("YYYY-MM-DD")
                        : "",
                    eventDateEnd: eventData.eventDateEnd
                        ? dayjs(eventData.eventDateEnd).format("YYYY-MM-DD")
                        : "",
                    eventSchedStart: eventData.eventSchedStart || "",
                    eventSchedEnd: eventData.eventSchedEnd || "",
                    eventLocation: eventData.eventLocation || "",
                    eventDescription: eventData.eventDescription || "",
                    meetingLink: eventData.meetingLink || "",
                    needRD: eventData.needRD || false,
                    needARD: eventData.needARD || false,
                    needLGMED: eventData.needLGMED || false,
                    needLGCDD: eventData.needLGCDD || false,
                    needORD: eventData.needORD || false,
                    needFAD: eventData.needFAD || false,
                    needPDMU: eventData.needPDMU || false,
                    needRICTU: eventData.needRICTU || false,
                    needLEGAL: eventData.needLEGAL || false
                }}
                validationSchema={validationSchema}
                onSubmit={handleSave}
            >
                {({ values }) => {
                    useEffect(() => {
                        const rdEmails = users
                            .filter(
                                user => user.jobPosition === "Regional Director"
                            )
                            .map(user => user.email);
                        const ardEmails = users
                            .filter(
                                user =>
                                    user.jobPosition ===
                                    "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const lgmedEmails = users
                            .filter(
                                user =>
                                    user.assignedOffice ===
                                        "Local Government Monitoring and Evaluation Division" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const lgcddEmails = users
                            .filter(
                                user =>
                                    user.assignedOffice ===
                                        "Local Government Capacity Development Division" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const ordEmails = users
                            .filter(
                                user =>
                                    user.assignedOffice ===
                                        "Office of the Regional Director" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const fadEmails = users
                            .filter(
                                user => user.assignedOffice ===
                                        "Finance and Administrative Division" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const pdmuEmails = users
                            .filter(
                                user =>  user.assignedOffice ===
                                        "Project Development Management Unit" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const rictuEmails = users
                            .filter(
                                user => user.assignedOffice ===
                                        "Regional Information and Communication Technology Unit" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);
                        const legalEmails = users
                            .filter(
                                user => user.assignedOffice === "Legal Unit" &&
                                    user.jobPosition !== "Regional Director" &&
                                    user.jobPosition !==
                                        "Assistant Regional Director"
                            )
                            .map(user => user.email);

                        let newEmails = invitedEmails;

                        if (values.needRD) {
                            newEmails = [
                                ...new Set([...newEmails, ...rdEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !rdEmails.includes(email)
                            );
                        }

                        if (values.needARD) {
                            newEmails = [
                                ...new Set([...newEmails, ...ardEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !ardEmails.includes(email)
                            );
                        }

                        if (values.needLGMED) {
                            newEmails = [
                                ...new Set([...newEmails, ...lgmedEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !lgmedEmails.includes(email)
                            );
                        }

                        if (values.needLGCDD) {
                            newEmails = [
                                ...new Set([...newEmails, ...lgcddEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !lgcddEmails.includes(email)
                            );
                        }

                        if (values.needORD) {
                            newEmails = [
                                ...new Set([...newEmails, ...ordEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !ordEmails.includes(email)
                            );
                        }

                        if (values.needFAD) {
                            newEmails = [
                                ...new Set([...newEmails, ...fadEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !fadEmails.includes(email)
                            );
                        }

                        if (values.needPDMU) {
                            newEmails = [
                                ...new Set([...newEmails, ...pdmuEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !pdmuEmails.includes(email)
                            );
                        }

                        if (values.needRICTU) {
                            newEmails = [
                                ...new Set([...newEmails, ...rictuEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !rictuEmails.includes(email)
                            );
                        }

                        if (values.needLEGAL) {
                            newEmails = [
                                ...new Set([...newEmails, ...legalEmails])
                            ];
                        } else {
                            newEmails = newEmails.filter(
                                email => !legalEmails.includes(email)
                            );
                        }

                        setInvitedEmails(newEmails);
                    }, [
                        values.needRD,
                        values.needARD,
                        values.needLGMED,
                        values.needLGCDD,
                        values.needORD,
                        values.needFAD,
                        values.needPDMU,
                        values.needRICTU,
                        values.needLEGAL
                    ]);

                    return (
                        <Form className="space-y-4">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <h2 className="text-2xl font-semibold mb-4 flex flex-col text-center md:text-left">
                                    <span> Edit Event on</span>
                                    <span>
                                        {dayjs(eventData.eventDate).format(
                                            "MMMM D, YYYY"
                                        )}
                                    </span>
                                </h2>
                                <div className="flex items-center justify-center mb-5 md:mb-0">
                                    -- until --
                                </div>
                                <div className="mb-4 md:mb-0">
                                    {/* <span>
                    {dayjs(eventData.eventDateEnd).format("MMMM D, YYYY")}
                  </span> */}
                                    <Field
                                        type="date"
                                        id="eventDateEnd"
                                        name="eventDateEnd"
                                        className="w-full border rounded p-2"
                                    />
                                    <ErrorMessage
                                        name="eventDateEnd"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="mb-4 md:flex-1">
                                    <Field
                                        type="text"
                                        name="eventName"
                                        placeholder="Event Name"
                                        className="w-full border rounded p-2"
                                    />
                                    <ErrorMessage
                                        name="eventName"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="mb-4 md:flex-1 md:ml-4">
                                    <Field
                                        as="select"
                                        id="eventHost"
                                        name="eventHost"
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="">Select Host</option>
                                        {eventHosts.map(host => (
                                            <option
                                                key={host}
                                                value={host}
                                                style={{
                                                    backgroundColor:
                                                        hostColors[host]
                                                }}
                                            >
                                                {host}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="eventHost"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-full">
                                    <Field
                                        type="time"
                                        name="eventSchedStart"
                                        className="w-full p-2 border rounded"
                                    />
                                    <ErrorMessage
                                        name="eventSchedStart"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="w-full">
                                    <Field
                                        type="time"
                                        name="eventSchedEnd"
                                        className="w-full p-2 border rounded"
                                    />
                                    <ErrorMessage
                                        name="eventSchedEnd"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <Field
                                    type="text"
                                    name="eventLocation"
                                    placeholder="Event Location"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="eventLocation"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div>
                                <Field
                                    as="textarea"
                                    name="eventDescription"
                                    placeholder="Event Description"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="eventDescription"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div>
                                <Field
                                    type="url"
                                    name="meetingLink"
                                    placeholder="(Optional) Place the attached link here..."
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="meetingLink"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div>
                                <label className="bold">
                                    Required Presence:
                                </label>
                            </div>
                            <div className="pl-0 md:pl-5">
                                <div>
                                    <label>
                                        <Field type="checkbox" name="needRD" />{" "}
                                        Regional Director
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field type="checkbox" name="needARD" />{" "}
                                        Assistant Regional Director
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field
                                            type="checkbox"
                                            name="needLGMED"
                                        />{" "}
                                        Local Government Monitoring and
                                        Evaluation Division
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field
                                            type="checkbox"
                                            name="needLGCDD"
                                        />{" "}
                                        Local Government Capacity Development
                                        Division
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field type="checkbox" name="needORD" />{" "}
                                        Office of the Regional Director
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field type="checkbox" name="needFAD" />{" "}
                                        Finance and Administrative Division
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field
                                            type="checkbox"
                                            name="needPDMU"
                                        />{" "}
                                        Project Development Management Unit
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field
                                            type="checkbox"
                                            name="needRICTU"
                                        />{" "}
                                        Regional Information and Communication
                                        Technology Unit
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <Field
                                            type="checkbox"
                                            name="needLEGAL"
                                        />{" "}
                                        Legal Unit
                                    </label>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Invitee Email"
                                    className="w-full p-2 border rounded"
                                    value={emailInput}
                                    onChange={e =>
                                        setEmailInput(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={handleAddEmail}
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="list-disc pl-5">
                                {invitedEmails.map((email, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center"
                                    >
                                        {manuallyAddedEmails.includes(email) ? (
                                            <>
                                                {email}
                                                <button
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700 border border-black px-2"
                                                    onClick={() =>
                                                        handleRemoveEmail(email)
                                                    }
                                                >
                                                    x
                                                </button>
                                            </>
                                        ) : (
                                            <>{email}</>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={onRequestClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            {isSubmitting && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
                    <div className="loader"></div>
                </div>
            )}
        </Modal>
    );
};

export default EventEditForm;
