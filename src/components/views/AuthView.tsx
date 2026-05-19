import { useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Heart, Mail, Lock, User, ArrowRight, Shield } from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

export function AuthView({ onAuthSuccess, onBack }: AuthViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name || "Wellness User",
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          toast.success("Successfully registered!");
          onAuthSuccess();
        } else {
          toast.success("Registration complete! Please check your email for verification.");
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
        onAuthSuccess();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[450px] p-8 rounded-[2.5rem] border border-border/40 bg-card/25 backdrop-blur-xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-rose-600/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mb-4">
            <Heart size={28} className="fill-rose-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isSignUp ? "Create your Wellness Account" : "Sign in to VitalityAI"}
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-xs">
            {isSignUp
              ? "Join us to track your daily health tips and personalize your wellness journey."
              : "Access your personalized health tips chatbot and chat history."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Full Name
              </Label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 h-12 bg-neutral-950/80 border-border/80 rounded-xl focus:ring-rose-500/50 text-slate-200 placeholder:text-slate-700"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Email Address
            </Label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 bg-neutral-950/80 border-border/80 rounded-xl focus:ring-rose-500/50 text-slate-200 placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Password
            </Label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-12 bg-neutral-950/80 border-border/80 rounded-xl focus:ring-rose-500/50 text-slate-200 placeholder:text-slate-700"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-widest text-xs border-none flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
            ) : (
              <>
                {isSignUp ? "Sign Up" : "Sign In"}
                <ArrowRight size={14} />
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-col items-center mt-6 gap-3 text-xs text-slate-500">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:text-rose-400 transition-colors font-medium"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Sign Up"}
          </button>
          
          <button
            onClick={onBack}
            className="hover:text-slate-300 transition-colors font-medium mt-1"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
