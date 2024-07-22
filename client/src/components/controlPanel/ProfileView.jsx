import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ProfileView = ({ isOpen, onRequestClose, profileData }) => {
  const {
    profileImage,
    id,
    name,
    email,
    dateOfBirth,
    jobPosition,
    assignedOffice,
    isApproved,
    isAdmin,
  } = profileData;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal bg-white rounded-lg shadow-xl p-6 mx-auto my-10 w-3/4 md:w-2/5 max-h-screen overflow-auto"
      overlayClassName="overlay bg-gray-900 bg-opacity-50 fixed inset-0 flex items-center justify-center"
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
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 border border-1 rounded-lg mb-2"
        />
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-sm">{assignedOffice}</div>
        <div className="text-sm">{jobPosition}</div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="font-bold">ID:</div>
          <div>{id}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Name:</div>
          <div>{name}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Email:</div>
          <div>{email}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Date of Birth:</div>
          <div>{dateOfBirth}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Approved:</div>
          <div>{isApproved ? "Yes" : "No"}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Admin:</div>
          <div>{isAdmin ? "Yes" : "No"}</div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileView;
