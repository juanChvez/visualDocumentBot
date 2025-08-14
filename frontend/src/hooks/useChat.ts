import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "@src/stores/chatStore";
import type { Message } from "@src/stores/chatStore";
import { VITE_API_BASE } from "@src/config/env";

export function useChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { activeChatId, setActiveChat, setHistory, addMessage } =
    useChatStore();
  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    setHistory([]);
    if (!id) {
      navigate("/", { replace: true });
      return;
    }

    const fetchChat = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE}/chat/${id}`);
        if (!res.ok) throw new Error("Chat not found");

        const data = await res.json();

        if (!data.exists) {
          navigate("/", { replace: true });
          return;
        }

        setActiveChat(id);
        setHistory(data.history);
      } catch (err) {
        console.error(err);
        navigate("/", { replace: true });
      }
    };

    fetchChat();
  }, [id, navigate]);

  /**
   * Sends a message to the current active chat.
   *
   * @param texto - The user's message to send.
   *
   * This function:
   * - Sends the user's message to the backend API for the active chat.
   * - Adds the user's message to the chat store.
   * - If the backend returns a response, adds the assistant's response to the chat store.
   * - Handles errors by logging them to the console.
   * - Does nothing if there is no active chat.
   */
  const sendMessage = async (text: string) => {
    if (!activeChatId) return;

    try {
      setLoadingResponse(true);
      const newMessage: Message = {
        role: "user",
        text,
        timestamp: Date.now(),
      };
      addMessage(newMessage);
      const res = await fetch(`${VITE_API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage, chat_id: activeChatId }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();

      // Save assistant response if present
      if (data.response) {
        addMessage(data.response);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoadingResponse(false);
    }
  };

  return { sendMessage, loadingResponse };
}
