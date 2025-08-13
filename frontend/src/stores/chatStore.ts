import { create } from 'zustand';

// Definimos el tipo de cada mensaje
export interface Message {
  role: string
  text: string;
  timestamp: number;
}

// Definimos el tipo del store
interface ChatStore {
  messages: Message[];
  activeChatId: string;
  addMessage: (newMessage: Message) => void;
  setHistory: (history: Message[]) => void,
  setActiveChat: (chatId:string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  activeChatId: "",

  
  setActiveChat: (chatId:string) => set({ activeChatId: chatId }),

  addMessage: (newMessage: Message) => {
    set({ messages: [...get().messages, newMessage] });
  },

  setHistory: (history: Message[]) => set({ messages: history }),

  clearChat: () => set({ messages: [], activeChatId: "" }),
}));
