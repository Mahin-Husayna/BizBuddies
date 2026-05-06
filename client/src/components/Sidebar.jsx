import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("business");

    window.location.href = "/";
  };

  // =========================
  // MENU ITEMS
  // =========================
  const menuItems = [
    {
      name: "Home",
      icon: "🏠",
      path: "/home",
    },
    {
      name: "My Business",
      icon: "🏪",
      path: "/my-business",
    },
    {
      name: "Deals",
      icon: "🔥",
      path: "/deals",
    },
    {
      name: "Messages",
      icon: "💬",
      path: "/messages",
    },
    {
      name: "Orders",
      icon: "📦",
      path: "/orders",
    },
  ];

  return (
    <div className="w-[260px] min-h-screen rounded-[28px] bg-white/35 backdrop-blur-2xl border border-white/20 shadow-xl px-5 py-7 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-[42px] leading-none font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            BizBuddies
          </h1>

          <p className="text-sm text-gray-500 mt-2 ml-1">
            Campus Business Hub
          </p>
        </div>

        {/* MENU */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`group w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-left

                  ${
                    active
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/30 hover:bg-white/50 text-gray-700"
                  }
                `}
              >
                {/* ICON */}
                <span
                  className={`text-[20px] transition-transform duration-300 ${
                    active ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>

                {/* TEXT */}
                <span className="font-semibold text-[16px]">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-2xl shadow-md transition-all duration-300 font-semibold"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;