import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LocationPicker from "../components/LocationPicker";

function Cart() {
  const [cart, setCart] = useState(null);

  const [deliveryType, setDeliveryType] = useState("campus");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const [coords, setCoords] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [gateway, setGateway] = useState("");
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [processing, setProcessing] = useState(false);

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
  // DELIVERY FEE
  // =========================
  const getDeliveryFee = () => {
    return deliveryType === "campus" ? 0 : 60;
  };

  // =========================
  // UPDATE QUANTITY (WITH STOCK CHECK)
  // =========================
  const updateQuantity = async (productId, type, currentQty, stock) => {
    if (type === "inc" && currentQty >= stock) {
      alert("Cannot add more items. Not enough stock available.");
      return;
    }

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
  // TOTAL
  // =========================
  const getSubtotal = () => {
    if (!cart) return 0;

    return cart.items.reduce((acc, item) => {
      const price =
        item.product.discount > 0
          ? item.product.discountedPrice
          : item.product.price;

      return acc + price * item.quantity;
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async () => {
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
        alert("Select map location");
        return;
      }
    }

    if (deliveryType === "campus" && !deliveryTime) {
      alert("Select delivery time");
      return;
    }

    if (paymentMethod === "online") {
      if (!gateway) {
        alert("Select payment option");
        return;
      }

      if (gateway === "bkash") {
        setShowBkashModal(true);
        return;
      }
    }

    await placeOrder();
  };

  if (!cart) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar user={user} />

        <div className="mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-6">

          <h1 className="text-2xl font-bold mb-6">My Cart</h1>

          {cart.items.length === 0 ? (
            <p>Your cart is empty</p>
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
                    <div key={item.product._id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow">

                      <div className="flex gap-4 items-center">
                        <img src={item.product.image} className="w-16 h-16 rounded" />
                        <div>
                          <p>{item.product.name}</p>
                          <p className="text-purple-600">৳{Math.round(price)}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <button onClick={() => updateQuantity(item.product._id, "dec", item.quantity, item.product.stock)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, "inc", item.quantity, item.product.stock)}>+</button>

                        <button onClick={() => removeItem(item.product._id)} className="text-red-500">
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DELIVERY */}
              <div className="mt-6">
                <p className="font-semibold mb-2">Delivery</p>

                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => setDeliveryType("campus")}
                    className={deliveryType === "campus" ? "bg-purple-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
                  >
                    Campus Delivery
                  </button>

                  <button
                    onClick={() => setDeliveryType("other")}
                    className={deliveryType === "other" ? "bg-purple-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
                  >
                    Other Address
                  </button>
                </div>

                {deliveryType === "campus" ? (
                  <input type="datetime-local" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                ) : (
                  <>
                    <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <LocationPicker setCoords={setCoords} />
                  </>
                )}
              </div>

              {/* PAYMENT */}
              <div className="mt-6">
                <p className="font-semibold mb-2">Payment</p>

                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => {setPaymentMethod("cod"); setGateway("");}}
                    className={paymentMethod === "cod" ? "bg-purple-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
                  >
                    Cash on Delivery
                  </button>

                  <button
                    onClick={() => setPaymentMethod("online")}
                    className={paymentMethod === "online" ? "bg-purple-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
                  >
                    Online Payment
                  </button>
                </div>

                {paymentMethod === "online" && (
                  <button
                    onClick={() => setGateway("bkash")}
                    className={gateway === "bkash" ? "bg-pink-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
                  >
                    bKash
                  </button>
                )}
              </div>

              {/* TOTAL SECTION */}
              <div className="mt-6 bg-white p-5 rounded-xl shadow space-y-2">

                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{Math.round(getSubtotal())}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>৳{getDeliveryFee()}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>৳{Math.round(getTotal())}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg"
                >
                  Place Order
                </button>

              </div>
            </>
          )}
        </div>
      </div>

      {/* BKASH MODAL */}
      {showBkashModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="w-[340px] bg-white rounded-lg overflow-hidden shadow-xl">

            <div className="bg-pink-600 text-white p-4 text-center font-bold text-lg">
              bKash Payment
            </div>

            <div className="p-4 space-y-3">

              <div className="flex justify-between text-sm">
                <span>Total Amount</span>
                <span>৳{Math.round(getTotal())}</span>
              </div>

              <input placeholder="bKash Number (01XXXXXXXXX)" className="w-full p-2 border rounded" />
              <input type="password" placeholder="Enter PIN" className="w-full p-2 border rounded" />

            </div>

            <div className="flex">
              <button onClick={() => setShowBkashModal(false)} className="w-1/2 py-3 bg-gray-200">
                Cancel
              </button>

              <button
                onClick={() => {
                  setProcessing(true);
                  setTimeout(async () => {
                    setProcessing(false);
                    setShowBkashModal(false);
                    alert("Payment Successful");
                    await placeOrder();
                  }, 1500);
                }}
                className="w-1/2 py-3 bg-pink-600 text-white"
              >
                {processing ? "Processing..." : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;