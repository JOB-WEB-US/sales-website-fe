"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Socket } from "socket.io-client";
import { Image as ImageIcon, Loader2, MessageCircle, Send, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useThemeStore } from "@/store/useThemeStore";

type ChatMessage = {
  id: string;
  conversationId: string;
  senderType: "CUSTOMER" | "ADMIN";
  content?: string | null;
  imageUrls: string[];
  createdAt: string;
  clientMessageId?: string;
};

const SOCKET_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
const WAITING_NOTICE_AFTER_MS = 12 * 60 * 60 * 1000;
type WaitingNoticeKind = "FIRST_CONTACT" | "RETURNING_AFTER_INACTIVITY" | null;

function getWaitingNoticeKind(messages: ChatMessage[], index: number): WaitingNoticeKind {
  const message = messages[index];
  if (!message || message.senderType !== "CUSTOMER") return null;

  const firstCustomerIndex = messages.findIndex((item) => item.senderType === "CUSTOMER");
  if (index === firstCustomerIndex) return "FIRST_CONTACT";

  let previousCustomerIndex = -1;
  for (let current = index - 1; current >= 0; current -= 1) {
    if (messages[current].senderType === "CUSTOMER") {
      previousCustomerIndex = current;
      break;
    }
  }
  if (previousCustomerIndex < 0) return null;

  // Only start a new waiting period if admin has replied to the previous messages.
  const adminRepliedSincePreviousCustomer = messages
    .slice(previousCustomerIndex + 1, index)
    .some((item) => item.senderType === "ADMIN");
  if (!adminRepliedSincePreviousCustomer) return null;

  const previousActivity = messages[index - 1];
  const previousTime = new Date(previousActivity.createdAt).getTime();
  const currentTime = new Date(message.createdAt).getTime();
  if (!Number.isFinite(previousTime) || !Number.isFinite(currentTime)) return null;

  return currentTime - previousTime >= WAITING_NOTICE_AFTER_MS
    ? "RETURNING_AFTER_INACTIVITY"
    : null;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open || !unauthorized) return;
    const retryAuthentication = () => setRetryKey((value) => value + 1);
    const retryWhenVisible = () => {
      if (document.visibilityState === "visible") retryAuthentication();
    };
    window.addEventListener("focus", retryAuthentication);
    document.addEventListener("visibilitychange", retryWhenVisible);
    return () => {
      window.removeEventListener("focus", retryAuthentication);
      document.removeEventListener("visibilitychange", retryWhenVisible);
    };
  }, [open, unauthorized]);

  useEffect(() => {
    if (open && unauthorized) setRetryKey((value) => value + 1);
  }, [pathname]);

  useEffect(() => {
    if (!open || conversationId) return;
    setLoading(true);
    setUnauthorized(false);
    setConnectionError("");
    const loadConversation = async () => {
      let response = await fetch(`${API_BASE_URL}/messages/conversation`, { credentials: "include" });
      if (response.status === 401) {
        const refreshed = await fetch(`${API_BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });
        if (refreshed.ok) response = await fetch(`${API_BASE_URL}/messages/conversation`, { credentials: "include" });
      }
      return response;
    };
    loadConversation()
      .then(async (res) => {
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        const result = await res.json().catch(() => null);
        if (!res.ok) throw new Error(result?.message || `Server responded with status ${res.status}.`);
        return result;
      })
      .then(({ data }) => {
        setConversationId(data.conversation.id);
        setMessages(data.messages || []);
        setUnread(0);
        return import("socket.io-client").then(({ io }) => {
          const socket = io(SOCKET_URL, { withCredentials: true, transports: ["websocket", "polling"] });
          socketRef.current = socket;
          socket.on("connect_error", () => setRealtimeConnected(false));
          socket.on("disconnect", () => setRealtimeConnected(false));
          socket.on("connect", () => {
            setRealtimeConnected(true);
            socket.emit("conversation:join", data.conversation.id);
            socket.emit("message:read", data.conversation.id);
          });
          socket.emit("conversation:join", data.conversation.id);
          socket.emit("message:read", data.conversation.id);
          socket.on("message:new", (message: ChatMessage) => {
            setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
            if (message.senderType === "ADMIN") setUnread((value) => open ? value : value + 1);
            socket.emit("message:read", data.conversation.id);
          });
        });
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") setUnauthorized(true);
        else setConnectionError(error.message || "Could not connect to customer support server.");
      })
      .finally(() => setLoading(false));
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [open, conversationId, retryKey]);

  const chooseImages = async (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 5 - images.length);
    const valid = selected.filter((file) => file.type.startsWith("image/") && file.size <= 8 * 1024 * 1024);
    const encoded = await Promise.all(
      valid.map((file) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      }))
    );
    setImages((current) => [...current, ...encoded].slice(0, 5));
  };

  const sendMessage = async () => {
    if ((!text.trim() && images.length === 0) || !conversationId || sending) return;
    const draftText = text.trim();
    const draftImages = [...images];
    const clientMessageId = crypto.randomUUID();
    const temporaryId = `pending-${clientMessageId}`;
    const optimisticMessage: ChatMessage = {
      id: temporaryId,
      conversationId,
      senderType: "CUSTOMER",
      content: draftText || null,
      imageUrls: draftImages,
      createdAt: new Date().toISOString(),
      clientMessageId,
    };
    setSending(true);
    setMessages((current) => [...current, optimisticMessage]);
    setText("");
    setImages([]);
    try {
      let imageUrls: string[] = [];
      if (draftImages.length) {
        for (const image of draftImages) {
          const upload = await fetch(`${API_BASE_URL}/messages/upload`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image }),
          });
          const result = await upload.json();
          if (!upload.ok) throw new Error(result.message);
          imageUrls.push(result.data[0]);
        }
      }
      const payload = { content: draftText, imageUrls, clientMessageId };
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send message");
      const message = result.data as ChatMessage;
      setMessages((current) =>
        current
          .map((item) => (item.id === temporaryId ? message : item))
          .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
      );
    } catch (error: any) {
      setMessages((current) => current.filter((item) => item.id !== temporaryId));
      setText(draftText);
      setImages(draftImages);
      alert(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {open && (
        <div
          className={`mb-3 w-[calc(100vw-2rem)] sm:w-[380px] h-[560px] max-h-[75vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 border ${
            isLight
              ? "bg-white border-slate-200 shadow-slate-900/15"
              : "bg-[#151515] border-white/10 shadow-black/60"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-orange-600 via-orange-500 to-rose-600 flex items-center justify-between text-white select-none shrink-0 shadow-md">
            <div className="chat-header-text">
              <p className="font-black text-white text-white-force tracking-tight text-base leading-tight">
                Velora Support
              </p>
              <p className="text-[11px] text-white/90 text-white-force font-medium mt-0.5">
                Direct assistance from our support team
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-white/90 hover:text-white rounded-lg hover:bg-white/15 transition cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages Body */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-3.5 transition-colors duration-200 ${
              isLight ? "bg-slate-50" : "bg-[#0f0f0f]"
            }`}
          >
            {loading && (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-white/60"}`}>
                  Connecting to support...
                </p>
              </div>
            )}

            {unauthorized && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLight ? "bg-orange-100" : "bg-orange-500/15"}`}>
                  <MessageCircle className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                    Sign in required
                  </p>
                  <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-white/60"}`}>
                    Please sign in to chat directly with our support team.
                  </p>
                </div>
                <Link
                  href="/account/login"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition"
                >
                  Sign In Now
                </Link>
              </div>
            )}

            {!loading && !unauthorized && connectionError && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-6">
                <MessageCircle className="w-10 h-10 text-orange-500" />
                <p className={`text-xs font-medium leading-relaxed ${isLight ? "text-slate-600" : "text-white/80"}`}>
                  {connectionError}
                </p>
                <button
                  onClick={() => setRetryKey((value) => value + 1)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {!loading && !unauthorized && !connectionError && messages.length === 0 && (
              <div className="text-center mt-12 space-y-2">
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${isLight ? "bg-orange-100" : "bg-white/5"}`}>
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
                <p className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-white/90"}`}>
                  Welcome to Velora Support!
                </p>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  How can we help you today? Ask about products, sizes, or orders.
                </p>
                {!realtimeConnected && (
                  <p className={`text-[11px] font-medium mt-3 px-3 py-1.5 rounded-lg inline-block ${isLight ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-amber-400/10 text-amber-300 border border-amber-400/20"}`}>
                    ⚡ Connecting to realtime server...
                  </p>
                )}
              </div>
            )}

            {messages.map((message, index) => {
              const noticeKind = getWaitingNoticeKind(messages, index);
              const isCustomer = message.senderType === "CUSTOMER";

              return (
                <div key={message.id} className="space-y-3">
                  <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm transition-all ${
                        isCustomer
                          ? "chat-customer-bubble bg-orange-600 text-white rounded-br-sm shadow-orange-600/10"
                          : isLight
                          ? "chat-admin-bubble bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
                          : "chat-admin-bubble bg-white/10 text-white border border-white/5 rounded-bl-sm"
                      }`}
                    >
                      {message.imageUrls?.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noreferrer">
                          <img
                            src={url}
                            alt="Chat attachment"
                            className={`rounded-xl mb-2 max-h-52 w-full object-cover border ${
                              isCustomer
                                ? "border-orange-400/40"
                                : isLight
                                ? "border-slate-200"
                                : "border-white/10"
                            }`}
                          />
                        </a>
                      ))}
                      {message.content && (
                        <p className={`whitespace-pre-wrap break-words leading-relaxed font-medium ${
                          isCustomer ? "text-white text-white-force" : isLight ? "text-slate-900" : "text-white"
                        }`}>
                          {message.content}
                        </p>
                      )}
                      <p
                        className={`text-[10px] text-right mt-1.5 font-mono ${
                          isCustomer
                            ? "chat-timestamp text-white/80 text-white-force"
                            : isLight
                            ? "chat-timestamp text-slate-400"
                            : "chat-timestamp text-white/60"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {noticeKind && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`mx-auto max-w-[92%] rounded-2xl px-3.5 py-3 text-center border shadow-sm ${
                        isLight
                          ? "border-orange-200 bg-orange-50/90 text-orange-950"
                          : "border-orange-500/25 bg-orange-500/10 text-white"
                      }`}
                    >
                      <p className={`text-[11px] font-extrabold uppercase tracking-wider ${isLight ? "text-orange-700" : "text-orange-300"}`}>
                        Automated message
                      </p>
                      <p className={`mt-1 text-xs leading-relaxed font-medium ${isLight ? "text-orange-950" : "text-white/80"}`}>
                        {noticeKind === "FIRST_CONTACT"
                          ? "Thank you for reaching out to Velora! Please hold on a moment, our support team will respond shortly."
                          : "Welcome back! Velora has received your new request. Please give our support team a moment to respond."}
                      </p>
                      <p className={`mt-1.5 text-[10px] font-medium ${isLight ? "text-orange-700/80" : "text-white/50"}`}>
                        You can still send additional info, photos, or order numbers while waiting.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Footer Input */}
          {!unauthorized && !connectionError && (
            <div
              className={`p-3 border-t space-y-2 transition-colors duration-200 shrink-0 ${
                isLight ? "bg-white border-slate-200" : "bg-[#151515] border-white/10"
              }`}
            >
              {images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((url, index) => (
                    <div key={index} className="relative shrink-0">
                      <img
                        src={url}
                        alt="Attachment preview"
                        className={`w-14 h-14 rounded-xl object-cover border ${
                          isLight ? "border-slate-200" : "border-white/20"
                        }`}
                      />
                      <button
                        onClick={() => setImages((items) => items.filter((_, i) => i !== index))}
                        className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full p-0.5 shadow hover:bg-red-600 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <label
                  className={`p-2.5 rounded-xl cursor-pointer transition border shrink-0 flex items-center justify-center ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-white/70"
                  }`}
                  title="Attach images (up to 5)"
                >
                  <ImageIcon className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => chooseImages(e.target.files)}
                  />
                </label>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Type a message..."
                  className={`flex-1 max-h-24 resize-none rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition border ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white"
                      : "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:bg-white/10"
                  }`}
                />

                <button
                  onClick={sendMessage}
                  disabled={sending || !conversationId || (!text.trim() && images.length === 0)}
                  className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white shadow-md shadow-orange-600/20 transition cursor-pointer shrink-0 flex items-center justify-center"
                  aria-label="Send message"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setOpen((value) => !value);
          setUnread(0);
        }}
        className="ml-auto w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 text-white shadow-xl shadow-orange-600/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-7 h-7" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
