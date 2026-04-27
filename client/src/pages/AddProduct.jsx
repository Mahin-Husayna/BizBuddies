import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // IMAGE PREVIEW
  const handleImageChange = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // get business
      const resBusiness = await fetch(
        `http://localhost:5000/api/business/${user.id}`
      );
      const business = await resBusiness.json();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("seller", business.name);
      formData.append("business", business._id);

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product added successfully 🚀");
        navigate("/my-business");
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4 items-start">

        <Sidebar />

        <div className="flex-1 bg-white/40 p-6 rounded-2xl">

          <Navbar user={user} />

          <h1 className="text-2xl font-bold mb-6 text-purple-700">
            Add Product
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-md"
          >

            {/* NAME */}
            <input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded"
              required
            />

            {/* PRICE */}
            <input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 rounded"
              required
            />

            {/* IMAGE UPLOAD */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="border p-2 rounded"
              required
            />

            {/* IMAGE PREVIEW */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded"
              />
            )}

            {/* BUTTON */}
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:scale-105 transition">
              Add Product
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddProduct;