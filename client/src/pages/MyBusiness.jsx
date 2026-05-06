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

    fetch(`http://localhost:5000/api/business/user/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data);
        localStorage.setItem("business", JSON.stringify(data));

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
        { method: "DELETE" }
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
        <Sidebar />

        <div className="flex-1 bg-white/50 backdrop-blur-xl p-6 rounded-2xl shadow">

          <Navbar user={user} />

          {!business || business.message ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <p className="text-gray-600 text-lg">
                No business found or waiting for admin approval...
              </p>

              <button
                onClick={() => navigate("/create-business")}
                className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg"
              >
                Create Business
              </button>
            </div>
          ) : (
            <>
              {/* ACTION BAR */}
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  My Business
                </h2>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate("/seller-dashboard")}
                    className="bg-white border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
                  >
                    📊 Dashboard
                  </button>

                  <button
                    onClick={() => navigate("/insights")}
                    className="bg-white border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
                  >
                    📈 Insights
                  </button>

                  <button
                    onClick={() => navigate("/create-announcement")}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                  >
                    📢 Post Announcement
                  </button>
                </div>
              </div>

              {/* BUSINESS CARD */}
              <div className="bg-white p-6 rounded-2xl shadow mb-6">

                {business.coverImage && (
                  <img
                    src={business.coverImage}
                    className="w-full h-44 object-cover rounded-xl mb-4"
                  />
                )}

                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {business.name}
                    </h1>

                    <p className="text-gray-500 text-sm">
                      {business.category}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      👤 Owner: {business.ownerName}
                    </p>

                    {business.status === "pending" && (
                      <p className="text-yellow-500 mt-2 text-sm">
                        ⏳ Waiting for admin approval
                      </p>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Are you sure? This will delete your business and ALL products."
                      );
                      if (!confirmDelete) return;

                      try {
                        const res = await fetch(
                          `http://localhost:5000/api/business/${business._id}`,
                          { method: "DELETE" }
                        );

                        if (res.ok) {
                          toast.success("Business deleted successfully");
                          setBusiness(null);
                          setProducts([]);
                        } else {
                          toast.error("Failed to delete business");
                        }
                      } catch (err) {
                        toast.error("Server error");
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>

              {/* ADD PRODUCT */}
              {business.status === "approved" && (
                <button
                  onClick={() =>
                    navigate("/add-product", {
                      state: { businessId: business._id },
                    })
                  }
                  className="bg-purple-500 text-white px-5 py-2 rounded-lg mb-6"
                >
                  + Add Product
                </button>
              )}

              {/* PRODUCTS */}
              <h2 className="text-lg font-semibold mb-4">
                Your Products
              </h2>

              {products.length === 0 ? (
                <p>No products yet</p>
              ) : (
                <div className="grid grid-cols-3 gap-5">

                  {products.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition relative group"
                    >

                      {/* DELETE */}
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>

                      {/* IMAGE */}
                      <img
                        src={p.image || "https://via.placeholder.com/150"}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />

                      {/* NAME */}
                      <h3 className="font-semibold text-sm text-gray-800">
                        {p.name}
                      </h3>

                      {/* PRICE */}
                      {p.discount > 0 ? (
                        <>
                          <p className="text-xs text-gray-400 line-through">
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
                        className="mt-2 text-xs text-purple-600 hover:underline"
                      >
                        Edit Product
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