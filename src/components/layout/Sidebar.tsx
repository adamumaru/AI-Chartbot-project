import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Library, Settings, Info, Plus, Trash2, Search, Menu, X, ArrowLeft, LogOut, LogIn } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  histories: any[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  histories, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  isOpen,
  onClose,
  user,
  onLogout,
  onLoginClick
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getInitials = () => {
    if (!user) return "AN";
    const name = user.user_metadata?.full_name || user.email || "WU";
    return name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest User";


  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
          />
          
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-black/60 backdrop-blur-xl md:relative md:flex"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-3 font-bold text-lg tracking-tight text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 shadow-lg shadow-rose-500/20">
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin-slow"></div>
                </div>
                <span>Health Tips chatbot</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-slate-400">
                <X size={20} />
              </Button>
            </div>

            <div className="px-6 py-2">
              <Button 
                onClick={onNewChat}
                className="w-full flex items-center justify-between px-4 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all text-sm font-medium shadow-xl shadow-indigo-500/25 border-none"
              >
                New Chat
                <Plus size={18} className="opacity-70" />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden px-4 py-6">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 px-4 py-6 text-sm font-medium transition-all duration-200 rounded-xl",
                      activeTab === item.id 
                        ? "bg-neutral-900 text-white border border-neutral-800/50 shadow-inner" 
                        : "text-slate-400 hover:bg-neutral-900/30 hover:text-slate-200"
                    )}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                  >
                    <item.icon size={18} className={cn(activeTab === item.id ? "text-indigo-400" : "")} />
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="mt-10 px-4 mb-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold block">History</label>
              </div>

              <ScrollArea className="h-[calc(100vh-480px)]">
                <div className="space-y-1 pr-4">
                  {histories.map((chat) => (
                    <div key={chat.id} className="group relative">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 px-4 py-5 text-xs truncate transition-all duration-200 rounded-xl",
                          currentChatId === chat.id && activeTab === 'chat' 
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                            : "text-slate-500 hover:text-slate-300 hover:bg-neutral-900/20"
                        )}
                        onClick={() => {
                          onSelectChat(chat.id);
                          setActiveTab('chat');
                          if (window.innerWidth < 768) onClose();
                        }}
                      >
                        <MessageSquare size={14} className="flex-shrink-0 opacity-50" />
                        <span className="truncate">{chat.title}</span>
                      </Button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 opacity-0 hover:text-destructive group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {histories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-30">
                      <MessageSquare size={20} className="mb-2" />
                      <p className="text-[10px] uppercase tracking-wider">No history</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-auto border-t border-border p-6 bg-black/40">
              {user ? (
                showLogoutConfirm ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-3 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block text-center">Confirm Sign Out?</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          onLogout?.();
                          setShowLogoutConfirm(false);
                        }}
                        className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer border-none"
                      >
                        Sign Out
                      </button>
                      <button 
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors border border-border/80 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-900/40 transition-colors group">
                    <div className="h-9 w-9 rounded-full bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-xs font-bold text-rose-400">
                      {getInitials()}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-200 truncate">{displayName}</span>
                      <span className="text-[9px] uppercase tracking-tight text-emerald-400 font-bold">Cloud Synced</span>
                    </div>
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      title="Log Out"
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                )
              ) : (
                <Button 
                  onClick={onLoginClick}
                  className="w-full flex items-center justify-center gap-2 py-5 bg-neutral-950 hover:bg-neutral-900 border border-border/80 text-xs font-bold uppercase tracking-wider text-slate-300 rounded-xl transition-all shadow-inner"
                >
                  <LogIn size={14} className="text-rose-400" />
                  Sign In for Cloud Sync
                </Button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
