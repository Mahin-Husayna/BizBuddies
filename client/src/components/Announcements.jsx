import { useEffect, useState } from "react";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch(() => console.log("No announcements yet"));
  }, []);

  return (
    <div className="bg-white/40 p-4 rounded-2xl mt-4">
      <h2 className="text-lg font-semibold mb-3 text-purple-700">
        📢 Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-sm text-gray-500">
          No announcements yet
        </p>
      ) : (
        announcements.map((a) => (
          <div
            key={a._id}
            className="bg-white p-3 rounded-lg mb-2 shadow"
          >
            <p className="text-sm font-medium">{a.title}</p>
            <p className="text-xs text-gray-600">{a.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Announcements;