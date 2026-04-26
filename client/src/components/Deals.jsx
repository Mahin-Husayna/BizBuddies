import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Deals() {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔁 Scroll functions
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  // 🔗 Navigate safely
  const openBusiness = (product) => {
    if (!product.business) return;

    const businessId =
      typeof product.business === "object"
        ? product.business._id
        : product.business;

    if (!businessId) return;

    navigate(`/business/${businessId}`);
  };

  return (
    <div className="mt-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Deals
        </h2>

        {/* ARROWS */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white/70 px-3 py-1 rounded-lg shadow hover:scale-105 transition"
          >
            ◀
          </button>

          <button
            onClick={scrollRight}
            className="bg-white/70 px-3 py-1 rounded-lg shadow hover:scale-105 transition"
          >
            ▶
          </button>
        </div>
      </div>

      {/* CENTER WRAPPER (IMPORTANT FOR WIDTH CONTROL) */}
      <div className="flex justify-center">

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide max-w-[750px] pb-2"
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-[230px] max-w-[230px] bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-28 object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold text-sm">
                {product.name}
              </h3>

              {/* SELLER CLICK */}
              <p
                onClick={() => openBusiness(product)}
                className="text-xs text-gray-500 cursor-pointer hover:underline"
              >
                {product.seller}
              </p>

              <p className="text-purple-600 font-bold mt-1">
                ৳{product.price}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Deals;