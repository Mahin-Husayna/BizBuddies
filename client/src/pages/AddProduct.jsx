import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    // First get user's business
    const resBusiness = await fetch(
      `http://localhost:5000/api/business/${user.id}`
    );
    const business = await resBusiness.json();

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        image,
        seller: business.name,
        business: business._id,
      }),
    });

    if (res.ok) {
      alert("Product added!");
      navigate("/home");
    } else {
      alert("Error adding product");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Product Name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Image URL"
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 w-full"
        />

        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;