import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BusinessProfile() {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/business/single/${id}`)
      .then((res) => res.json())
      .then((data) => setBusiness(data));

    fetch(`http://localhost:5000/api/products/business/${id}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [id]);

  if (!business) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 p-6">

      {/* MAIN CARD */}
      <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">

        {/* COVER */}
        <img
          src={business.coverImage || "https://via.placeholder.com/800x300"}
          className="w-full h-64 object-cover"
        />

        <div className="p-6">

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center text-2xl">
              🏪
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                {business.name}
              </h1>

              <p className="text-sm text-gray-600">
                {business.category}
              </p>

              <p className="text-gray-700 text-sm mt-2">
                👤 {business.ownerName}
              </p>
            </div>
          </div>

          <p className="mt-4 text-gray-700">
            {business.description}
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Products
        </h2>

        {products.length === 0 ? (
          <p>No products yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white/70 p-4 rounded-xl shadow"
              >

                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  className="w-full h-28 object-cover rounded mb-2"
                />

                <h3 className="text-sm font-semibold">
                  {product.name}
                </h3>

                {/* PRICE */}
                {product.discount > 0 ? (
                  <>
                    <p className="text-xs text-gray-400 line-through">
                      ৳{product.price}
                    </p>
                    <p className="text-purple-600 font-bold">
                      ৳{Math.round(product.discountedPrice)}
                    </p>
                  </>
                ) : (
                  <p className="text-purple-600 font-bold">
                    ৳{product.price}
                  </p>
                )}

                {/* STOCK */}
                {product.stock > 0 ? (
                  <p className="text-green-600 text-xs mt-1">
                    In Stock ({product.stock})
                  </p>
                ) : (
                  <p className="text-red-500 text-xs mt-1">
                    Out of Stock
                  </p>
                )}

                {/* TIMER */}
                {product.offerEndsAt && (
                  <p className="text-red-500 text-xs mt-1">
                    Limited Offer
                  </p>
                )}

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessProfile;