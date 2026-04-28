import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // 🔥 REACTIVE MESSAGE COUNT
  const [unreadMessages, setUnreadMessages] = useState(
    Number(localStorage.getItem("msgCount") || 0)
  );

  // 🔁 LISTEN FOR STORAGE + INTERVAL (fix)
  useEffect(() => {
    const updateCount = () => {
      setUnreadMessages(Number(localStorage.getItem("msgCount") || 0));
    };

    // update every second (simple + reliable)
    const interval = setInterval(updateCount, 1000);

    // also listen to tab changes
    window.addEventListener("storage", updateCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const navItem = (path, label, icon, showBadge = false) => (
    <li
      onClick={() => navigate(path)}
      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
        ${
          isActive(path)
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-[1.03]"
            : "text-gray-700 hover:bg-white/60"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>

      {/* 🔴 MESSAGE BADGE */}
      {showBadge && unreadMessages > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {unreadMessages}
        </span>
      )}
    </li>
  );

  return (
    <div className="w-[200px] min-w-[200px] max-w-[200px] h-[calc(100vh-2rem)] sticky top-4 bg-white/40 backdrop-blur-xl p-5 rounded-2xl shadow-lg flex flex-col justify-between">

      {/* TOP */}
      <div>
        <h1 className="text-lg font-bold mb-5">
          <span className="text-pink-500">Biz</span>
          <span className="text-purple-600">Buddies</span>
        </h1>

        <ul className="space-y-2">
          {navItem("/home", "Home", "🏠")}
          {navItem("/my-business", "My Business", "🏪")}
          {navItem("/deals", "Deals", "🔥")}
          {navItem("/messages", "Messages", "💬", true)}
          {navItem("/events", "Events", "📅")}
        </ul>
      </div>

      {/* BOTTOM */}
      <button
        onClick={() => navigate("/create-business")}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl shadow-md hover:scale-105 transition text-sm"
      >
        Get Started →
      </button>

    </div>
  );
}

export default Sidebar;