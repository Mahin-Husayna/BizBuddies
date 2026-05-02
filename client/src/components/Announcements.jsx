import { useEffect, useState } from "react";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH ANNOUNCEMENTS
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/announcements")
      .then((res) => res.json())
      .then(setAnnouncements)
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // DELETE ANNOUNCEMENT
  // =========================
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id,
          role: user?.role || "seller",
        }),
      });

      // update UI instantly
      setAnnouncements((prev) =>
        prev.filter((a) => a._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // TYPE STYLES
  // =========================
  const getStyle = (type) => {
    switch (type) {
      case "offer":
        return {
          bg: "from-purple-100 to-pink-100",
          icon: "🔥",
        };
      case "event":
        return {
          bg: "from-blue-100 to-indigo-100",
          icon: "📅",
        };
      case "alert":
        return {
          bg: "from-red-100 to-orange-100",
          icon: "⚠️",
        };
      default:
        return {
          bg: "from-gray-100 to-gray-200",
          icon: "📢",
        };
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-xl p-4 rounded-2xl shadow-md">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📢</span>
        <h2 className="text-md font-semibold text-purple-700">
          Announcements
        </h2>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">

        {announcements.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No announcements yet
          </p>
        ) : (
          announcements.map((a) => {
            const style = getStyle(a.type);

            // ✅ FIXED PERMISSION CHECK
            const canDelete =
              user &&
              (a.createdBy?.toString() === user._id ||
                user.role === "admin");

            return (
              <div
                key={a._id}
                className={`relative group p-3 rounded-xl shadow-sm bg-gradient-to-r ${style.bg} hover:scale-[1.02] transition`}
              >

                {/* ❌ DELETE BUTTON */}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/80 hover:bg-red-500 hover:text-white text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                  >
                    ✕
                  </button>
                )}

                {/* TOP */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-start">
                    <span className="text-lg">{style.icon}</span>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {a.title}
                      </p>

                      <p className="text-xs text-gray-600">
                        {a.message}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 bg-white/70 rounded-full text-gray-700">
                    {a.type}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">

                  {/* ✅ SHOW BUSINESS NAME */}
                  <span>
                    by{" "}
                    {a.role === "admin"
                      ? "Admin"
                      : a.business?.name || "Seller"}
                  </span>

                  <span>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>

                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}

export default Announcements;