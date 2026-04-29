import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Cart() {
  const [cart, setCart] = useState({ items: [] });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    const res = await fetch(`http://localhost:5000/api/cart/${user._id}`);
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    await fetch("http://localhost:5000/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cart._id,
        productId,
        quantity: qty,
      }),
    });

    fetchCart();
  };

  const removeItem = async (productId) => {
    await fetch("http://localhost:5000/api/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cart._id,
        productId,
      }),
    });

    fetchCart();
  };

  const total = cart.items.reduce((sum, item) => {
    const price =
      item.product.discount > 0
        ? item.product.discountedPrice
        : item.product.price;

    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar user={user} />

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">My Cart</h1>

          {cart.items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.product.image ||
                          "https://via.placeholder.com/100"
                        }
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-purple-600 font-bold">
                          ৳
                          {item.product.discount > 0
                            ? Math.round(item.product.discountedPrice)
                            : item.product.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {item.product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQty(item.product._id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => {
                          if (item.quantity >= item.product.stock) {
                            alert("Not enough stock");
                            return;
                          }

                          updateQty(item.product._id, item.quantity + 1);
                        }}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <h2 className="text-xl font-bold">
                  Total: ৳{Math.round(total)}
                </h2>
                <button
  onClick={async () => {
    const res = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Order placed successfully ✅");
    window.location.reload();
  }}
  className="bg-purple-500 text-white px-6 py-2 rounded-xl"
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