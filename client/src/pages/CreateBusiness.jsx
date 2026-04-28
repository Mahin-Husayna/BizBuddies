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
    if (!file) return;
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
     console.log("BUTTON CLICKED");
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("User not found. Login again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("owner", user._id);
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
        toast.success("Sent for admin approval");
        navigate("/my-business");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
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
            Create Your Business
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white/80 p-6 rounded-2xl shadow max-w-lg flex flex-col gap-4"
          >
            <input
              placeholder="Business Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 rounded-lg"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded-lg"
              required
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

            <button className="bg-purple-500 text-white py-3 rounded-xl">
              Create Business
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBusiness;