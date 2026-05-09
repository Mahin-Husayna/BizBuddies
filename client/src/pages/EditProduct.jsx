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
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [offerEndsAt, setOfferEndsAt] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // =========================
  // FETCH PRODUCT
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p) => p._id === id);

        if (product) {
          setName(product.name || "");
          setPrice(product.price || "");
          setStock(product.stock || "");
          setDescription(product.description || "");
          setDiscount(product.discount || "");
          setOfferEndsAt(
            product.offerEndsAt
              ? product.offerEndsAt.slice(0, 16)
              : ""
          );

          setPreview(product.image || "");
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("description", description);
      formData.append("discount", discount);
      formData.append("offerEndsAt", offerEndsAt);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        toast.success("Product updated successfully ✨");
        navigate("/my-business");
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">

          <Navbar user={user} />

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Product
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Update your product information
            </p>
          </div>

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow max-w-2xl flex flex-col gap-5"
          >

            {/* PRODUCT NAME */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Product Name
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* PRICE + STOCK */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Price (৳)
                </p>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Stock
                </p>

                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Available quantity"
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Description
              </p>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                rows={4}
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            {/* DISCOUNT + OFFER */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </p>

                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Optional"
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Offer Ends At
                </p>

                <input
                  type="datetime-local"
                  value={offerEndsAt}
                  onChange={(e) => setOfferEndsAt(e.target.value)}
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

            </div>

            {/* IMAGE */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Product Image
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e.target.files[0])
                }
                className="w-full border p-2 rounded-xl bg-white"
              />
            </div>

            {/* PREVIEW */}
            {preview && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview
                </p>

                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-52 object-cover rounded-xl border"
                />
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">

              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition font-medium"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => navigate("/my-business")}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl transition font-medium"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;