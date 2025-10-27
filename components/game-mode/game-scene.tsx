"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: "1", text: "👋 Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?", sender: "bot" },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 💡 Aquí va tu webhook de n8n
      const response = await fetch("https://alejandro1508.app.n8n.cloud/webhook/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput: input }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      let data;
      try {
        data = await response.json();
      } catch {
        data = { reply: "⚠️ El servidor no devolvió una respuesta válida." };
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "⚠️ Sin respuesta del bot.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "❌ Error al conectar con el servidor.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white w-80 shadow-2xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-indigo-600 text-white p-3">
              <span className="font-semibold text-sm">Asistente Virtual</span>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg text-sm max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-indigo-100 self-end ml-auto"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isLoading && <div className="text-gray-400 text-xs italic">Escribiendo...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center border-t bg-white p-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg"
        >
          <MessageSquare size={22} />
        </motion.button>
      )}
    </div>
  );
}
