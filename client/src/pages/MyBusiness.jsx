import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(`http://localhost:5000/api/business/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setBusiness(data);

        return fetch(
          `http://localhost:5000/api/products/business/${data._id}`
        );
      })
      .then(res => res.json())
      .then(productsData => setProducts(productsData))
      .catch(err => console.error(err));
  }, []);

  // 🗑️ DELETE BUSINESS FUNCTION
  const handleDeleteBusiness = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your business?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `http://localhost:5000/api/business/${business._id}`,
        {
          method: "DELETE",
        }
      );

      alert("Business deleted successfully");

      // redirect to homepage
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Error deleting business");
    }
  };

  if (!business) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">

      {/* BUSINESS INFO */}
      <h1 className="text-3xl font-bold text-purple-700">
        {business.name}
      </h1>

      <p className="text-gray-600 mt-2">
        {business.description}
      </p>

      <p className="text-sm mt-2 text-gray-500">
        Category: {business.category}
      </p>

      <p className="text-gray-700 text-sm mt-2 font-medium">
        👤 Owner: {business.ownerName}
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-6">

        <button
          onClick={() => navigate("/add-product")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>

        <button
          onClick={handleDeleteBusiness}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
        >
          Delete Business
        </button>

      </div>

      {/* PRODUCTS */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Your Products
        </h2>

        {products.length === 0 ? (
          <p>No products yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow"
              >
                <img
                  src={product.image}
                  className="w-full h-28 object-cover rounded mb-2"
                />

                <h3 className="font-semibold text-sm">
                  {product.name}
                </h3>

                <p className="text-purple-600">
                  ৳{product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default MyBusiness;