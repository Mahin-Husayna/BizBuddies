import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    // 1️⃣ Fetch business
    fetch(`http://localhost:5000/api/business/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data);

        // 2️⃣ Fetch products for that business
        return fetch(
          `http://localhost:5000/api/products/business/${data._id}`
        );
      })
      .then((res) => res.json())
      .then((productsData) => {
        setProducts(productsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      // Remove from UI instantly
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!business) {
    return <div className="p-10">No business found</div>;
  }

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

      {/* ADD PRODUCT */}
      <button
        onClick={() => navigate("/add-product")}
        className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg"
      >
        + Add Product
      </button>

      {/* PRODUCTS */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Your Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow relative"
              >
                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="absolute top-2 right-2 text-red-500 text-sm"
                >
                  ❌
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-28 object-cover rounded-lg mb-3"
                />

                <h3 className="font-semibold text-sm">
                  {product.name}
                </h3>

                <p className="text-purple-600 font-bold mt-1">
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