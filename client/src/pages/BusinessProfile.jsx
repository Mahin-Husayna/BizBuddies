import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BusinessProfile() {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch business
    fetch(`http://localhost:5000/api/business/single/${id}`)
      .then(res => res.json())
      .then(data => setBusiness(data));

    // Fetch products
    fetch(`http://localhost:5000/api/products/business/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [id]);

  if (!business) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 p-6">

      {/* MAIN CARD */}
      <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div className="w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center text-2xl">
            🏪
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {business.name}
            </h1>

            <p className="text-gray-600 text-sm">
              {business.category}
            </p>

            <p className="text-yellow-500 text-sm">
              ⭐ 4.5 (120 reviews)
            </p>
            <p className="text-gray-700 text-sm mt-2 font-medium">
  👤 Owner: {business.ownerName}
</p>
          </div>

        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 text-gray-700">
          {business.description}
        </p>

      </div>

      {/* PRODUCTS SECTION */}
      <div className="mt-8">

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">

            {products.map(product => (
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

export default BusinessProfile;