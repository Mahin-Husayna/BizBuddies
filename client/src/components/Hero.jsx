import { useNavigate } from "react-router-dom";
import bg from "../assets/brac-bg.png"; // 👈 replace with your image

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">

      <div
        className="relative rounded-3xl overflow-hidden shadow-xl h-[260px] flex items-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-pink-500/70 to-transparent"></div>

        {/* CONTENT */}
        <div className="relative z-10 px-10 max-w-xl">

          <h1 className="text-4xl font-bold text-white leading-tight">
            Turn ideas into Reality
          </h1>

          <p className="text-white/80 mt-3 text-sm">
            Empower your ideas, showcase your business, and grow with your campus community.
          </p>

          <button
            onClick={() => navigate("/create-business")}
            className="mt-6 bg-white text-purple-600 px-6 py-3 rounded-xl font-medium shadow-lg hover:scale-105 transition"
          >
            + Create Your Business
          </button>

        </div>

      </div>

    </div>
  );
}

export default Hero;