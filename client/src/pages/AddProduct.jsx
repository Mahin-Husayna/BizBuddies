import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ GET BUSINESS ID FROM NAVIGATION
  const businessId = location.state?.businessId;

  const handleImageChange = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Business ID:", businessId);

    // 🔥 CRITICAL CHECK
    if (!businessId) {
      toast.error("No business found. Please try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("discount", discount || 0);
      formData.append("offerEndsAt", offerEndsAt || "");
      formData.append("business", businessId);

      // Optional seller name
      formData.append("seller", user?.name || "Seller");

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product added!");
        navigate("/my-business");
      } else {
        console.error(data);
        toast.error(data.message || "Error adding product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <div className="flex gap-4">

        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">
          <Navbar user={user} />

          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            Add Product
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />

            <input
              type="number"
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />

            {/* ✅ STOCK */}
            <input
              type="number"
              placeholder="Stock Quantity"
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />

            <input
              type="number"
              placeholder="Discount %"
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-2 rounded border"
            />

            <input
              type="datetime-local"
              onChange={(e) => setOfferEndsAt(e.target.value)}
              className="w-full p-2 rounded border"
            />

            <input
              type="file"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="w-full p-2 rounded border"
            />

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <button className="bg-purple-500 text-white px-4 py-2 rounded">
              Add Product
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;