import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DealsPage() {
  const [products, setProducts] = useState([]);
  const [now, setNow] = useState(new Date());

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH PRODUCTS (MATCH HOMEPAGE)
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================
  // SAME FILTER AS HOMEPAGE
  // =========================
  const deals = products.filter((p) => {
    if (!p.discount || p.discount <= 0) return false;
    if (!p.offerEndsAt) return true;
    return new Date(p.offerEndsAt) > now;
  });

  const getRemainingTime = (endTime) => {
    if (!endTime) return null;

    const diff = new Date(endTime) - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const addToCart = async (productId) => {
    if (!user?._id) return alert("Login first");

    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        productId,
      }),
    });

    alert("Added to cart");
  };

  const requestStock = async (productId) => {
    if (!user?._id) return alert("Login first");

    await fetch("http://localhost:5000/api/cart/request-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        userId: user._id,
      }),
    });

    alert("Stock requested");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar user={user} />

        <div className="mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">
            🔥 All Recent Deals
          </h1>

          {deals.length === 0 ? (
            <p>No deals available right now</p>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {deals.map((product) => {
                const finalPrice =
                  product.discountedPrice || product.price;

                return (
                  <div
                    key={product._id}
                    className="relative bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>

                    <img
                      src={product.image}
                      className="w-full h-36 object-cover rounded mb-3"
                    />

                    <p className="text-xs text-gray-500">
                      {product.business?.name}
                    </p>

                    <h3 className="font-semibold text-sm">
                      {product.name}
                    </h3>

                    <p className="text-gray-400 line-through text-xs">
                      ৳{product.price}
                    </p>

                    <p className="text-purple-600 font-bold text-lg">
                      ৳{Math.round(finalPrice)}
                    </p>

                    {product.stock > 0 ? (
                      <p className="text-green-600 text-xs">
                        In Stock
                      </p>
                    ) : (
                      <p className="text-red-500 text-xs">
                        Out of Stock
                      </p>
                    )}

                    {product.offerEndsAt && (
                      <p className="text-red-500 text-xs">
                        ⏳ {getRemainingTime(product.offerEndsAt)}
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/business/${product.business?._id}`)
                        }
                        className="flex-1 border border-purple-400 text-purple-600 text-xs py-1 rounded"
                      >
                        View
                      </button>

                      {product.stock > 0 ? (
                        <button
                          onClick={() => addToCart(product._id)}
                          className="flex-1 bg-purple-500 text-white text-xs py-1 rounded"
                        >
                          Add
                        </button>
                      ) : (
                        <button
                          onClick={() => requestStock(product._id)}
                          className="flex-1 bg-orange-500 text-white text-xs py-1 rounded"
                        >
                          Request
                        </button>
                      )}
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

export default DealsPage;