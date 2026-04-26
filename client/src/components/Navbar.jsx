import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiMessageCircle } from "react-icons/fi";

function Navbar({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], businesses: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  // 🔍 LIVE SEARCH
  useEffect(() => {
    if (!query.trim()) {
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(() => {
      fetch(`http://localhost:5000/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setShowDropdown(true);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // ⌨️ ENTER SEARCH
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${query}`);
      setShowDropdown(false);
    }
  };

  // 🔘 BUTTON CLICK SEARCH
  const handleSearchClick = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setShowDropdown(false);
  };

  return (
    <div className="flex justify-between items-center mb-6 relative">

      {/* 🔍 SEARCH BAR */}
      <div className="w-1/2 relative">

        <div className="flex items-center bg-white/70 backdrop-blur rounded-xl shadow-sm overflow-hidden">

          {/* INPUT */}
          <input
            type="text"
            placeholder="Search businesses, deals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
          />

          {/* BUTTON */}
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
          >
            <FiSearch size={18} />
          </button>
        </div>

        {/* 🔽 DROPDOWN */}
        {showDropdown && (
          <div className="absolute w-full bg-white mt-2 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">

            {/* BUSINESSES */}
            {results.businesses.length > 0 && (
              <div className="p-3 border-b">
                <p className="text-xs text-gray-400 mb-2">Businesses</p>

                {results.businesses.map((b) => (
                  <div
                    key={b._id}
                    onClick={() => navigate(`/business/${b._id}`)}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    {b.name}
                    <span className="text-xs text-gray-500 ml-2">
                      ({b.category})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* PRODUCTS */}
            {results.products.length > 0 && (
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Products</p>

                {results.products.map((p) => (
                  <div
                    key={p._id}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    {p.name}
                    <span className="text-xs text-purple-500 ml-2">
                      ৳{p.price}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* 🔔 RIGHT SIDE */}
      <div className="flex items-center gap-4">

        <FiBell className="text-lg cursor-pointer" />
        <FiMessageCircle className="text-lg cursor-pointer" />

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">
            {user?.name}
          </span>
        </div>

      </div>

    </div>
  );
}

export default Navbar;