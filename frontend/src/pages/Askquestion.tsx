import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Sparkles } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 🌱 Initial Welcome Message
  useEffect(() => {
    const welcomeMessage: Message = {
      sender: "AI",
      text:
        "🌱 Hello Farmer! 👋\n\nI'm your Smart AI Farming Assistant.\n\nYou can ask me about:\n• Crop recommendations 🌾\n• Fertilizers & soil health 🌱\n• Pest & disease control 🐛\n• Weather advice ☁️\n• Government schemes 🏛️\n\nHow can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat([welcomeMessage]);
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;

    const newMessage: Message = {
      sender: "You",
      text: question,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      let errorMessage = "⚠️ Error getting answer.";
      if (error instanceof Error) errorMessage = error.message;

      setChat((prev) => [
        ...prev,
        {
          sender: "AI",
          text: errorMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Auto resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const quickSuggestions = [
    "Best crop for this season?",
    "How to improve soil fertility?",
    "Organic pest control methods",
    "Government farming schemes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  via-emerald-100 to-teal-100 flex items-center justify-center pt-0 p-1">

      {/* Main Chat Card */}
      <div className="w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-7 h-7" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Smart AI Farming Assistant
              </h2>
              <p className="text-green-100 text-xs md:text-sm">
                Powered by Advanced AI Technology
              </p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-white to-green-50">
          <div className="space-y-6 max-w-4xl mx-auto">

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "You"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-3 w-full max-w-2xl ${
                    msg.sender === "You" ? "flex-row-reverse ml-auto" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${
                      msg.sender === "You"
                        ? "bg-green-600 text-white"
                        : "bg-emerald-100 text-green-700"
                    }`}
                  >
                    {msg.sender === "You" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`px-6 py-4 rounded-3xl shadow-md text-sm md:text-base ${
                      msg.sender === "You"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <span className="block text-xs opacity-70 mt-2 text-right">
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Bot className="w-5 h-5" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="px-6 py-3 bg-white border-t flex flex-wrap gap-2">
          {quickSuggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => setQuestion(item)}
              className="text-xs md:text-sm px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleInput}
              rows={1}
              placeholder="Ask your farming question..."
              className="flex-1 resize-none border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
            />
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl shadow-lg transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AskQuestion;