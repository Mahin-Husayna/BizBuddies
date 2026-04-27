import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateBusiness() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("owner", user.id);
      formData.append("ownerName", user.name || "Unknown"); // ✅ FIX
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await fetch("http://localhost:5000/api/business", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Business created!");
        navigate("/home");
      } else {
        toast.error(data.message || "Error creating business");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">
        Create Business
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Business Name"
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        <textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        <input
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        <input
          type="file"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />

        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg">
          Create Business
        </button>
      </form>
    </div>
  );
}

export default CreateBusiness;