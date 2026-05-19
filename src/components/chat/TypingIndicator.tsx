import { motion } from "motion/react";

export function TypingIndicator() {
  return (
    <div className="flex w-full gap-4 px-4 py-8 md:px-6 bg-muted/30">
      <div className="flex-shrink-0 pt-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm ring-1 ring-border">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
          </motion.div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 pt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          />
        ))}
      </div>
    </div>
  );
}
