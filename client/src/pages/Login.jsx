import { Link } from "react-router-dom";
import bg from "../assets/login-bg.png"; // 👈 your image

function Login() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-end"
      style={{ backgroundImage: `url(${bg})` }}
    >
      
      {/* RIGHT SIDE CONTENT */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center pr-10">

        {/* Logo */}
        <h1 className="text-5xl font-bold text-indigo-900 mb-8">
          BizBuddies
        </h1>

        {/* Login Card */}
        <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-white/40">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Welcome Back 👋
          </h2>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-700 font-semibold">
              Signup
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;