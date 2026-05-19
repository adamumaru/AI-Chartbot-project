import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Eraser, Download, Settings, Library, Info, Sparkles, AlertTriangle, Bot } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useKnowledge } from "../../hooks/useKnowledge";
import { chatService } from "../../services/api";
import { ChatMessage } from "../chat/ChatMessage";
import { ChatInput } from "../chat/ChatInput";
import { TypingIndicator } from "../chat/TypingIndicator";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function ChatView() {
  const { currentChat, currentChatId, addMessage, clearMessages } = useChat();
  const { findRelevantContext } = useKnowledge();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages, isLoading]);

  const handleSend = async (content: string) => {
    if (!currentChatId) return;

    // 1. Add user message
    addMessage(currentChatId, { role: "user", content });
    setIsLoading(true);

    try {
      // 2. Find relevant context
      const context = findRelevantContext(content);
      
      // 3. Send to Gemini via server proxy
      const response = await chatService.sendMessage(
        content,
        context,
        currentChat?.messages || []
      );

      // 4. Add assistant response
      addMessage(currentChatId, { role: "assistant", content: response.text });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to get AI response");
      addMessage(currentChatId, { 
        role: "assistant", 
        content: `**Error:** ${error.message || "I encountered an issue connecting to the AI service. Please check your network or try again later."}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (currentChatId) {
      clearMessages(currentChatId);
      toast.success("Chat history cleared");
    }
  };

  const handleExport = () => {
    if (!currentChat) return;
    const content = currentChat.messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentChat.title}.txt`;
    a.click();
    toast.success("Chat exported as TXT");
  };

  if (!currentChatId) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <Sparkles size={48} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Start a New Conversation</h2>
        <p className="max-w-md text-muted-foreground mt-2">
          Select a chat from the sidebar or click the plus icon to start a fresh discussion with your AI companion.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border px-8 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles size={16} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white truncate max-w-[200px] md:max-w-md">{currentChat?.title || "Chat Assistant"}</h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] border border-indigo-500/20 font-bold uppercase tracking-wider">
              GEMINI 2.5 FLASH
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-slate-400 text-sm mr-2">
             <button onClick={handleExport} className="hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">Export</button>
             <button onClick={handleClear} className="hover:text-destructive transition-colors text-xs font-bold tracking-widest uppercase">Clear</button>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs shadow-sm shadow-black/20">☀️</div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl py-6 flex flex-col min-h-full">
          {currentChat?.messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center py-20 px-8 text-center animate-in fade-in duration-700">
              <div className="bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/10 mb-8 shadow-2xl shadow-indigo-500/5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                  <Bot size={36} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Hello! I am your custom knowledge assistant</h3>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-10">
                I can process your documents and provide answers based strictly on your context. What would you like to know today?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                {[
                  "What's in my knowledge base?",
                  "How to add more sources?",
                  "Privacy policy details",
                  "System capabilities"
                ].map(q => (
                  <Button 
                    key={q} 
                    variant="ghost" 
                    className="justify-start h-auto py-4 px-5 rounded-2xl text-xs font-semibold text-slate-300 bg-neutral-950/50 border border-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-800 transition-all text-left"
                    onClick={() => handleSend(q)}
                  >
                    <Sparkles size={12} className="mr-3 text-indigo-400" />
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="flex-1">
            {currentChat?.messages.map((message, i) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLast={i === currentChat.messages.length - 1}
                onRegenerate={() => {
                  const lastUserMsg = [...currentChat.messages].reverse().find(m => m.role === 'user');
                  if (lastUserMsg) handleSend(lastUserMsg.content);
                }}
              />
            ))}
          </div>
          {isLoading && <TypingIndicator />}
          <div ref={scrollRef} className="pt-2" />
        </div>
      </ScrollArea>

      {/* Footer / Input */}
      <footer className="p-8 bg-gradient-to-t from-background via-background to-transparent">
        <ChatInput onSend={handleSend} disabled={isLoading} />
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
          Knowledge-base restricted. Answers limited to verified context.
        </p>
      </footer>
    </div>
  );
}
