import { motion } from "motion/react";
import { Bot, User, Copy, RotateCcw, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Message } from "../../types";
import { cn, formatDate } from "../../lib/utils";
import { Button } from "../ui/button";

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  isLast: boolean;
}

export function ChatMessage({ message, onRegenerate, isLast }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 px-4 py-8 md:px-8 group",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="flex-shrink-0 pt-0.5">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-[10px] shadow-sm",
          isAssistant 
            ? "bg-indigo-600 text-white" 
            : "bg-slate-700 text-white"
        )}>
          {isAssistant ? "AI" : "ME"}
        </div>
      </div>
      
      <div className={cn("min-w-0 max-w-2xl space-y-2", !isAssistant && "flex flex-col items-end")}>
        <div className={cn(
          "p-5 rounded-2xl shadow-sm border leading-relaxed",
          isAssistant 
            ? "bg-slate-900/50 border-slate-800 text-slate-300 rounded-tl-none" 
            : "bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-indigo-500/10 shadow-lg"
        )}>
          <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed prose-p:text-inherit">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative group/code my-4">
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl !bg-black/40 !p-4 !m-0 ring-1 ring-white/10"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                      <button 
                        onClick={() => navigator.clipboard.writeText(String(children))}
                        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/50 opacity-0 group-hover/code:opacity-100 transition-opacity"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  ) : (
                    <code className={cn("bg-black/20 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[13px]", className)} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {isAssistant && (
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
               <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                 Matched Source: 92%
               </span>
               <div className="flex gap-2">
                 <button 
                   onClick={copyToClipboard}
                   className="px-2.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 rounded border border-slate-700 transition-colors uppercase font-bold tracking-wider"
                 >
                   {copied ? "Copied" : "Copy"}
                 </button>
                 {isLast && onRegenerate && (
                   <button 
                     onClick={onRegenerate}
                     className="px-2.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 rounded border border-slate-700 transition-colors uppercase font-bold tracking-wider"
                   >
                     Regenerate
                   </button>
                 )}
               </div>
            </div>
          )}
        </div>
        <div className="text-[10px] text-slate-500 font-medium px-1">
          {formatDate(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
}
