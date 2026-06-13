import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquareCode,
  Send,
  X,
  RefreshCw,
  Bot,
  Sparkles,
  ArrowRight,
  User,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const PRESET_PROMPTS = [
  "What is his current role at Wistron?",
  "Tell me about his AI projects",
  "What hardware does he build with?",
  "Tell me about his Best Thesis project",
];

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      role: "assistant",
      text: "Hello! I'm Danilo's AI portfolio assistant. Ask me anything about his visual recognition systems, RAG diagnostic tools, edge hardware, or professional background!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorStatus(null);
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Gather messages to send to backend (history)
      const messageHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageHistory }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error code ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        text: data.text || "I didn't receive a response. Can you try again?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat API error:", err);
      setErrorStatus("Could not connect to the assistant server. Please check your setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "initial-reset",
        role: "assistant",
        text: "Chat cleared! What would you like to know about Danilo and his edge automation portfolio?",
        timestamp: new Date(),
      }
    ]);
    setErrorStatus(null);
  };

  // Helper to render basic formatting such as bold (**text**) and newlines
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((paragraph, index) => {
      if (!paragraph.trim()) return <div key={index} className="h-2" />;

      // Check for bullet list item
      const isBullet = paragraph.trim().startsWith("-") || paragraph.trim().startsWith("*");
      const cleanLine = isBullet ? paragraph.trim().substring(1).trim() : paragraph;

      // Inline markdown tags: **bold** and [text](url) links
      const parts = cleanLine.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      const renderedContent = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx} className="font-extrabold text-gray-950 dark:text-white">{part.slice(2, -2)}</strong>;
        }

        // Support [Text](URL) markdown links
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          return (
            <a
              key={pIdx}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 underline font-semibold transition-colors"
            >
              {linkText}
            </a>
          );
        }

        return part;
      });

      if (isBullet) {
        return (
          <li key={index} className="ml-4 list-disc text-xs leading-relaxed text-gray-700 dark:text-zinc-100 mt-1">
            {renderedContent}
          </li>
        );
      }

      return (
        <p key={index} className="text-xs leading-relaxed text-gray-700 dark:text-zinc-200 mb-1.5">
          {renderedContent}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 select-none font-sans">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // FLOATING BUBBLY TRIGGER BUTTON
          <motion.button
            key="chat-trigger"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full shadow-[0_4px_24px_rgba(14,165,233,0.35)] dark:shadow-[0_4px_24px_rgba(14,165,233,0.15)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            id="chat-trigger-btn"
          >
            <MessageSquareCode className="w-5 h-5 text-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Ask Danilo's AI</span>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
            </div>
          </motion.button>
        ) : (
          // EXPANDED CHAT CHASSIS
          <motion.div
            key="chat-window"
            className="w-[350px] sm:w-[400px] h-[520px] bg-white dark:bg-slate-900 border border-zinc-200 dark:border-gray-800 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            id="floating-chat-window"
          >
            {/* Header branding */}
            <div className="p-4 bg-gradient-to-r from-zinc-50 to-zinc-100/50 dark:from-[#0d1527] dark:to-[#090f1d] border-b border-zinc-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 flex items-center justify-center border border-sky-500/20 text-sky-500">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-tight text-gray-900 dark:text-gray-100">Danilo's Assistant</h3>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">Gemini 2.5 Core System</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Reset Chat"
                  className="p-2 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  id="chat-refresh-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  id="chat-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 min-h-0 bg-zinc-50/20 dark:bg-[#070b13]/55">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                >
                  {/* Avatar Bubble */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${msg.role === "user"
                    ? "bg-sky-500 text-white"
                    : "bg-zinc-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-zinc-200/50 dark:border-gray-750"
                    }`}>
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-3.5 py-2.5 text-xs relative ${msg.role === "user"
                    ? "bg-sky-500 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 text-gray-800 dark:text-zinc-100 border border-zinc-200 dark:border-slate-700/60 rounded-tl-none shadow-sm"
                    }`}>
                    <div className="whitespace-pre-wrap">
                      {msg.role === "user" ? msg.text : renderFormattedText(msg.text)}
                    </div>
                    <span className="text-[8px] absolute -bottom-4 right-1 opacity-40 font-mono text-gray-500 uppercase">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loader Typing State */}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                  <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center border border-zinc-200/50 dark:border-gray-750">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-slate-700/60 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                  </div>
                </div>
              )}

              {/* Error Flag */}
              {errorStatus && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorStatus}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel container */}
            <div className="p-3 bg-zinc-50/50 dark:bg-slate-950/20 border-t border-zinc-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-gray-400 dark:text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Suggested Questions</span>
              </div>
              <div className="flex overflow-x-auto gap-2 pb-1.5 snap-x no-scrollbar">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 snap-start text-[10px] text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 bg-white dark:bg-slate-800 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 border border-zinc-200 dark:border-gray-800 rounded-lg py-1 px-2.5 transition-all text-left cursor-pointer active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3.5 bg-white dark:bg-slate-900 border-t border-zinc-200 dark:border-gray-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask assistant about Danilo..."
                disabled={isLoading}
                className="flex-1 bg-zinc-50 dark:bg-slate-950/50 border border-zinc-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors disabled:opacity-55"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 cursor-pointer active:scale-95"
                id="chat-submit-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
