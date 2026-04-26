import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBusiness() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("http://localhost:5000/api/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        category,
        owner: user.id,
        ownerName: user.name, // ✅ FIXED
      }),
    });

    if (res.ok) {
      alert("Business created!");
      navigate("/my-business");
    } else {
      alert("Error creating business");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Create Business</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Business Name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />

        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateBusiness;