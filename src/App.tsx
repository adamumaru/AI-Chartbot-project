import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { Menu } from "lucide-react";
import { Sidebar } from "./components/layout/Sidebar";
import { LandingView } from "./components/views/LandingView";
import { ChatView } from "./components/views/ChatView";
import { SettingsView } from "./components/views/SettingsView";
import { AboutView } from "./components/views/AboutView";
import { AuthView } from "./components/views/AuthView";
import { useChat } from "./hooks/useChat";
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { 
    histories, 
    currentChat,
    currentChatId, 
    setCurrentChatId, 
    createChat, 
    addMessage,
    clearMessages,
    deleteChat,
    user,
    logout
  } = useChat();

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to chat if logged in and currently on landing or auth
  useEffect(() => {
    if (user && (activeTab === "landing" || activeTab === "auth")) {
      setActiveTab("chat");
    }
  }, [user, activeTab]);

  const handleStart = () => {
    if (histories.length === 0) {
      createChat();
    }
    setActiveTab("chat");
  };

  const renderView = () => {
    switch (activeTab) {
      case "landing":
        return <LandingView onStart={handleStart} />;
      case "chat":
        return (
          <ChatView 
            currentChat={currentChat}
            currentChatId={currentChatId}
            addMessage={addMessage}
            clearMessages={clearMessages}
          />
        );
      case "auth":
        return <AuthView onAuthSuccess={() => setActiveTab("chat")} onBack={() => setActiveTab("landing")} />;
      case "settings":
        return <SettingsView />;
      case "about":
        return <AboutView />;
      default:
        return <LandingView onStart={handleStart} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden dark">
        {activeTab !== "landing" && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            histories={histories}
            currentChatId={currentChatId}
            onSelectChat={setCurrentChatId}
            onNewChat={createChat}
            onDeleteChat={deleteChat}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            user={user}
            onLogout={logout}
            onLoginClick={() => setActiveTab("auth")}
          />
        )}

        <main className="relative flex flex-1 flex-col overflow-hidden">
          {activeTab !== "landing" && !isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-4 top-4 z-30 h-10 w-10 rounded-xl bg-background/50 backdrop-blur-md shadow-sm md:hidden"
            >
              <Menu size={20} />
            </Button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-auto"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Toaster position="top-right" richColors />
      </div>
    </TooltipProvider>
  );
}
