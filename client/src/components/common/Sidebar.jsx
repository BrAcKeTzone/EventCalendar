import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdMenuOpen,
  MdMenu,
  MdEvent,
  MdCalendarToday,
  MdSettings,
  MdExitToApp,
} from "react-icons/md";
import LoggedProfileView from "./LoggedProfileView";
import Cookies from "js-cookie";
import api from "../../api";
import Header from "../../assets/jsons/Header.json";

const Sidebar = () => {
  const Id = Cookies.get("SESSION_ID");

  const [isHidden, setIsHidden] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const toggleSidebar = () => {
    setIsHidden(!isHidden);
  };

  const navigate = useNavigate();
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      Cookies.remove("SESSION_ID");
      console.log("Signing out...");
      navigate("/");
    }
  };

  const openProfileModal = () => {
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  const fetchProfileData = async () => {
    if (!Id) {
      alert("Session Expired. Re-login.");
      navigate("/");
    } else {
      const sessionId = JSON.parse(Id);

      try {
        const response = await api.get(`/user/profile/${sessionId}`);
        setProfileData(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const isAdmin = profileData.isAdmin === true;
  const menuItems = [
    { name: "Calendar", path: "/cal", icon: <MdCalendarToday /> },
    { name: "Events", path: "/eve", icon: <MdEvent /> },
    isAdmin && { name: "Control Panel", path: "/usr", icon: <MdSettings /> },
    { name: "Sign out", onClick: handleSignOut, icon: <MdExitToApp /> },
  ].filter(Boolean);

  return (
    <div className="flex h-screen fixed md:sticky md:top-0 md:h-screen">
      <div
        className={`${
          isHidden ? "w-0" : "w-64"
        } bg-blue-500 text-white transition-width duration-300 flex flex-col overflow-auto`}
      >
        {/* Logo and Department */}
        <div className="p-4 flex flex-row items-center text-center border-b border-blue-700">
          <img src={Header.logo} alt="Logo" className="w-16 h-16 mb-2" />
          <div className="text-xs font-semibold flex flex-col">
            <div>{Header.heading}</div>
            <div className="text-sm">{Header.subHeading}</div>
          </div>
        </div>

        {/* Profile */}
        <div
          className="p-4 flex flex-col items-center text-center border-b border-blue-700 cursor-pointer"
          onClick={openProfileModal}
        >
          <img
            src={profileData.profileImage}
            alt="User Profile"
            className="w-24 h-24 border border-1 rounded-lg mb-2"
          />

          <div className="text-lg font-semibold">{profileData.name}</div>
          <div className="text-sm">{profileData.assignedOffice}</div>
          <div className="text-base">{profileData.jobPosition}</div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? " p-2 rounded bg-blue-600 flex items-center"
                        : " p-2 rounded hover:bg-blue-600 flex items-center"
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ) : (
                  <button
                    onClick={item.onClick}
                    className=" p-2 rounded hover:bg-blue-600 w-full text-left flex items-center"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={isHidden ? "w-0" : "w-screen md:w-0"}
        onClick={toggleSidebar}
      >
        <button
          className="p-2 m-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
          onClick={toggleSidebar}
          style={{ width: "30px", height: "30px" }}
        >
          {isHidden ? <MdMenu /> : <MdMenuOpen />}
        </button>
      </div>
      <LoggedProfileView
        isOpen={isProfileOpen}
        onRequestClose={closeProfileModal}
        profileData={profileData}
        fetchProfileData={fetchProfileData}
      />
    </div>
  );
};

export default Sidebar;
