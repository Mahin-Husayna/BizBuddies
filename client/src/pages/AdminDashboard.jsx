import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    const businessRes = await fetch("http://localhost:5000/api/business/admin/all");
    const businessData = await businessRes.json();
    setBusinesses(businessData);

    const statsRes = await fetch("http://localhost:5000/api/business/admin/stats");
    const statsData = await statsRes.json();
    setStats(statsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveBusiness = async (id) => {
    await fetch(`http://localhost:5000/api/business/admin/approve/${id}`, {
      method: "PUT",
    });

    toast.success("Business approved");
    fetchData();
  };

  const rejectBusiness = async (id) => {
    await fetch(`http://localhost:5000/api/business/admin/reject/${id}`, {
      method: "PUT",
    });

    toast.error("Business rejected");
    fetchData();
  };

  const banBusiness = async (id) => {
    const confirmBan = window.confirm("Are you sure you want to ban this business?");
    if (!confirmBan) return;

    await fetch(`http://localhost:5000/api/business/admin/ban/${id}`, {
      method: "PUT",
    });

    toast.error("Business banned");
    fetchData();
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only admins can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        Admin Dashboard
      </h1>

      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white/70 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Users</p>
            <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
          </div>

          <div className="bg-white/70 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Businesses</p>
            <h2 className="text-2xl font-bold">{stats.totalBusinesses}</h2>
          </div>

          <div className="bg-white/70 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-500">
              {stats.pendingBusinesses}
            </h2>
          </div>

          <div className="bg-white/70 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Approved</p>
            <h2 className="text-2xl font-bold text-green-600">
              {stats.approvedBusinesses}
            </h2>
          </div>

          <div className="bg-white/70 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Banned</p>
            <h2 className="text-2xl font-bold text-red-500">
              {stats.bannedBusinesses}
            </h2>
          </div>
        </div>
      )}

      <div className="bg-white/70 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Business Requests</h2>

        {businesses.length === 0 ? (
          <p>No businesses found.</p>
        ) : (
          <div className="space-y-4">
            {businesses.map((business) => (
              <div
                key={business._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.category}</p>
                  <p className="text-sm">Owner: {business.ownerName}</p>

                  <p
                    className={`text-sm font-semibold mt-1 ${
                      business.status === "approved"
                        ? "text-green-600"
                        : business.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-500"
                    }`}
                  >
                    Status: {business.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  {business.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveBusiness(business._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectBusiness(business._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {business.status !== "banned" && (
                    <button
                      onClick={() => banBusiness(business._id)}
                      className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                      Ban
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;