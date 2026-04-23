import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE (Image / Branding) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">BizBuddies</h1>
          <p className="text-lg opacity-90">
            Connect, Sell, and Grow your campus business easily.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">

        <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome Back 👋
          </h2>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Signup
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;