import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(""); // ✅ NEW
  const [discount, setDiscount] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleImageChange = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resBusiness = await fetch(
        `http://localhost:5000/api/business/${user.id}`
      );

      const business = await resBusiness.json();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock); // ✅ NEW
      formData.append("discount", discount || 0);
      formData.append("offerEndsAt", offerEndsAt || "");
      formData.append("seller", business.name);
      formData.append("business", business._id);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product added!");
        navigate("/my-business");
      } else {
        toast.error("Error adding product");
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

            <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />

            {/* ✅ STOCK */}
            <input
              type="number"
              placeholder="Stock Quantity"
              onChange={(e) => setStock(e.target.value)}
            />

            <input
              type="number"
              placeholder="Discount %"
              onChange={(e) => setDiscount(e.target.value)}
            />

            <input
              type="datetime-local"
              onChange={(e) => setOfferEndsAt(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => handleImageChange(e.target.files[0])}
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