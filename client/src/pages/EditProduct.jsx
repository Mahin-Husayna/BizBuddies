import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function EditProduct() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState(state.name);
  const [price, setPrice] = useState(state.price);
  const [image, setImage] = useState(state.image);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:5000/api/products/${state._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, image }),
      }
    );

    toast.success("Product updated");
    navigate("/my-business");
  };

  return (
    <div className="p-10">
      <h2 className="text-xl mb-4">Edit Product</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-80">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="p-2 border rounded"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="p-2 border rounded"
        />

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="p-2 border rounded"
        />

        <button className="bg-purple-500 text-white p-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditProduct;