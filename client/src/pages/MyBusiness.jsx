import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user._id) return;

    // ✅ FIXED USER ID
    fetch(`http://localhost:5000/api/business/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data);

        if (data && data._id) {
          fetch(
            `http://localhost:5000/api/products/business/${data._id}`
          )
            .then((res) => res.json())
            .then((prod) => setProducts(prod));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const deleteProduct = async (id) => {
    const confirm = window.confirm("Delete this product?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Product deleted");
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4">

        {/* ✅ SIDEBAR ALWAYS VISIBLE */}
        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">

          {/* ✅ NAVBAR ALWAYS VISIBLE */}
          <Navbar user={user} />

          {/* ========================= */}
          {/* 🔴 NO BUSINESS STATE */}
          {/* ========================= */}
          {!business || business.message ? (
            <div className="flex flex-col items-center justify-center mt-20">

              <p className="text-gray-600 text-lg">
                No business found or waiting for admin approval...
              </p>

              <button
                onClick={() => navigate("/create-business")}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl"
              >
                Create Business
              </button>

            </div>
          ) : (
            <>
              {/* ========================= */}
              {/* 🟢 BUSINESS CARD */}
              {/* ========================= */}
              <div className="bg-white/80 p-6 rounded-2xl shadow mb-6">

                {business.coverImage && (
                  <img
                    src={business.coverImage}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                <h1 className="text-2xl font-bold text-gray-800">
                  {business.name}
                </h1>

                <p className="text-gray-600">
                  {business.category}
                </p>

                <p className="text-sm text-gray-700 mt-2">
                  👤 Owner: {business.ownerName}
                </p>

                {/* STATUS */}
                {business.status === "pending" && (
                  <p className="text-yellow-500 mt-2 font-medium">
                    ⏳ Waiting for admin approval
                  </p>
                )}
              </div>

              {/* ADD PRODUCT */}
              {business.status === "approved" && (
                <button
                  onClick={() => navigate("/add-product")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl mb-6"
                >
                  + Add Product
                </button>
              )}

              {/* ========================= */}
              {/* 🟣 PRODUCTS */}
              {/* ========================= */}
              <h2 className="text-xl font-semibold mb-4">
                Your Products
              </h2>

              {products.length === 0 ? (
                <p>No products yet</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">

                  {products.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white/80 p-4 rounded-xl shadow relative group"
                    >

                      {/* DELETE */}
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="absolute top-2 right-2 text-red-500 text-lg opacity-0 group-hover:opacity-100"
                      >
                        ❌
                      </button>

                      {/* IMAGE */}
                      <img
                        src={p.image || "https://via.placeholder.com/150"}
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />

                      {/* NAME */}
                      <h3 className="font-semibold text-sm">
                        {p.name}
                      </h3>

                      {/* PRICE / DISCOUNT */}
                      {p.discount > 0 ? (
                        <>
                          <p className="text-xs line-through text-gray-400">
                            ৳{p.price}
                          </p>
                          <p className="text-purple-600 font-bold">
                            ৳{Math.round(p.discountedPrice)}
                          </p>
                          <p className="text-xs text-red-500">
                            {p.discount}% OFF
                          </p>
                        </>
                      ) : (
                        <p className="text-purple-600 font-bold">
                          ৳{p.price}
                        </p>
                      )}

                      {/* TIMER */}
                      {p.offerEndsAt && (
                        <p className="text-xs text-red-500 mt-1">
                          ⏳ {new Date(p.offerEndsAt).toLocaleString()}
                        </p>
                      )}

                      {/* EDIT */}
                      <button
                        onClick={() => navigate(`/edit-product/${p._id}`)}
                        className="mt-2 text-xs text-blue-500 underline"
                      >
                        Edit
                      </button>

                    </div>
                  ))}

                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyBusiness;