import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/brac-bg.png"; // 🔁 CHANGE IMAGE HERE

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("RESPONSE:", data); // ✅ debug

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ important
      alert("Login successful");
      navigate("/home");
    } else {
      alert(data.message || "Login failed");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err); // ✅ better debug
    alert("Something went wrong");
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-6xl flex items-center justify-between gap-5 px-6">

        {/* LEFT SIDE */}
        <div className="hidden md:block max-w-md space-y-4 mr-[-100px]">

          {/* LOGO */}
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-purple-700">Biz</span>
              <span className="text-pink-500">Buddies</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium">
              Campus Business Hub
            </p>
          </div>

          {/* HEADLINE */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Where <br />
              <span className="text-purple-600">Student Ideas</span> <br />
              Become Reality
            </h1>
          </div>

          {/* FEATURES WITH ICONS */}
          <div className="space-y-3 mt-4">

            <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl shadow w-[320px] flex items-start gap-3">
              <span className="text-lg">🚀</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Start Your Business
                </h3>
                <p className="text-xs text-gray-700">
                  Create profile and showcase products
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl shadow w-[320px] flex items-start gap-3">
              <span className="text-lg">🤝</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Connect & Collaborate
                </h3>
                <p className="text-xs text-gray-700">
                  Network with students
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl shadow w-[320px] flex items-start gap-3">
              <span className="text-lg">📈</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Grow & Succeed
                </h3>
                <p className="text-xs text-gray-700">
                  Turn ideas into real impact
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE LOGIN */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl w-full max-w-sm shadow-2xl">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow">
              <span className="text-lg font-bold text-purple-600">BB</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Welcome Back
          </h2>

          <p className="text-center text-sm text-gray-700 mb-6">
            Login to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <div className="flex justify-between text-sm text-gray-800">
              <label className="flex items-center gap-1">
                <input type="checkbox" />
                Remember me
              </label>

              <span className="cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:opacity-90 transition"
            >
              Login
            </button>

          </form>

          <p className="text-center mt-4 text-sm text-gray-800">
            New to BizBuddies?{" "}
            <Link to="/signup" className="text-purple-700 font-semibold">
              Sign up
            </Link>
          </p>

        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-3 left-[calc(50%-560px)]">
  <div className="bg-black/30 backdrop-blur-md px-6 py-2 rounded-xl flex gap-6 text-sm text-white shadow-lg">
    <div>✔ Verified Students Only</div>
    <div>🎓 Made for Students</div>
    <div>🤝 Community First</div>
  </div>
</div>
    </div>
  );
}

export default Login;