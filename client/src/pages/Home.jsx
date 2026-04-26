import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Deals from "../components/Deals";
import Businesses from "../components/Businesses";
import Leaderboard from "../components/Leaderboard";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <div className="flex gap-4 items-start">

        <Sidebar />

        <div className="flex-1 bg-white/40 p-6 rounded-2xl">
          <Navbar user={user} />
          <Hero />
          <Deals />
          <Businesses />
        </div>

        <Leaderboard />

      </div>

    </div>
  );
}

export default Home;