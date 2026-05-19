import { motion } from "motion/react";
import { Bot, Zap, Shield, Sparkles, MessageSquare, ArrowRight, Library, Settings, Heart } from "lucide-react";
import { Button } from "../ui/button";

interface LandingViewProps {
  onStart: () => void;
}

export function LandingView({ onStart }: LandingViewProps) {
  const features = [
    {
      title: "Daily Wellness Tips",
      description: "Get actionable advice on nutrition, healthy eating, and physical fitness.",
      icon: Heart,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      title: "Holistic Guidance",
      description: "Focused on all wellness pillars: hydration, sleep, movement, and stress relief.",
      icon: Sparkles,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Instant Suggestions",
      description: "Powered by Gemini for reliable, lightning-fast health and lifestyle insights.",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Privacy First",
      description: "Your wellness chats are completely private and remain in your local browser.",
      icon: Shield,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 max-w-4xl"
      >
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-600 text-white shadow-2xl shadow-rose-500/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Heart size={40} className="relative z-10 fill-white" />
        </div>
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl text-white">
          The Simple <br />
          <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Health Tips Chatbot
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl leading-relaxed">
          Welcome to Health Tips chatbot. Get quick, simple, and daily wellness suggestions on nutrition, 
          physical activity, sleep quality, and healthy habits.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-6 mb-24"
      >
        <Button 
          size="lg" 
          onClick={onStart} 
          className="h-14 px-10 gap-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-2xl shadow-rose-500/30 group transition-all duration-300 text-sm font-bold uppercase tracking-widest border-none"
        >
          Start Coaching
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Button>
        <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl bg-neutral-900/50 backdrop-blur-md border-border text-slate-300 hover:text-white hover:bg-neutral-900 transition-all text-sm font-bold uppercase tracking-widest">
          Developer Docs
        </Button>
      </motion.div>

      <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 overflow-visible">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-start rounded-3xl border border-border/50 bg-card/30 p-8 text-left backdrop-blur-sm hover:border-indigo-500/50 hover:bg-card/50 transition-all duration-300 group shadow-lg"
          >
            <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", feature.bg, feature.color)}>
              <feature.icon size={24} />
            </div>
            <h3 className="mb-3 font-bold text-white tracking-tight">{feature.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors uppercase tracking-wider font-bold">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-24 flex flex-col items-center gap-6 pb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600">Personal Health Companion</span>
        <div className="flex gap-12 text-slate-700 opacity-40">
          <Sparkles size={24} />
          <Zap size={24} />
          <Heart size={24} />
          <Shield size={24} />
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
