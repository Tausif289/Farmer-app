import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  sender: string;
  text: string;
  time: string;
}

const AskQuestion: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!question.trim()) return;

    const newMessage: Message = {
      sender: "You",
      text: question,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChat((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/askquestion", {
        question,
      });

      const aiMessage: Message = {
        sender: "AI",
        text: res.data.answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "AI", text: "⚠️ Error getting answer.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto p-4 bg-green-50 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-700">🌱 Ask AI (Farming Assistant)</h2>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-white shadow-inner">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                msg.sender === "You"
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-[10px] opacity-75 block mt-1 text-right">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500">AI is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your farming question..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AskQuestion;

