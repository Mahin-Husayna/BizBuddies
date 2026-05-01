import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Insights() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const business = JSON.parse(localStorage.getItem("business"));

  useEffect(() => {
    if (!business?._id) return;

    fetch(`http://localhost:5000/api/orders/insights/${business._id}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.error(err));
  }, [business]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* NAVBAR */}
        <Navbar user={user} />

        {/* CONTENT */}
        <div className="mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-6">

          {/* HEADER */}
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            📊 Business Insights
          </h1>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 gap-6">

            {/* REVENUE */}
            <div className="bg-white/80 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <p className="text-sm text-gray-500 mb-2">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold text-purple-600">
                ৳{stats.revenue}
              </h2>
            </div>

            {/* ORDERS */}
            <div className="bg-white/80 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <p className="text-sm text-gray-500 mb-2">
                Total Orders
              </p>

              <h2 className="text-3xl font-bold text-purple-600">
                {stats.orders}
              </h2>
            </div>

          </div>

          {/* FUTURE SECTION (optional placeholder) */}
          <div className="mt-8 bg-white/70 p-6 rounded-xl shadow text-center text-gray-500">
            📈 More analytics coming soon (monthly charts, engagement, etc.)
          </div>

        </div>
      </div>
    </div>
  );
}

export default Insights;