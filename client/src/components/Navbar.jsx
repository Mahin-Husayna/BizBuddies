function Navbar({ user }) {
  return (
    <div className="flex items-center justify-between mb-6">

      <input
        type="text"
        placeholder="Search..."
        className="w-1/2 p-3 rounded-xl bg-white border"
      />

      <div className="flex items-center gap-4">
        <span>🔔</span>
        <span>💬</span>

        <div className="flex items-center gap-2">
          <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full" />
          <span>{user?.name || "Student"}</span>
        </div>
      </div>

    </div>
  );
}

export default Navbar;