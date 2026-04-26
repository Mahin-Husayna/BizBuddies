import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH DATA
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/business/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data);
        return fetch(
          `http://localhost:5000/api/products/business/${data._id}`
        );
      })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => toast.error("Failed to load data"));
  }, []);

  // DELETE BUSINESS
  const handleDeleteBusiness = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your business?"
    );
    if (!confirmDelete) return;

    await fetch(
      `http://localhost:5000/api/business/${business._id}`,
      { method: "DELETE" }
    );

    toast.success("Business deleted");
    navigate("/home");
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });

    setProducts(products.filter((p) => p._id !== id));
    toast.success("Product deleted");
  };

  // EDIT PRODUCT
  const handleEditProduct = (product) => {
    navigate(`/edit-product/${product._id}`, { state: product });
  };

  if (!business) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <div className="flex gap-4 items-start">

        <Sidebar />

        <div className="flex-1 bg-white/40 p-6 rounded-2xl">

          <Navbar user={user} />

          {/* BUSINESS INFO */}
          <h1 className="text-2xl font-bold text-purple-700">
            {business.name}
          </h1>

          <p className="mt-2 text-gray-700">{business.description}</p>

          <p className="text-sm text-gray-500">
            Category: {business.category}
          </p>

          <p className="text-sm mt-1">
            👤 Owner: {business.ownerName}
          </p>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-6">

            <button
              onClick={() => navigate("/add-product")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg"
            >
              + Add Product
            </button>

            <button
              onClick={handleDeleteBusiness}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete Business
            </button>

          </div>

          {/* PRODUCTS */}
          <h2 className="text-lg font-semibold mt-8 mb-4">
            Your Products
          </h2>

          <div className="grid grid-cols-3 gap-4">

            {products.map((p) => (
              <div
                key={p._id}
                className="relative bg-white p-4 rounded-xl shadow group"
              >

                {/* DELETE ICON */}
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm("Are you sure?");
                    if (confirmDelete) handleDeleteProduct(p._id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>

                {/* EDIT ICON */}
                <button
                  onClick={() => handleEditProduct(p)}
                  className="absolute top-2 right-10 bg-blue-500 hover:bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✎
                </button>

                <img
                  src={p.image}
                  className="w-full h-24 object-cover rounded mb-2"
                />

                <h3 className="font-medium">{p.name}</h3>

                <p className="text-purple-600">৳{p.price}</p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default MyBusiness;