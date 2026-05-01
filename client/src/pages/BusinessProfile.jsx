import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function BusinessProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]); // 🔥 NEW

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetch(`http://localhost:5000/api/business/single/${id}`)
      .then((res) => res.json())
      .then((data) => setBusiness(data))
      .catch((err) => console.error(err));

    fetch(`http://localhost:5000/api/products/business/${id}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    // 🔥 FETCH REVIEWS
    fetch(`http://localhost:5000/api/reviews/${id}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch((err) => console.error(err));
  }, [id]);

  // =========================
  // 💬 MESSAGE SELLER
  // =========================
  const handleMessageSeller = async () => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      const sellerId =
        typeof business.owner === "object"
          ? business.owner._id
          : business.owner;

      if (!sellerId) {
        alert("Seller not found");
        return;
      }

      const res = await fetch("http://localhost:5000/api/messages/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: sellerId,
          productId: null,
        }),
      });

      const convo = await res.json();

      localStorage.setItem("activeChat", convo._id);
      navigate("/messages");
    } catch (err) {
      console.error(err);
      alert("Error starting chat");
    }
  };

  // =========================
  // 🛒 ADD TO CART
  // =========================
  const addToCart = async (productId) => {
    try {
      if (!user) {
        alert("Login first");
        return;
      }

      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
        }),
      });

      if (!res.ok) {
        alert("Failed to add to cart");
        return;
      }

      alert("Added to cart");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // =========================
  // 📦 REQUEST STOCK
  // =========================
  const requestStock = async (productId) => {
    try {
      if (!user) {
        alert("Login first");
        return;
      }

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

      alert("Stock request sent");
    } catch (err) {
      console.error(err);
      alert("Error requesting stock");
    }
  };

  if (!business) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <Sidebar />

      <div className="flex-1 p-6">

        <Navbar user={user} />

        {/* BUSINESS CARD */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden mt-4">

          <img
            src={business.coverImage || "https://via.placeholder.com/800x300"}
            className="w-full h-64 object-cover"
          />

          <div className="p-6">

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center text-2xl">
                  🏪
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    {business.name}
                  </h1>

                  <p className="text-sm text-gray-600">
                    {business.category}
                  </p>

                  <p className="text-gray-700 text-sm mt-2">
                    👤 {business.ownerName}
                  </p>

                  {/* ⭐ RATING */}
                  <p className="text-yellow-500 mt-1">
                    ⭐ {business.averageRating?.toFixed(1) || 0} ({business.totalReviews || 0})
                  </p>
                </div>
              </div>

              <button
                onClick={handleMessageSeller}
                className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:opacity-90 shadow"
              >
                💬 Message Seller
              </button>
            </div>

            <p className="mt-4 text-gray-700">
              {business.description}
            </p>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Products
          </h2>

          {products.length === 0 ? (
            <p>No products yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">

              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/70 p-4 rounded-xl shadow"
                >

                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    className="w-full h-28 object-cover rounded mb-2"
                  />

                  <h3 className="text-sm font-semibold">
                    {product.name}
                  </h3>

                  {/* PRICE */}
                  {product.discount > 0 ? (
                    <>
                      <p className="text-xs text-gray-400 line-through">
                        ৳{product.price}
                      </p>
                      <p className="text-purple-600 font-bold">
                        ৳{Math.round(product.discountedPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="text-purple-600 font-bold">
                      ৳{product.price}
                    </p>
                  )}

                  {/* STOCK */}
                  {product.stock > 0 ? (
                    <p className="text-green-600 text-xs mt-1">
                      In Stock ({product.stock})
                    </p>
                  ) : (
                    <p className="text-red-500 text-xs mt-1">
                      Out of Stock
                    </p>
                  )}

                  {/* OFFER */}
                  {product.offerEndsAt && (
                    <p className="text-red-500 text-xs mt-1">
                      Limited Offer
                    </p>
                  )}

                  {/* ACTION */}
                  <div className="mt-3">
                    {product.stock > 0 ? (
                      <button
                        onClick={() => addToCart(product._id)}
                        className="bg-purple-500 text-white text-xs px-3 py-1 rounded-lg hover:scale-105 transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => requestStock(product._id)}
                        className="bg-orange-500 text-white text-xs px-3 py-1 rounded-lg hover:scale-105 transition"
                      >
                        Request Stock
                      </button>
                    )}
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* 🔥 REVIEWS SECTION */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded-xl shadow mb-3"
              >
                <p className="font-semibold">{r.user.name}</p>
                <p className="text-yellow-500">⭐ {r.rating}</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default BusinessProfile;