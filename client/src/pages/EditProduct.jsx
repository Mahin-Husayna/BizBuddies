import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p._id === id);

        if (product) {
          setName(product.name || "");
          setPrice(product.price || "");
          setDiscount(product.discount || "");
          setPreview(product.image || "");

          if (product.offerEndsAt) {
            const formattedDate = new Date(product.offerEndsAt)
              .toISOString()
              .slice(0, 16);

            setOfferEndsAt(formattedDate);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleImageChange = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount || 0);
      formData.append("offerEndsAt", offerEndsAt || "");

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product updated successfully!");
        navigate("/my-business");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <div className="flex gap-4 items-start">
        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">
          <Navbar user={user} />

          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            Edit Product
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow max-w-lg flex flex-col gap-4"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="number"
              placeholder="Discount % (optional)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Limited-time offer ends at (optional)
              </label>
              <input
                type="datetime-local"
                value={offerEndsAt}
                onChange={(e) => setOfferEndsAt(e.target.value)}
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 w-full"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="border p-2 rounded-lg"
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;