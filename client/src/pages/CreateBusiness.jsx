import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function CreateBusiness() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleImageChange = (file) => {
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login again");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("owner", user.id);
      formData.append("ownerName", user.name || "Unknown");

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const res = await fetch("http://localhost:5000/api/business", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Business created 🚀");
        navigate("/my-business");
      } else {
        toast.error(data.message || "Error creating business");
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

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">

          <Navbar user={user} />

          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            Create Your Business
          </h1>

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow max-w-lg flex flex-col gap-4"
          >

            {/* NAME */}
            <input
              placeholder="Business Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />

            {/* CATEGORY */}
            <input
              placeholder="Category (e.g. Bakery)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Describe your business..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />

            {/* IMAGE UPLOAD */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="border p-2 rounded-lg"
            />

            {/* PREVIEW */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Create Business
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateBusiness;