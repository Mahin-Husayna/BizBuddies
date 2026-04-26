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

  // 🔁 Scroll functions
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mt-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Business Profiles
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

      {/* CENTER WRAPPER */}
      <div className="flex justify-center">

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide max-w-[750px] pb-2"
        >
          {businesses.map((business) => (
            <div
              key={business._id}
              onClick={() => navigate(`/business/${business._id}`)}
              className="min-w-[230px] max-w-[230px] bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer text-center"
            >

              {/* ICON */}
              <div className="w-14 h-14 mx-auto mb-3 bg-purple-200 rounded-full flex items-center justify-center text-xl">
                🏪
              </div>

              {/* NAME */}
              <h3 className="font-semibold text-sm">
                {business.name}
              </h3>

              {/* CATEGORY */}
              <p className="text-xs text-gray-500">
                {business.category}
              </p>

              {/* OWNER */}
              <p className="text-xs text-gray-600 mt-1">
                👤 {business.ownerName}
              </p>

              {/* RATING (placeholder) */}
              <p className="text-yellow-500 text-sm mt-1">
                ⭐ 4.5
              </p>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Businesses;