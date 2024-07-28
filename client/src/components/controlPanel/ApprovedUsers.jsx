import React, { useState, useEffect } from "react";
import { FaArrowUp, FaTrash } from "react-icons/fa";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import ProfileView from "./ProfileView";
import api from "../../api.jsx";
import "../../assets/styles/Loader.css";

const ApprovedUsers = ({ sessionId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApprovedUsers = async (reset = false) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/find?filter=Approved`);
            setUsers(
                response.data.users.filter(
                    user =>
                        user.isApproved &&
                        user.id !== sessionId &&
                        user.isAdmin !== true
                )
            );
            if (reset) {
                setSearchTerm("");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedUsers();
    }, []);

    const handleSearch = () => {
        const filteredUsers = users.filter(
            user =>
                user.isApproved &&
                user.id !== sessionId &&
                (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setUsers(filteredUsers);
    };

    const handlePromote = async id => {
        setIsLoading(true);
        try {
            if (window.confirm("Are you sure you want to promote this user?")) {
                const response = await api.put(`/admin/promote/${id}`);
                if (response.status === 200) {
                    alert("User has been promoted!");
                    fetchApprovedUsers();
                }
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async id => {
        setIsLoading(true);
        try {
            if (window.confirm("Are you sure you want to decline this user?")) {
                const response = await api.delete(`/admin/decline/${id}`);
                if (response.status === 204) {
                    alert("User has been declined!");
                    fetchApprovedUsers();
                }
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openProfileModal = user => {
        setSelectedUser(user);
        setIsProfileOpen(true);
    };

    const closeProfileModal = () => {
        setIsProfileOpen(false);
        setSelectedUser(null);
    };

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
                    <div className="loader"></div>
                </div>
            )}
          
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <div className="flex flex-col md:flex-row items-center">
                            <h2 className="text-2xl font-semibold">
                                Approved Users
                            </h2>
                            <h1 className="hidden md:block mx-2">|</h1>
                            <p className="italic">Verified users</p>
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="border p-2 rounded"
                                placeholder="Search..."
                                value={searchTerm}
                                // onClick={() => fetchApprovedUsers(true)}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="bg-gray-200 hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
                                onClick={handleSearch}
                            >
                                <MdOutlineContentPasteSearch />
                            </button>
                                                        <button
                                className="bg-gray-200 hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
                                onClick={() => fetchApprovedUsers(true)}
                            >
                                <FiRefreshCcw />
                            </button>
                        </div>
                    </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">ID</th>
                                <th className="py-2">Name</th>
                                <th className="py-2">Email Address</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    onClick={() => openProfileModal(user)}
                                    className="hover:bg-gray-100 cursor-pointer"
                                >
                                    <td className="py-2 text-center">
                                        {user.id}
                                    </td>
                                    <td className="py-2 text-center">
                                        {user.name}
                                    </td>
                                    <td className="py-2 text-center">
                                        {user.email}
                                    </td>
                                    <td className="py-2 flex justify-center space-x-2">
                                        <button
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handlePromote(user.id);
                                            }}
                                        >
                                            <FaArrowUp />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDelete(user.id);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedUser && (
                        <ProfileView
                            isOpen={isProfileOpen}
                            onRequestClose={closeProfileModal}
                            profileData={selectedUser}
                        />
                    )}

        </div>
    );
};

export default ApprovedUsers;
