import { motion } from "motion/react";
import { Bot, Info, Github, Twitter, Globe, Heart, ShieldCheck, Cpu } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";

export function AboutView() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-xl">
          <Info size={40} />
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">About KnowledgeBot</h2>
        <div className="flex justify-center gap-2 mb-6">
          <Badge variant="outline" className="rounded-full px-4 py-1">Version 1.0.0</Badge>
          <Badge className="rounded-full px-4 py-1 bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
        </div>
        <p className="max-w-xl mx-auto text-muted-foreground text-lg italic">
          "Empowering knowledge management with state-of-the-art AI intelligence, 
          delivered with a focus on privacy and user experience."
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-muted-foreground/10 bg-background/50 p-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-lg">Our Technology</h3>
          </div>
          <CardContent className="px-0 pb-0 text-muted-foreground text-sm leading-relaxed space-y-4">
            <p>
              KnowledgeBot is built using the latest web technologies, including React 19, 
              Tailwind CSS, and Framer Motion for a smooth, high-fidelity experience.
            </p>
            <p>
              Processing is powered by Google's Gemini Pro model, optimized for accurate 
              context retrieval and natural conversation.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-muted-foreground/10 bg-background/50 p-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-lg">Our Promise</h3>
          </div>
          <CardContent className="px-0 pb-0 text-muted-foreground text-sm leading-relaxed space-y-4">
            <p>
              Your data is yours. We believe that personal information should stay personal. 
              KnowledgeBot uses Zero-Backend storage philosophy wherever possible.
            </p>
            <p>
              By storing your knowledge base in LocalStorage, we ensure that you have 
              complete control over what you share and delete.
            </p>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-16 flex flex-col items-center gap-8"
      >
        <Separator className="w-full max-w-xs" />
        <div className="flex gap-6">
          <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
            <Globe size={20} />
          </a>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> by the AI Coding Team
        </p>
      </motion.div>
    </div>
  );
}
