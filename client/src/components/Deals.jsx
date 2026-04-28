import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Deals() {
  const [products, setProducts] = useState([]);
  const [now, setNow] = useState(new Date());

  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // FETCH PRODUCTS
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // TIMER REFRESH
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const openBusiness = (product) => {
    if (!product.business) return;

    const id =
      typeof product.business === "object"
        ? product.business._id
        : product.business;

    navigate(`/business/${id}`);
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

  // FILTER DEALS
  const deals = products.filter((p) => {
    if (!p.discount || p.discount <= 0) return false;
    if (!p.offerEndsAt) return true;
    return new Date(p.offerEndsAt) > now;
  });

  return (
    <div className="mt-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Deals
        </h2>

        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white/70 px-3 py-1 rounded-lg shadow hover:scale-105"
          >
            ◀
          </button>

          <button
            onClick={scrollRight}
            className="bg-white/70 px-3 py-1 rounded-lg shadow hover:scale-105"
          >
            ▶
          </button>
        </div>
      </div>

      {/* DEALS */}
      {deals.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No deals available right now
        </p>
      ) : (
        <div className="flex justify-center">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto max-w-[750px] pb-2"
          >
            {deals.map((product) => (
              <div
                key={product._id}
                className="min-w-[230px] bg-white/70 p-4 rounded-xl shadow relative"
              >

                {/* DISCOUNT BADGE */}
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </span>

                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-28 object-cover rounded-lg mb-3"
                />

                <h3 className="font-semibold text-sm">
                  {product.name}
                </h3>

                <p
                  onClick={() => openBusiness(product)}
                  className="text-xs text-gray-500 cursor-pointer hover:underline"
                >
                  {product.seller}
                </p>

                {/* PRICE */}
                <div className="mt-2">
                  <p className="text-xs text-gray-400 line-through">
                    ৳{product.price}
                  </p>

                  <p className="text-purple-600 font-bold">
                    ৳{Math.round(product.discountedPrice)}
                  </p>
                </div>

                {/* STOCK */}
                {product.stock > 0 ? (
                  <p className="text-green-600 text-xs mt-1">
                    In Stock
                  </p>
                ) : (
                  <p className="text-red-500 text-xs mt-1">
                    Out of Stock
                  </p>
                )}

                {/* TIMER */}
                {product.offerEndsAt && (
                  <p className="text-red-500 text-xs mt-1">
                    ⏳ {getRemainingTime(product.offerEndsAt)}
                  </p>
                )}

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Deals;