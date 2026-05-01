import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function SellerDashboard() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const business = JSON.parse(localStorage.getItem("business"));

  // 🔥 NEW STATUS FLOW
  const statusFlow = ["pending", "processing", "out_for_delivery", "delivered"];

  const statusLabels = {
    pending: "Pending",
    processing: "Processing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
  };

  // =========================
  // FETCH ORDERS
  // =========================
  useEffect(() => {
    if (!business?._id) return;

    fetch(`http://localhost:5000/api/orders/seller/${business._id}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error(err));
  }, [business]);

  // 🔥 GET NEXT STATUS
  const getNextStatus = (current) => {
    const index = statusFlow.indexOf(current);
    return statusFlow[index + 1] || null;
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (orderId, nextStatus) => {
    const res = await fetch(
      `http://localhost:5000/api/orders/status/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      }
    );

    const updated = await res.json();

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
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

        <div className="mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-6">

          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            📦 Seller Orders
          </h1>

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">

              {orders.map((order) => {
                const nextStatus = getNextStatus(order.status);

                return (
                  <div
                    key={order._id}
                    className="bg-white/80 p-5 rounded-xl shadow-md hover:shadow-lg transition"
                  >

                    {/* TOP ROW */}
                    <div className="flex justify-between items-start">

                      {/* LEFT SIDE */}
                      <div>

                        {/* STATUS BADGE */}
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium
                            ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {statusLabels[order.status]}
                        </span>

                        {/* PRODUCTS */}
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index}>
                              {item.product?.name} × {item.quantity}
                            </p>
                          ))}
                        </div>

                        {/* ADDRESS */}
                        <p className="mt-2 text-sm text-gray-600">
                          📍 {order.deliveryAddress}
                        </p>

                        {/* DELIVERY TIME */}
                        {order.deliveryType === "campus" && order.deliveryTime && (
                          <p className="text-xs text-gray-500">
                            🕒 {order.deliveryTime}
                          </p>
                        )}

                        {/* PAYMENT */}
                        <p className="text-xs text-gray-500 mt-1">
                          💳{" "}
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </p>

                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex flex-col items-end gap-3">

                        {/* TOTAL */}
                        <span className="text-purple-600 font-bold text-lg">
                          ৳{Math.round(order.totalAmount)}
                        </span>

                        {/* 🔥 SMART BUTTON */}
                        {nextStatus && (
                          <button
                            onClick={() =>
                              updateStatus(order._id, nextStatus)
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                          >
                            Mark {statusLabels[nextStatus]}
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;