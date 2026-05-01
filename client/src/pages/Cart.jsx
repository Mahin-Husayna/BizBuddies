import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LocationPicker from "../components/LocationPicker";

function Cart() {
  const [cart, setCart] = useState(null);

  const [deliveryType, setDeliveryType] = useState("campus");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // 🆕 NEW
  const [coords, setCoords] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH CART
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5000/api/cart/${user._id}`)
      .then((res) => res.json())
      .then(setCart)
      .catch((err) => console.error(err));
  }, [user]);

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (productId, type) => {
    const res = await fetch("http://localhost:5000/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        productId,
        type,
      }),
    });

    const data = await res.json();
    setCart(data);
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (productId) => {
    const res = await fetch("http://localhost:5000/api/cart/remove", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        productId,
      }),
    });

    const data = await res.json();
    setCart(data);
  };

  // =========================
  // CALCULATE TOTAL
  // =========================
  const getTotal = () => {
    if (!cart) return 0;

    return cart.items.reduce((acc, item) => {
      const price =
        item.product.discount > 0
          ? item.product.discountedPrice
          : item.product.price;

      return acc + price * item.quantity;
    }, 0);
  };

  // =========================
  // CHECKOUT
  // =========================
  const handleCheckout = async () => {
    if (deliveryType === "other") {
      if (!deliveryAddress.trim()) {
        alert("Please enter delivery address");
        return;
      }

      if (!coords) {
        alert("Please select location on map");
        return;
      }
    }

    if (deliveryType === "campus" && !deliveryTime) {
      alert("Please select delivery time");
      return;
    }

    const res = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        deliveryAddress:
          deliveryType === "campus"
            ? `On-campus at ${deliveryTime}`
            : deliveryAddress,

        // 🆕 NEW DATA
        paymentMethod,
        coordinates: deliveryType === "other" ? coords : null,
      }),
    });

    if (res.ok) {
      alert("Order placed successfully!");
      window.location.reload();
    } else {
      alert("Checkout failed");
    }
  };

  if (!cart) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar user={user} />

        <div className="mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-6">

          <h1 className="text-2xl font-bold mb-6">My Cart</h1>

          {/* EMPTY STATE */}
          {cart.items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              {/* ITEMS */}
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const price =
                    item.product.discount > 0
                      ? item.product.discountedPrice
                      : item.product.price;

                  return (
                    <div
                      key={item.product._id}
                      className="flex justify-between items-center bg-white/80 p-4 rounded-xl shadow"
                    >
                      {/* LEFT */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.product.image}
                          className="w-16 h-16 rounded object-cover"
                        />

                        <div>
                          <p className="font-semibold">
                            {item.product.name}
                          </p>

                          <p className="text-purple-600">
                            ৳{Math.round(price)}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-4">

                        {/* QUANTITY */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product._id, "dec")
                            }
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.product._id, "inc")
                            }
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() =>
                            removeItem(item.product._id)
                          }
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DELIVERY */}
              <div className="mt-6">
                <p className="font-semibold mb-2">Delivery Option</p>

                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => setDeliveryType("campus")}
                    className={`px-4 py-2 rounded ${
                      deliveryType === "campus"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    On-campus
                  </button>

                  <button
                    onClick={() => setDeliveryType("other")}
                    className={`px-4 py-2 rounded ${
                      deliveryType === "other"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Other Address
                  </button>
                </div>

                {deliveryType === "campus" ? (
                  <input
                    type="datetime-local"
                    value={deliveryTime}
                    onChange={(e) =>
                      setDeliveryTime(e.target.value)
                    }
                    className="w-full p-2 rounded border"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter delivery address"
                      value={deliveryAddress}
                      onChange={(e) =>
                        setDeliveryAddress(e.target.value)
                      }
                      className="w-full p-2 rounded border"
                    />

                    {/* 🆕 MAP */}
                    <LocationPicker setCoords={setCoords} />
                  </>
                )}
              </div>

              {/* 💳 PAYMENT */}
              <div className="mt-6">
                <p className="font-semibold mb-2">Payment Method</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`px-4 py-2 rounded ${
                      paymentMethod === "cod"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Cash on Delivery
                  </button>

                  <button
                    onClick={() => setPaymentMethod("online")}
                    className={`px-4 py-2 rounded ${
                      paymentMethod === "online"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Online Payment
                  </button>
                </div>
              </div>

              {/* TOTAL */}
              <div className="mt-6 flex justify-between items-center">
                <p className="text-lg font-semibold">
                  Total: ৳{Math.round(getTotal())}
                </p>

                <button
                  onClick={handleCheckout}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg"
                >
                  Checkout
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Cart;