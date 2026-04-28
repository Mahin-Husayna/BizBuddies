import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Chat from "./Chat";

function Messages() {
  const [convos, setConvos] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchConvos = async () => {
    const res = await fetch(
      `http://localhost:5000/api/messages/conversations/${user._id}`
    );
    const data = await res.json();
    setConvos(data);
  };

  useEffect(() => {
    fetchConvos();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">

      <Sidebar />

      <div className="flex-1 p-6">
        <Navbar user={user} />

        <div className="flex mt-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden h-[80vh]">

          {/* LEFT */}
          <div className="w-1/3 border-r border-gray-300 bg-white/40 overflow-y-auto">

            <h2 className="p-4 font-semibold border-b">Messages</h2>

            {convos.map((c) => {
              const otherUser = c.members.find(
                (m) => m._id !== user._id
              );

              const business = c.product?.business;

              return (
                <div
                  key={c._id}
                  onClick={async () => {
                    setSelectedConvo(c._id);

                    await fetch(
                      `http://localhost:5000/api/messages/read/${c._id}`,
                      { method: "PUT" }
                    );

                    fetchConvos();
                  }}
                  className="flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                    {business?.coverImage ? (
                      <img
                        src={business.coverImage}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      "🏪"
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {business?.name || otherUser?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {c.lastMessage?.text || "No messages"}
                    </p>
                  </div>

                  {/* 🔴 UNREAD */}
                  {c.unreadCount > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="w-2/3">
            {selectedConvo ? (
              <Chat convoId={selectedConvo} />
            ) : (
              <div className="flex justify-center items-center h-full text-gray-400">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;