import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 STATUS FLOW
  const statusFlow = ["pending", "processing", "out_for_delivery", "delivered"];

  const statusLabels = {
    pending: "Pending",
    processing: "Processing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${user._id}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error(err));
  }, [user]);

  const getStatusIndex = (status) => {
    return statusFlow.indexOf(status);
  };

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
              const business = order.items[0]?.product?.business;
              const currentIndex = getStatusIndex(order.status);

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
                        Status: {statusLabels[order.status]}
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

                      {/* 💳 PAYMENT */}
                      <p className="text-xs text-gray-500">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
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

                  {/* 📍 DELIVERY */}
                  <div className="mt-4 bg-purple-50 p-3 rounded-xl text-sm text-gray-700">
                    <p>📍 {order.deliveryAddress}</p>

                    {order.deliveryType === "campus" && order.deliveryTime && (
                      <p className="text-xs text-gray-500 mt-1">
                        🕒 {order.deliveryTime}
                      </p>
                    )}
                  </div>

                  {/* 🚀 STATUS TRACKER */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center">
                      {statusFlow.map((status, index) => (
                        <div
                          key={status}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              index <= currentIndex
                                ? "bg-purple-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {index + 1}
                          </div>

                          <p
                            className={`text-[11px] mt-1 text-center ${
                              index <= currentIndex
                                ? "text-purple-600 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {statusLabels[status]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 🗺️ MAP (ONLY IF CUSTOM LOCATION) */}
                  {order.coordinates?.lat && order.coordinates?.lng && (
                    <div className="mt-5 overflow-hidden rounded-xl">
                      <MapContainer
                        center={[
                          order.coordinates.lat,
                          order.coordinates.lng,
                        ]}
                        zoom={15}
                        style={{ height: "220px", width: "100%" }}
                        dragging={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        zoomControl={false}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            order.coordinates.lat,
                            order.coordinates.lng,
                          ]}
                        />
                      </MapContainer>
                    </div>
                  )}

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