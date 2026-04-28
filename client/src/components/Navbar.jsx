import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiMessageCircle } from "react-icons/fi";
import { io } from "socket.io-client";

function Navbar({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], businesses: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔔 Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const navigate = useNavigate();

  // ✅ CREATE SOCKET ONCE
  const [socket] = useState(() => io("http://localhost:5000"));

  // =========================
  // 🔍 LIVE SEARCH (UNCHANGED)
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
  // 🔁 FETCH NOTIFICATIONS (POLLING BACKUP)
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

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // =========================
  // ⚡ SOCKET REALTIME
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    // register user
    socket.emit("register", user._id);

    // listen for notification
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: data.message,
          isRead: false,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user, socket]);

  // =========================
  // 🔴 UNREAD COUNT
  // =========================
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead = async (id) => {
    await fetch(
      `http://localhost:5000/api/notifications/read/${id}`,
      { method: "PUT" }
    );

    fetchNotifications();
  };

  // =========================
  // SEARCH HANDLERS
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

      {/* 🔍 SEARCH BAR */}
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
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
          >
            <FiSearch size={18} />
          </button>
        </div>

        {/* 🔽 SEARCH DROPDOWN */}
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
                    <span className="text-xs text-gray-500 ml-2">
                      ({b.category})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {results.products.length > 0 && (
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Products</p>

                {results.products.map((p) => (
                  <div
                    key={p._id}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    {p.name}
                    <span className="text-xs text-purple-500 ml-2">
                      ৳{p.price}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* 🔔 RIGHT SIDE */}
      <div className="flex items-center gap-4 relative">

        {/* 🔔 BELL */}
        <div className="relative cursor-pointer">

          <FiBell
            className="text-lg"
            onClick={() => setShowNotif(!showNotif)}
          />

          {/* 🔴 BADGE */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {unreadCount}
            </span>
          )}

          {/* 🔽 DROPDOWN */}
          {showNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">

              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`p-3 border-b cursor-pointer ${
                      n.isRead ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <p className="text-sm">{n.message}</p>
                  </div>
                ))
              )}

              <div
                onClick={() => navigate("/notifications")}
                className="p-3 text-center text-purple-600 cursor-pointer hover:bg-gray-100"
              >
                View All
              </div>

            </div>
          )}

        </div>

        {/* 💬 MESSAGE ICON */}
        <FiMessageCircle className="text-lg cursor-pointer" />

        {/* 👤 USER */}
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