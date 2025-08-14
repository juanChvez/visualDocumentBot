import React, { useState, useEffect, useRef } from "react";
import { LoaderCircle, MessageCircle, Send } from "lucide-react";
import { useChat } from "@src/hooks/useChat";
import { useChatStore } from "@src/stores/chatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ChatPage: React.FC = () => {
  const { sendMessage, loadingResponse } = useChat();
  const { activeChatId, messages } = useChatStore();
  const [inputMessage, setInputMessage] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts < 1e12 ? ts * 1000 : ts); // handle seconds/milliseconds
    const now = new Date();

    // Reset hours for date-only comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (dateOnly.getTime() === today.getTime()) {
      return `Today ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      return `Yesterday ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) +
        ` ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    }
  };

  return (
    <div className="px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chat Interface
          </h1>
          <p className="text-gray-600 text-lg">
            Step 2: Chat about your uploaded image
          </p>
        </div>

        <div className="flex flex-col mb-8 bg-white rounded-2xl h-[70vh] overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 flex items-center h-16">
            <MessageCircle className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Chat</h2>
          </div>
          {/* Message Center */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">
                <MessageCircle
                  size={48}
                  className="mx-auto mb-4 text-gray-300"
                />
                <p>Start a conversation about your uploaded images</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={`${activeChatId}__${message.timestamp}`}
                  className={`flex ${
                    message.role == "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-lg px-4 py-3 rounded-lg ${
                      message.role == "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                      <span
                        className={`block mt-2 text-[8px] ${
                          message.role == "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
            {/* Show loading response */}
            {loadingResponse && (
              <div className="flex items-center gap-2 text-gray-500">
                <LoaderCircle className="animate-spin h-5 w-5 text-gray-500" />
                <span>Escribiendo...</span>
              </div>
            )}
            <div ref={endRef} /> {/* marcador final */}
          </div>
          {/* Text Input */}
          <div className="flex space-x-4 mt-auto border border-gray-200 w-9/10 m-auto my-8 p-2 rounded-xl">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 px-4 overflow-y-auto overflow-x-hidden focus:border-transparent focus-visible:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
