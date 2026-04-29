import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${user._id}`)
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar user={user} />

        <div className="bg-white/60 p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => {
              const business =
                order.items[0]?.product?.business;

              return (
                <div
                  key={order._id}
                  className="mb-6 p-5 bg-white rounded-xl shadow"
                >
                  {/* 🔝 TOP SECTION */}
                  <div className="flex items-center gap-4 mb-4">

                    {/* 🏪 BUSINESS IMAGE */}
                    <img
                      src={
                        business?.coverImage ||
                        "https://via.placeholder.com/80"
                      }
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">
                        {business?.name || "Unknown Business"}
                      </h2>

                      <p className="text-sm text-gray-500">
                        Status: {order.status}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* 💰 PRICE */}
                    <div className="text-right">
                      <p className="text-purple-600 font-bold text-lg">
                        ৳{Math.round(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* 🧾 PRODUCT LIST */}
                  <div className="border-t pt-3 space-y-1">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.product?.name}
                        </span>

                        <span className="text-gray-500">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;