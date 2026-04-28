import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiMessageCircle } from "react-icons/fi";
import { io } from "socket.io-client";

function Navbar({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], businesses: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifCount, setNotifCount] = useState(0); // 🔥 NEW

  const navigate = useNavigate();
  const [socket] = useState(() => io("http://localhost:5000"));

  // =========================
  // 🔍 SEARCH (UNCHANGED)
  // =========================
  useEffect(() => {
    if (!query.trim()) {
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(() => {
      fetch(`http://localhost:5000/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setShowDropdown(true);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // =========================
  // 🔁 FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${user._id}`
      );
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // =========================
  // ⚡ SOCKET (FIXED)
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("register", user._id);

    // 🔔 NOTIFICATION
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: data.message,
          isRead: false,
        },
        ...prev,
      ]);

      // 🔥 FIX: update global notif count
      const prev = Number(localStorage.getItem("notifCount") || 0);
      const updated = prev + 1;

      localStorage.setItem("notifCount", updated);
      setNotifCount(updated);
    });

    // 💬 MESSAGE
    socket.on("newMessage", () => {
      const prev = Number(localStorage.getItem("msgCount") || 0);
      const updated = prev + 1;

      localStorage.setItem("msgCount", updated);
      setUnreadMessages(updated);

      // 🔥 ALSO increase notification count (IMPORTANT FIX)
      const prevNotif = Number(localStorage.getItem("notifCount") || 0);
      const updatedNotif = prevNotif + 1;

      localStorage.setItem("notifCount", updatedNotif);
      setNotifCount(updatedNotif);
    });

    return () => {
      socket.off("newNotification");
      socket.off("newMessage");
    };
  }, [user, socket]);

  // =========================
  // LOAD COUNTS (FIXED)
  // =========================
  useEffect(() => {
    const msgs = Number(localStorage.getItem("msgCount") || 0);
    const notif = Number(localStorage.getItem("notifCount") || 0);

    setUnreadMessages(msgs);
    setNotifCount(notif);
  }, []);

  // =========================
  // 🔔 BELL CLICK (FIXED)
  // =========================
  const handleBellClick = async () => {
    setShowNotif(!showNotif);

    if (!showNotif && user?._id) {
      await fetch(
        `http://localhost:5000/api/notifications/read-all/${user._id}`,
        { method: "PUT" }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      // 🔥 RESET COUNT
      localStorage.setItem("notifCount", 0);
      setNotifCount(0);
    }
  };

  // =========================
  // 🔍 SEARCH HANDLERS
  // =========================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${query}`);
      setShowDropdown(false);
    }
  };

  const handleSearchClick = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setShowDropdown(false);
  };

  return (
    <div className="flex justify-between items-center mb-6 relative">

      {/* SEARCH */}
      <div className="w-1/2 relative">
        <div className="flex items-center bg-white/70 backdrop-blur rounded-xl shadow-sm overflow-hidden">
          <input
            type="text"
            placeholder="Search businesses, deals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
          />

          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <FiSearch size={18} />
          </button>
        </div>

        {showDropdown && (
          <div className="absolute w-full bg-white mt-2 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
            {results.businesses.length > 0 && (
              <div className="p-3 border-b">
                <p className="text-xs text-gray-400 mb-2">Businesses</p>
                {results.businesses.map((b) => (
                  <div
                    key={b._id}
                    onClick={() => navigate(`/business/${b._id}`)}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    {b.name}
                  </div>
                ))}
              </div>
            )}

            {results.products.length > 0 && (
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Products</p>
                {results.products.map((p) => (
                  <div key={p._id} className="p-2 hover:bg-gray-100 rounded">
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* 🔔 BELL */}
        <div className="relative cursor-pointer">
          <FiBell className="text-lg" onClick={handleBellClick} />

          {notifCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {notifCount}
            </span>
          )}

          {showNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 border-b ${
                    n.isRead ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💬 MESSAGE */}
        <div
          className="relative cursor-pointer"
          onClick={() => {
            localStorage.setItem("msgCount", 0);
            setUnreadMessages(0);
            navigate("/messages");
          }}
        >
          <FiMessageCircle className="text-lg" />

          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {unreadMessages}
            </span>
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">
            {user?.name}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Navbar;