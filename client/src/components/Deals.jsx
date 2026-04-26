import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Deals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Deals
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-28 object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold text-sm">
                {product.name}
              </h3>

              {/* 🔥 CLICKABLE SELLER */}
              <p
                
                onClick={() => {
  const businessId =
    typeof product.business === "object"
      ? product.business._id
      : product.business;

  navigate(`/business/${businessId}`);
}}
                className="text-xs text-gray-600 cursor-pointer hover:underline"
              >
                {product.seller}
              </p>

              <p className="text-purple-600 font-bold mt-1">
                ৳{product.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Deals;