import React, { useState, useEffect } from "react";
import { MdSearch, MdClose, MdEvent, MdCheck, MdPending } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../api";
import { eventHosts, hostColors } from "../assets/others/hostsData";
import EventList from "../components/events/EventList";
import SearchResults from "../components/events/SearchResults";
import MyApprovedEvents from "../components/events/MyApprovedEvents";
import MyPendingEvents from "../components/events/MyPendingEvents";

const EventPage = () => {
  const Id = Cookies.get("SESSION_ID");

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeComponent, setActiveComponent] = useState("EventList");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/find?filter=Approved`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
    }
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
    fetchUsers();
    fetchProfileData();
  }, []);

  const toggleSearchResults = () => {
    setShowSearchResults(!showSearchResults);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "EventList":
        return showSearchResults ? (
          <SearchResults eventHosts={eventHosts} hostColors={hostColors} />
        ) : (
          <EventList eventHosts={eventHosts} hostColors={hostColors} />
        );
      case "MyApprovedEvents":
        return (
          <MyApprovedEvents
            profileData={profileData}
            eventHosts={eventHosts}
            hostColors={hostColors}
          />
        );
      case "MyPendingEvents":
        return (
          <MyPendingEvents
            profileData={profileData}
            users={users}
            eventHosts={eventHosts}
            hostColors={hostColors}
          />
        );
      default:
        return <EventList />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">Events</h1>
        {activeComponent === "EventList" && (
          <div className="">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none ml-4"
              onClick={toggleSearchResults}
            >
              {showSearchResults ? (
                <MdClose size={28} />
              ) : (
                <MdSearch size={28} />
              )}
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center mb-4 pb-4 border-b">
        <button
          className={`mx-2 p-2 ${
            activeComponent === "EventList" ? "bg-gray-200" : "bg-white"
          } border border-gray-400 rounded`}
          onClick={() => {
            setActiveComponent("EventList");
            setShowSearchResults(false);
          }}
        >
          <MdEvent size={24} />
        </button>
        <button
          className={`mx-2 p-2 ${
            activeComponent === "MyApprovedEvents" ? "bg-gray-200" : "bg-white"
          } border border-gray-400 rounded`}
          onClick={() => setActiveComponent("MyApprovedEvents")}
        >
          <MdCheck size={24} />
        </button>
        <button
          className={`mx-2 p-2 ${
            activeComponent === "MyPendingEvents" ? "bg-gray-200" : "bg-white"
          } border border-gray-400 rounded`}
          onClick={() => setActiveComponent("MyPendingEvents")}
        >
          <MdPending size={24} />
        </button>
      </div>
      <div className="mx-auto h-screen overflow-auto">{renderComponent()}</div>
    </div>
  );
};

export default EventPage;
