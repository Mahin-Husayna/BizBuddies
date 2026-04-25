import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/brac-bg.png"; // 🔁 same background

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // default

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-6xl flex items-center justify-between gap-10 px-6">

        {/* LEFT SIDE (same as login) */}
        <div className="hidden md:block max-w-md space-y-4 mr-[-80px]">

          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-purple-700">Biz</span>
              <span className="text-pink-500">Buddies</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium">
              Campus Business Hub
            </p>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Where <br />
              <span className="text-purple-600">Student Ideas</span> <br />
              Become Reality
            </h1>
          </div>

          {/* FEATURES */}
          <div className="space-y-3 mt-4">

            <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl shadow w-[320px] flex gap-3">
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

            <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl shadow w-[320px] flex gap-3">
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

            <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl shadow w-[320px] flex gap-3">
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

        {/* RIGHT SIDE SIGNUP */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl w-full max-w-sm shadow-2xl">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow">
              <span className="text-lg font-bold text-purple-600">BB</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Create Account
          </h2>

          <p className="text-center text-sm text-gray-700 mb-6">
            Join BizBuddies today ✨
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

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

            {/* ROLE SELECT */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:opacity-90 transition"
            >
              Sign Up
            </button>

          </form>

          <p className="text-center mt-4 text-sm text-gray-800">
            Already have an account?{" "}
            <Link to="/" className="text-purple-700 font-semibold">
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* FOOTER */}
      {/* FOOTER aligned with left div */}
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

export default Signup;