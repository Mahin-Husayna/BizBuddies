import { useEffect, useRef, useState } from "react";

function Chat({ convoId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const bottomRef = useRef(null);

  // =========================
  // FETCH MESSAGES
  // =========================
  useEffect(() => {
    fetch(`http://localhost:5000/api/messages/${convoId}`)
      .then((res) => res.json())
      .then(setMessages);
  }, [convoId]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!text.trim()) return;

    const temp = {
      _id: Date.now(),
      sender: user._id,
      text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, temp]);
    setText("");

    const res = await fetch("http://localhost:5000/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: convoId,
        sender: user._id,
        text,
        receiverId: "RECEIVER_ID",
      }),
    });

    const saved = await res.json();

    setMessages((prev) =>
      prev.map((m) => (m._id === temp._id ? saved : m))
    );
  };

  return (
    <div className="flex flex-col h-full p-4">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">

        {messages.map((m) => {
          const isMe = m.sender === user._id;

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm
                  ${
                    isMe
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-black"
                  }
                `}
              >
                {/* TEXT */}
                <p>{m.text}</p>

                {/* TIME */}
                <p className="text-[10px] mt-1 opacity-70 text-right">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="flex mt-3 gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={sendMessage}
          className="px-4 bg-purple-500 text-white rounded-xl hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;