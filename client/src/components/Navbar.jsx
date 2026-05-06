import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

import { io } from "socket.io-client";

function Navbar({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    products: [],
    businesses: [],
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  const navigate = useNavigate();

  const [socket] = useState(() =>
    io("http://localhost:5000")
  );

  // =========================
  // SEARCH
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
  // FETCH NOTIFICATIONS
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
  // SOCKET
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

      const prev = Number(
        localStorage.getItem("notifCount") || 0
      );

      const updated = prev + 1;

      localStorage.setItem("notifCount", updated);

      setNotifCount(updated);
    });

    // 💬 MESSAGE
    socket.on("newMessage", () => {
      const prev = Number(
        localStorage.getItem("msgCount") || 0
      );

      const updated = prev + 1;

      localStorage.setItem("msgCount", updated);

      setUnreadMessages(updated);

      // ALSO UPDATE GLOBAL NOTIF
      const prevNotif = Number(
        localStorage.getItem("notifCount") || 0
      );

      const updatedNotif = prevNotif + 1;

      localStorage.setItem(
        "notifCount",
        updatedNotif
      );

      setNotifCount(updatedNotif);
    });

    return () => {
      socket.off("newNotification");
      socket.off("newMessage");
    };
  }, [user, socket]);

  // =========================
  // LOAD COUNTS
  // =========================
  useEffect(() => {
    const msgs = Number(
      localStorage.getItem("msgCount") || 0
    );

    const notif = Number(
      localStorage.getItem("notifCount") || 0
    );

    setUnreadMessages(msgs);
    setNotifCount(notif);
  }, []);

  // =========================
  // BELL CLICK
  // =========================
  const handleBellClick = async () => {
    setShowNotif(!showNotif);

    if (!showNotif && user?._id) {
      await fetch(
        `http://localhost:5000/api/notifications/read-all/${user._id}`,
        {
          method: "PUT",
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );

      localStorage.setItem("notifCount", 0);

      setNotifCount(0);
    }
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

      {/* SEARCH */}
      <div className="w-1/2 relative">

        <div className="flex items-center bg-white/70 backdrop-blur rounded-2xl shadow-sm overflow-hidden border border-white/40">

          <input
            type="text"
            placeholder="Search businesses, deals..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="flex-1 px-5 py-3 bg-transparent outline-none text-sm"
          />

          <button
            onClick={handleSearchClick}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <FiSearch size={18} />
          </button>

        </div>

        {/* SEARCH DROPDOWN */}
        {showDropdown && (
          <div className="absolute w-full bg-white mt-2 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto border border-gray-100">

            {/* BUSINESSES */}
            {results.businesses.length > 0 && (
              <div className="p-3 border-b">

                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Businesses
                </p>

                {results.businesses.map((b) => (
                  <div
                    key={b._id}
                    onClick={() =>
                      navigate(`/business/${b._id}`)
                    }
                    className="p-3 hover:bg-gray-100 cursor-pointer rounded-xl transition"
                  >
                    {b.name}
                  </div>
                ))}
              </div>
            )}

            {/* PRODUCTS */}
            {results.products.length > 0 && (
              <div className="p-3">

                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Products
                </p>

                {results.products.map((p) => (
                  <div
                    key={p._id}
                    className="p-3 hover:bg-gray-100 rounded-xl cursor-pointer transition"
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 relative">

        {/* 🔔 NOTIFICATION */}
        <div className="relative cursor-pointer">

          <FiBell
            className="text-[22px] text-gray-700 hover:text-purple-600 transition"
            onClick={handleBellClick}
          />

          {notifCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
              {notifCount}
            </span>
          )}

          {/* DROPDOWN */}
          {showNotif && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto border border-gray-100">

              <div className="p-4 border-b font-semibold text-gray-700">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-4 border-b text-sm transition
                      ${
                        n.isRead
                          ? "bg-gray-50"
                          : "bg-white"
                      }
                    `}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🛒 CART */}
        <div className="relative">
          <FiShoppingCart
            className="text-[22px] cursor-pointer text-gray-700 hover:text-purple-600 transition"
            onClick={() => navigate("/cart")}
          />

          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
              {unreadMessages}
            </span>
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-xl border border-white/40">

          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <FiUser size={18} />
          </div>

          <span className="text-sm font-semibold text-gray-700">
            {user?.name}
          </span>

        </div>

      </div>
    </div>
  );
}

export default Navbar;