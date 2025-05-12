import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import axiosInstance from "../../Utils/axiosInstance";
import { LuSend } from "react-icons/lu";
import { useUserAuth } from "../../Hooks/useUserAuth";


const Chatbot = () => {
  useUserAuth();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


const getBotResponse = async (userInput) => {
  setLoading(true); // Set loading to true before the API request



  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/api/chatbot",
      { prompt: userInput },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 50000,  // Set timeout to 5min seconds
      }
    );

    // Check if the response is successful
    const botReply = response.data.response || "No response from server.";
    console.log("Bot reply:", botReply);

    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
  } catch (error) {
    console.error("API error:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Sorry, something went wrong." },
    ]);
  } finally {
    setLoading(false); // Set loading to false after the request is complete
  }
};



  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    await getBotResponse(input.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="bg-white p-6 mt-5 rounded-2xl shadow-md border border-gray-200/50 max-w-3xl mx-auto flex flex-col h-[600px]">
        <h2 className="text-lg font-semibold mb-2">AI Helper</h2>
        <p className="text-xs text-gray-500 mb-4">Ask me anything!</p>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto mb-4 px-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] mb-3 p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-violet-600 text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="max-w-[70%] mb-3 p-3 rounded-lg bg-gray-100 text-gray-600">
              Bot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={loading}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 text-white px-6 rounded-lg hover:bg-violet-400 hover:text-violet-700 transition disabled:opacity-50"
            aria-label="Send message"
          >
            {loading ? "..." : <LuSend size={20} />}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
