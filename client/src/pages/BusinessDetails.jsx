import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function BusinessDetails() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/business/single/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data);

        if (data?._id) {
          fetch(
            `http://localhost:5000/api/products/business/${data._id}`
          )
            .then((res) => res.json())
            .then((prod) => setProducts(prod));
        }
      });
  }, [id]);

  if (!business) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4">

        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">

          <Navbar user={user} />

          {/* BUSINESS INFO */}
          <div className="bg-white/80 p-6 rounded-2xl shadow mb-6">

            {business.coverImage && (
              <img
                src={business.coverImage}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <h1 className="text-2xl font-bold">
              {business.name}
            </h1>

            <p className="text-gray-600">
              {business.category}
            </p>

            <p className="text-sm mt-2">
              👤 {business.ownerName}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {business.description}
            </p>
          </div>

          {/* PRODUCTS */}
          <h2 className="text-xl font-semibold mb-4">
            Products
          </h2>

          {products.length === 0 ? (
            <p>No products yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">

              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="bg-white/80 p-4 rounded-xl shadow cursor-pointer hover:scale-105 transition"
                >

                  <img
                    src={p.image}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />

                  <h3 className="font-semibold text-sm">
                    {p.name}
                  </h3>

                  <p className="text-purple-600 font-bold">
                    ৳{p.discount > 0
                      ? Math.round(p.discountedPrice)
                      : p.price}
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BusinessDetails;