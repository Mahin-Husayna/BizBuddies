import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  // FILTER STATES
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (!queryParam) return;

    fetch(`http://localhost:5000/api/search?q=${queryParam}`)
      .then(res => res.json())
      .then(data => {
        console.log("SEARCH DATA:", data);

        setProducts(data.products || []);
        setBusinesses(data.businesses || []);
      })
      .catch(err => console.error(err));
  }, [queryParam]);

  // ENTER SEARCH AGAIN
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${query}`);
    }
  };

  // 💰 FILTER LOGIC
  let filteredProducts = [...products];

  filteredProducts = filteredProducts.filter((p) => {
    const price = Number(p.price);

    if (minBudget && price < Number(minBudget)) return false;
    if (maxBudget && price > Number(maxBudget)) return false;

    return true;
  });

  // 📊 SORTING
  if (sortOption === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOption === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sortOption === "newest") {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4 items-start">

        <Sidebar />

        <div className="flex-1 bg-white/40 backdrop-blur-xl p-6 rounded-2xl">

          <Navbar user={JSON.parse(localStorage.getItem("user"))} />

          {/* 🔍 SEARCH BOX */}
          

          <h1 className="text-xl font-bold mb-6">
            Results for "{queryParam}"
          </h1>

          {/* 🔽 FILTER SECTION */}
          <div className="bg-white/70 p-5 rounded-xl mb-6 shadow">

            <h2 className="font-semibold mb-4">Filters</h2>

            <div className="flex gap-4 mb-4">

              <input
                type="number"
                placeholder="Min Price"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="p-2 border rounded w-full"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="p-2 border rounded w-full"
              />

            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Sort By</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>

          </div>

          {/* 🏪 BUSINESSES */}
          {businesses.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-3">Businesses</h2>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {businesses.map((b) => (
                  <div
                    key={b._id}
                    onClick={() => navigate(`/business/${b._id}`)}
                    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-105 transition"
                  >
                    <h3 className="font-semibold">{b.name}</h3>
                    <p className="text-sm text-gray-500">{b.category}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 🛒 PRODUCTS */}
          {filteredProducts.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-3">Products</h2>

              <div className="grid grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div key={p._id} className="bg-white p-4 rounded-xl shadow">
                    <img
                      src={p.image}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-purple-600">৳{p.price}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ❌ NO RESULTS */}
          {filteredProducts.length === 0 && businesses.length === 0 && (
            <p className="text-gray-500 mt-6">
              No results found.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Search;