import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("update");

  const user = JSON.parse(localStorage.getItem("user"));
  const business = JSON.parse(localStorage.getItem("business"));

  const navigate = useNavigate();

  // =========================
  // 🔒 PERMISSION CHECK (FIXED)
  // =========================
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // ✅ Allow: admin OR user with business
    if (user.role !== "admin" && !business?._id) {
      alert("You must create a business to post announcements");
      navigate("/home");
    }
  }, [user, business, navigate]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          type,
          createdBy: user?._id,

          // ✅ FIXED ROLE (VERY IMPORTANT)
          role: user?.role === "admin" ? "admin" : "seller",

          business: business?._id || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Failed to post announcement");
        return;
      }

      alert("Announcement Posted!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error posting announcement");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* NAVBAR */}
        <Navbar user={user} />

        {/* CARD */}
        <div className="mt-6 max-w-xl mx-auto bg-white/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg">

          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            📢 Create Announcement
          </h1>

          {/* TITLE */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Title</label>
            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* MESSAGE */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Message</label>
            <textarea
              placeholder="Write your announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* TYPE */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="update">📢 Update</option>
              <option value="offer">🔥 Offer</option>
              <option value="event">📅 Event</option>
              <option value="alert">⚠️ Alert</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-medium transition"
            >
              Post Announcement
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateAnnouncement;