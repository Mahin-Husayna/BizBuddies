import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Deals() {
  const [products, setProducts] = useState([]);
  const [now, setNow] = useState(new Date());

  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  const openBusiness = (product) => {
    if (!product.business) return;

    const id =
      typeof product.business === "object"
        ? product.business._id
        : product.business;

    navigate(`/business/${id}`);
  };

  const addToCart = async (productId) => {
    try {
      await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const requestStock = async (productId) => {
    try {
      await fetch("http://localhost:5000/api/cart/request-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userId: user._id,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getRemainingTime = (endTime) => {
    if (!endTime) return null;

    const diff = new Date(endTime) - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const deals = products.filter((p) => {
    if (!p.discount || p.discount <= 0) return false;
    if (!p.offerEndsAt) return true;
    return new Date(p.offerEndsAt) > now;
  });

  return (
    <div className="mt-8 px-2">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Deals
        </h2>

        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white/80 px-3 py-1 rounded-lg shadow hover:scale-105 transition"
          >
            ◀
          </button>

          <button
            onClick={scrollRight}
            className="bg-white/80 px-3 py-1 rounded-lg shadow hover:scale-105 transition"
          >
            ▶
          </button>
        </div>
      </div>

      {deals.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No deals available right now
        </p>
      ) : (
        <div className="flex justify-center">

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar max-w-[750px] pb-3"
          >
            {deals.map((product) => (
              <div
                key={product._id}
                onClick={() => openBusiness(product)}
                className="min-w-[220px] max-w-[220px] bg-white/70 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
              >

                {/* IMAGE */}
                <div className="relative h-28 w-full">
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* DISCOUNT BADGE */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
                    {product.discount}% OFF
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-3">

                  {/* NAME */}
                  <h3 className="font-semibold text-sm text-gray-800">
                    {product.name}
                  </h3>

                  {/* SELLER */}
                  <p className="text-[11px] text-gray-500">
                    {product.seller}
                  </p>

                  {/* PRICE */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 line-through">
                      ৳{product.price}
                    </p>
                    <p className="text-purple-600 font-bold text-base">
                      ৳{Math.round(product.discountedPrice)}
                    </p>
                  </div>

                  {/* STOCK */}
                  <p
                    className={`text-[11px] mt-1 ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>

                  {/* TIMER */}
                  {product.offerEndsAt && (
                    <p className="text-red-500 text-[11px] mt-1">
                      ⏳ {getRemainingTime(product.offerEndsAt)}
                    </p>
                  )}

                  {/* BUTTON */}
                  <div className="mt-3">
                    {product.stock > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product._id);
                        }}
                        className="w-full text-xs py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:opacity-90 transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestStock(product._id);
                        }}
                        className="w-full text-xs py-1.5 rounded-full bg-orange-500 text-white shadow hover:opacity-90 transition"
                      >
                        Request Stock
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default Deals;