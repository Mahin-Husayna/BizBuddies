import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBusinesses();
    fetchStats();
  }, []);

  const fetchBusinesses = async () => {
    const res = await fetch("http://localhost:5000/api/business/admin/all");
    const data = await res.json();
    setBusinesses(data);
  };

  const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/business/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  const handleAction = async (id, action) => {
    await fetch(
      `http://localhost:5000/api/business/admin/${action}/${id}`,
      { method: "PUT" }
    );

    toast.success(`Business ${action}ed`);
    fetchBusinesses(); // 🔥 refresh instantly
  };

  if (!user || user.role !== "admin") {
    return <div className="p-10">Access Denied</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4">

        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">

          <Navbar user={user} />

          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            Admin Dashboard
          </h1>

          {/* STATS */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">

              <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow">
                👥 Users: {stats.totalUsers}
              </div>

              <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow">
                🏪 Businesses: {stats.totalBusinesses}
              </div>

              <div className="bg-yellow-100 p-4 rounded-xl shadow">
                ⏳ Pending: {stats.pendingBusinesses}
              </div>

              <div className="bg-green-100 p-4 rounded-xl shadow">
                ✅ Approved: {stats.approvedBusinesses}
              </div>

            </div>
          )}

          {/* BUSINESS LIST */}
          <div className="grid gap-6">

            {businesses.map((b) => (
              <div
                key={b._id}
                className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow flex gap-6"
              >

                {/* IMAGE */}
                <img
                  src={b.coverImage || "https://via.placeholder.com/150"}
                  className="w-40 h-28 object-cover rounded-xl"
                />

                {/* DETAILS */}
                <div className="flex-1">

                  <h2 className="text-lg font-bold text-gray-800">
                    {b.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {b.category}
                  </p>

                  <p className="text-sm mt-1">
                    👤 Owner: {b.ownerName}
                  </p>

                  <p className="text-sm mt-1 text-gray-600">
                    {b.description}
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        b.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {b.status}
                  </span>

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2 justify-center">

                  {/* PENDING */}
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(b._id, "approve")
                        }
                        className="bg-green-500 text-white px-4 py-1 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleAction(b._id, "reject")
                        }
                        className="bg-yellow-500 text-white px-4 py-1 rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* APPROVED */}
                  {b.status === "approved" && (
                    <button
                      onClick={() =>
                        handleAction(b._id, "ban")
                      }
                      className="bg-red-500 text-white px-4 py-1 rounded-lg"
                    >
                      Ban
                    </button>
                  )}

                  {/* REJECTED */}
                  {b.status === "rejected" && (
                    <button
                      onClick={() =>
                        handleAction(b._id, "approve")
                      }
                      className="bg-green-500 text-white px-4 py-1 rounded-lg"
                    >
                      Approve Again
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;