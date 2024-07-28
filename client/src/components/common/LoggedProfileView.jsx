import React, { useState } from "react";
import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api";
import { offices } from "../../assets/jsons/Offices.json";
import "../../assets/styles/Loader.css";

Modal.setAppElement("#root");

const LoggedProfileView = ({
    isOpen,
    onRequestClose,
    profileData,
    fetchProfileData
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            formik.resetForm();
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: profileData.id,
            name: profileData.name,
            dateOfBirth: profileData.dateOfBirth,
            jobPosition: profileData.jobPosition,
            assignedOffice: profileData.assignedOffice,
            currentPassword: "",
            profileImage: null
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            dateOfBirth: Yup.string().required("Date of Birth is required"),
            jobPosition: Yup.string().required("Job Position is required"),
            assignedOffice: Yup.string().required(
                "Assigned Office is required"
            ),
            currentPassword: Yup.string().required(
                "Current Password is required"
            )
        }),
        onSubmit: async values => {
            try {
                setIsSubmitting(true);
                const formData = new FormData();
                // Append fields to formData
                formData.append("id", values.id);
                formData.append("name", values.name);
                formData.append("dateOfBirth", values.dateOfBirth);
                formData.append("jobPosition", values.jobPosition);
                formData.append("assignedOffice", values.assignedOffice);
                formData.append("currentPassword", values.currentPassword);

                // Append profileImage if it is not null
                if (values.profileImage) {
                    formData.append("profileImage", values.profileImage);
                }

                const response = await api.put(`/user/prof-edit`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 201) {
                    alert("Profile edited successfully!");
                    await fetchProfileData();
                    formik.resetForm();
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    alert("Error editing profile");
                } else if (error.response && error.response.status === 401) {
                    alert(
                        "Authentication Failed. Check your password and try again!"
                    );
                } else {
                    alert("An unexpected error occurred");
                    console.error("Error:", error);
                }
            } finally {
                setIsSubmitting(false);
            }
            setIsEditing(false);
        }
    });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal bg-white rounded-lg shadow-xl p-6 mx-auto my-10 md:w-2/5 max-h-screen overflow-auto"
            overlayClassName="overlay bg-gray-900 bg-opacity-50 fixed inset-0 flex items-center justify-center z-10"
        >
            <div className="w-full flex justify-end">
                <button
                    onClick={onRequestClose}
                    className=" text-white bg-red-500 hover:bg-red-700 rounded-md w-8 h-8 flex items-center justify-center"
                >
                    &times;
                </button>
            </div>
            <div className="p-4 flex flex-col items-center text-center border-b border-blue-700">
                <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 border border-1 rounded-lg mb-2"
                />
                {isEditing ? (
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="flex flex-col items-center">
                            <input
                                id="profileImage"
                                name="profileImage"
                                type="file"
                                onChange={event => {
                                    formik.setFieldValue(
                                        "profileImage",
                                        event.currentTarget.files[0]
                                    );
                                }}
                                className={`border p-2 rounded border-gray-300 w-28`}
                            />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="font-bold">Name:</div>
                            <div className="flex flex-col w-1/2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    disabled
                                    className={`border p-2 rounded ${
                                        formik.touched.name &&
                                        formik.errors.name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.name}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="font-bold">Date of Birth:</div>
                            <div className="flex flex-col w-1/2">
                                <input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dateOfBirth}
                                    className={`border p-2 rounded ${
                                        formik.touched.dateOfBirth &&
                                        formik.errors.dateOfBirth
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {formik.touched.dateOfBirth &&
                                formik.errors.dateOfBirth ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.dateOfBirth}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="font-bold">Job Position:</div>
                            <div className="flex flex-col w-1/2">
                                <input
                                    id="jobPosition"
                                    name="jobPosition"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.jobPosition}
                                    className={`border p-2 rounded ${
                                        formik.touched.jobPosition &&
                                        formik.errors.jobPosition
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {formik.touched.jobPosition &&
                                formik.errors.jobPosition ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.jobPosition}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="font-bold">Office:</div>
                            <div className="flex flex-col w-1/2">
                                <select
                                    id="assignedOffice"
                                    name="assignedOffice"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.assignedOffice}
                                    className={`border p-2 rounded ${
                                        formik.touched.assignedOffice &&
                                        formik.errors.assignedOffice
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="" label="Select office" />
                                    {offices.map(office => (
                                        <option key={office} value={office}>
                                            {office}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.assignedOffice &&
                                formik.errors.assignedOffice ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.assignedOffice}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="font-bold">Current Password:</div>
                            <div className="flex flex-col w-1/2">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.currentPassword}
                                    className={`border p-2 rounded ${
                                        formik.touched.currentPassword &&
                                        formik.errors.currentPassword
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {formik.touched.currentPassword &&
                                formik.errors.currentPassword ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.currentPassword}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <>
                        <div className="text-lg font-semibold">
                            {profileData.name}
                        </div>
                        <div className="text-sm">
                            {profileData.assignedOffice}
                        </div>
                        <div className="text-sm">{profileData.jobPosition}</div>
                    </>
                )}
            </div>
            {!isEditing && (
                <div className="p-4 space-y-4">
                    <div className="flex justify-between">
                        <div className="font-bold">ID:</div>
                        <div>{profileData.id}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="font-bold">Name:</div>
                        <div>{profileData.name}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="font-bold">Email:</div>
                        <div>{profileData.email}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="font-bold">Date of Birth:</div>
                        <div>{profileData.dateOfBirth}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="font-bold">Admin:</div>
                        <div>{profileData.isAdmin ? "Yes" : "No"}</div>
                    </div>
                </div>
            )}
            <div className="flex justify-end">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={handleEditToggle}
                >
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>
            {isSubmitting && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
                    <div className="loader"></div>
                </div>
            )}
        </Modal>
    );
};

export default LoggedProfileView;
