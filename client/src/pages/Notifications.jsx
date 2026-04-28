import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch(
      `http://localhost:5000/api/notifications/${user.id}`
    );
    const data = await res.json();
    setNotifications(data);
  };

  const markAsRead = async (id) => {
    await fetch(
      `http://localhost:5000/api/notifications/read/${id}`,
      { method: "PUT" }
    );

    fetchNotifications();
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <div className="flex gap-4">

        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">
          <Navbar user={user} />

          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            Notifications
          </h1>

          {notifications.length === 0 ? (
            <p>No notifications yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 rounded-xl shadow ${
                    n.isRead ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <p>{n.message}</p>

                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="text-sm text-purple-600 mt-2"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Notifications;