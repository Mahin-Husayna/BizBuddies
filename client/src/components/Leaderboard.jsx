

import Announcements from "./Announcements";

function Leaderboard() {
  const leaders = [
    { name: "Brewed Awakenings", score: 4850 },
    { name: "PrintHub", score: 4120 },
    { name: "EcoThreads", score: 3760 },
    { name: "StudyBuddy", score: 3450 },
    { name: "SnackShack", score: 3210 },
  ];

  return (
    <div className="w-[280px] flex flex-col gap-4">

      {/* LEADERBOARD CARD */}
      <div className="bg-white/40 p-4 rounded-2xl">

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md font-semibold text-purple-700">
            Campus Leaderboard
          </h2>
          <span className="text-xs text-purple-500 cursor-pointer">
            View All
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {leaders.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-purple-600">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                </div>
              </div>

              <span className="text-xs text-purple-600 font-semibold">
                {item.score}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* ANNOUNCEMENTS SECTION */}
      <Announcements />

    </div>
  );
}

export default Leaderboard;