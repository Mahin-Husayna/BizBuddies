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

  // 🏆 Medal styles
  const getRank = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="w-[300px] flex flex-col gap-4">

      {/* 🏆 LEADERBOARD */}
      <div className="bg-white/50 backdrop-blur-xl p-4 rounded-2xl shadow-md">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-purple-700 flex items-center gap-2">
            🏆 Campus Leaderboard
          </h2>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3">

          {leaders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No rankings yet
            </p>
          ) : (
            leaders.map((item, index) => (
              <div
                key={item._id}
                onClick={() => navigate(`/business/${item._id}`)}
                className="flex items-center justify-between bg-white/70 p-3 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all cursor-pointer"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  {/* 🏅 RANK */}
                  <span className="text-lg font-bold w-6 text-center">
                    {getRank(index)}
                  </span>

                  {/* 🖼 IMAGE */}
                  <img
                    src={
                      item.coverImage ||
                      "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  />

                  {/* INFO */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>

                    {/* ⭐ FIXED RATING */}
                    {item.totalReviews > 0 ? (
                      <p className="text-xs text-gray-500">
                        ⭐ {item.avgRating?.toFixed(1)} • {item.totalReviews} reviews
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No ratings yet
                      </p>
                    )}
                  </div>
                </div>


              </div>
            ))
          )}
        </div>
      </div>

      {/* 📢 ANNOUNCEMENTS */}
      <Announcements />
    </div>
  );
}

export default Leaderboard;