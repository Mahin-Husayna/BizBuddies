import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/business")
      .then((res) => res.json())
      .then((data) => setBusinesses(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Business Profiles
      </h2>

      {businesses.length === 0 ? (
        <p className="text-gray-500">No businesses available</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {businesses.map((business) => (
            <div
              key={business._id}
              onClick={() => navigate(`/business/${business._id}`)}
              className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-purple-200 rounded-full flex items-center justify-center text-xl">
                🏪
              </div>

              <h3 className="font-semibold text-sm">
                {business.name}
              </h3>

              <p className="text-xs text-gray-600">
                {business.category}
              </p>

              <p className="text-yellow-500 text-sm mt-1">
                ⭐ 4.5
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Businesses;