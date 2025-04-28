"use client";

import { useState } from "react";
import { cn } from "@/helper/tw.helper";
import LoginForm from "./LoginForm.component";
import SignUpForm from "./SignUpForm.component";
import { AnimatePresence, motion } from "framer-motion";

type TabType = "login" | "signup";

interface CAAuthTabsProps {
  defaultTab?: TabType;
}

export default function CAAuthTabs({ defaultTab = "login" }: CAAuthTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  return (
    <div className="w-full max-w-md rounded-xl border border-border/50 bg-card shadow-xl dark:border-blue-800/30 dark:bg-gray-900/95">
      {/* Colored top border */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="flex flex-col p-6 sm:p-8">
        {/* Tabs - Keep tab buttons a consistent style */}
        <div className="relative flex mb-6 border-b border-border dark:border-blue-800/50">
          <button
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-all duration-300 relative min-w-[100px]",
              activeTab === "login"
                ? "text-primary dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
            )}
            onClick={() => setActiveTab("login")}
          >
            Log in
            {activeTab === "login" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
          <button
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-all duration-300 relative min-w-[100px]",
              activeTab === "signup"
                ? "text-primary dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
            )}
            onClick={() => setActiveTab("signup")}
          >
            Sign up
            {activeTab === "signup" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        </div>

        {/* Form Content with animated transitions */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "login" ? <LoginForm hideContainer /> : <SignUpForm hideContainer />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
