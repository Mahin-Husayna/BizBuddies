import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/business")
      .then((res) => res.json())
      .then((data) => setBusinesses(data))
      .catch((err) => console.error(err));
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <div className="mt-8">

      {/* HEADER (simple like before) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Business Profiles
        </h2>

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

      {/* SCROLL AREA */}
      <div className="flex justify-center">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide max-w-[750px] pb-3"
        >
          {businesses.map((business) => (
            <div
              key={business._id}
              onClick={() => navigate(`/business/${business._id}`)}
              className="min-w-[220px] max-w-[220px] bg-white/70 backdrop-blur-lg rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative h-24 w-full">
                <img
                  src={
                    business.coverImage ||
                    "https://via.placeholder.com/300x200"
                  }
                  className="w-full h-full object-cover"
                />

                {/* CATEGORY TAG */}
                <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 bg-white/90 text-purple-600 rounded-full font-medium shadow">
                  {business.category}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3 text-center">

                {/* NAME */}
                <h3 className="font-semibold text-sm text-gray-800">
                  {business.name}
                </h3>

                {/* OWNER */}
                <p className="text-[11px] text-gray-500 mt-1">
                  by {business.ownerName}
                </p>

                {/* RATING */}
                <div className="flex justify-center items-center gap-1 mt-2 text-xs">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">
                    {business.avgRating || 0}
                  </span>
                  <span className="text-gray-400">
                    ({business.totalReviews || 0})
                  </span>
                </div>

                {/* BUTTON */}
                <button className="mt-3 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:opacity-90 transition">
                  View →
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Businesses;