import { Send, Hash } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative mx-auto max-w-3xl px-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end w-full overflow-hidden transition-all duration-300 border border-slate-800 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-indigo-500/5 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50"
      >
        <div className="flex items-center justify-center p-4 text-slate-500">
          <Hash size={18} />
        </div>
        <textarea
          ref={textareaRef}
          placeholder={placeholder || "Ask your knowledge base..."}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex w-full resize-none bg-transparent px-0 py-4 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="p-3">
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || disabled}
            className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 shadow-lg shadow-indigo-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 group border-none"
          >
            Send
            <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}
