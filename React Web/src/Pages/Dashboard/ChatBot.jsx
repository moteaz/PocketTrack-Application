import React, { useState, useRef, useEffect, useContext } from "react";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import { useUserAuth } from "../../Hooks/useUserAuth";
import { Send, Bot, User, Loader2, Square } from "lucide-react";
import { UserContext } from "../../Context/UserContext";

const Chatbot = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const getBotResponse = async (userInput) => {
    setLoading(true);
    const controller = new AbortController();
    setAbortController(controller);
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt: userInput }),
        credentials: 'include',
        signal: controller.signal,
      });
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      let botText = "";
      let done = false;
      let decoder = new TextDecoder();

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunks = decoder.decode(value).split('\n\n');
          for (const chunk of chunks) {
            const clean = chunk.replace(/^data: /, '').trim();
            if (!clean) continue;
            try {
              const json = JSON.parse(clean);
              if (json.response) {
                botText += json.response;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text = botText;
                  return updated;
                });
              }
            } catch {
              // Ignore non-JSON chunks
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = "Response stopped by user.";
          return updated;
        });
      } else {
        console.error("API error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = "Sorry, something went wrong. Please try again later.";
          return updated;
        });
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { 
      sender: "user", 
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await getBotResponse(input.trim());
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout activeMenu="Chatbot">
      <div className="bg-white p-6 mt-5 rounded-2xl shadow-md border border-gray-200/50 max-w-4xl mx-auto flex flex-col h-[670px]">
        <div className="bg-gradient-to-r from-violet-800 to-indigo-900 p-6 rounded-t-xl">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full">
              <Bot className="text-violet-600 w-6 h-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
              <p className="text-violet-200 text-sm">Ready to help with your questions</p>
            </div>
          </div>
        </div>
        
        <div className="flex-grow bg-gray-50 p-4 overflow-hidden flex flex-col h-[70vh] lg:h-[60vh]">
          {/* Messages container */}
          <div className="flex-grow overflow-y-auto space-y-4 px-2 pb-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[70%]`}>
                  {msg.sender === "bot" && (
                    <div className="self-end mb-2 mr-2">
                      <div className="bg-violet-100 p-1 rounded-full">
                        <Bot className="text-violet-600 w-5 h-5" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`relative p-4 rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.sender === "user" ? "text-violet-200" : "text-gray-400"
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                  
                  {msg.sender === "user" && (
                    <div className="self-end mb-2 ml-2">
                      <div className="bg-indigo-100 p-1 rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">
                        {user && user.profile_pic ? (
                          <img
                            src={`http://localhost:5000${user.profile_pic}`}
                            alt="User"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <User className="text-indigo-600 w-5 h-5" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] md:max-w-[70%]">
                  <div className="self-end mb-2 mr-2">
                    <div className="bg-violet-100 p-1 rounded-full">
                      <Bot className="text-violet-600 w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                      <p className="text-gray-500">Thinking...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="bg-white rounded-xl p-2 mt-4 shadow-md border border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow p-3 bg-transparent focus:outline-none text-gray-800"
                disabled={loading}
                aria-label="Message input"
              />
              {loading ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-700 cursor-pointer transition-all duration-200 flex items-center justify-center ml-2"
                  aria-label="Stop response"
                >
                  <Square className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`p-3 rounded-full ${
                    input.trim() 
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 cursor-pointer" 
                      : "bg-gray-200 text-gray-400"
                  } transition-all duration-200 flex items-center justify-center ml-2`}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;