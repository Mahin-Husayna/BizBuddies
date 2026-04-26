import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-lg flex flex-col justify-between">

      {/* TOP SECTION */}
      <div>
        <h1 className="text-xl font-bold text-purple-700 mb-6">
          BizBuddies
        </h1>

        <ul className="space-y-4 text-gray-700">
          <li
            className="cursor-pointer font-semibold text-purple-600"
            onClick={() => navigate("/home")}
          >
            🏠 Home
          </li>

        <li
  className="cursor-pointer"
  onClick={() => navigate("/my-business")}
>
  🏪 My Business
</li>

          <li className="cursor-pointer">🔍 Explore</li>

          <li className="cursor-pointer">🎁 Deals</li>

          <li className="cursor-pointer">💬 Messages</li>

          <li className="cursor-pointer">📅 Events</li>

          <li className="cursor-pointer">📚 Resources</li>

          <li className="cursor-pointer">👥 Community</li>
        </ul>
      </div>

      {/* BOTTOM CARD */}
      <div className="mt-10 bg-white/60 p-4 rounded-xl shadow">

        <h3 className="font-semibold text-gray-800 text-sm">
          Start Your Business
        </h3>

        <p className="text-xs text-gray-600 mt-1">
          Turn your ideas into impact 🚀
        </p>

        <button
          onClick={() => navigate("/create-business")}
          className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm py-2 rounded-lg hover:opacity-90 transition"
        >
          Get Started
        </button>

      </div>
    </div>
  );
}

export default Sidebar;