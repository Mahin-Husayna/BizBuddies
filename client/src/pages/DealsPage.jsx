import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Deals from "../components/Deals";

function DealsPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* NAVBAR */}
        <Navbar user={user} />

        {/* PAGE CONTENT */}
        <div className="mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-6">

          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            🔥 All  Deals
          </h1>

          {/* 🔥 THIS IS THE IMPORTANT PART */}
          <Deals />

        </div>
      </div>
    </div>
  );
}

export default DealsPage;