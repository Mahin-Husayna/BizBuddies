import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Announcements from "./Announcements";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/business/leaderboard")
      .then((res) => res.json())
      .then(setLeaders)
      .catch((err) => console.error(err));
  }, []);

  // 🏆 Medal colors
  const getRankStyle = (index) => {
    if (index === 0) return "text-yellow-500"; // gold
    if (index === 1) return "text-gray-400";   // silver
    if (index === 2) return "text-orange-400"; // bronze
    return "text-purple-500";
  };

  return (
    <div className="w-[300px] flex flex-col gap-4">

      {/* LEADERBOARD */}
      <div className="bg-white/50 backdrop-blur-xl p-4 rounded-2xl shadow-md">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-purple-700">
            🏆 Campus Leaderboard
          </h2>
          <span className="text-xs text-purple-500 cursor-pointer hover:underline">
            View All
          </span>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3">

          {leaders.length === 0 ? (
            <p className="text-sm text-gray-500">No rankings yet</p>
          ) : (
            leaders.map((item, index) => (
              <div
                key={item._id}
                onClick={() => navigate(`/business/${item._id}`)}
                className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  {/* RANK */}
                  <span
                    className={`text-lg font-bold ${getRankStyle(index)}`}
                  >
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </span>

                  {/* IMAGE */}
                  <img
                    src={
                      item.coverImage ||
                      "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover border"
                  />

                  {/* INFO */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      ⭐ {item.rating?.toFixed(1) || 0} •{" "}
                      {item.totalReviews || 0} reviews
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-purple-600 font-bold text-sm">
                    {item.rating?.toFixed(1) || 0}
                  </p>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      <Announcements />
    </div>
  );
}

export default Leaderboard;