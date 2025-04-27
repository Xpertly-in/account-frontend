"use client";

import { useState } from "react";
import LoginForm from "./LoginForm.component";
import SignUpForm from "./SignUpForm.component";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Briefcase } from "@phosphor-icons/react";

type TabType = "login" | "signup";

interface AuthTabsProps {
  defaultTab?: TabType;
  showCALoginButton?: boolean;
}

export default function AuthTabs({
  defaultTab = "login",
  showCALoginButton = true,
}: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  return (
    <div className="w-full max-w-md rounded-xl border border-border/50 bg-card shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
      {/* Colored top border */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-secondary to-accent"></div>

      {/* Tabs */}
      <div className="relative flex">
        <button
          className={cn(
            "flex-1 rounded-tl-lg border-b-2 py-4 text-sm font-medium transition-colors",
            activeTab === "login"
              ? "border-primary text-primary dark:border-blue-500 dark:text-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground dark:hover:text-foreground"
          )}
          onClick={() => setActiveTab("login")}
        >
          Sign In
        </button>
        <button
          className={cn(
            "flex-1 rounded-tr-lg border-b-2 py-4 text-sm font-medium transition-colors",
            activeTab === "signup"
              ? "border-primary text-primary dark:border-blue-500 dark:text-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground dark:hover:text-foreground"
          )}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        {activeTab === "login" ? <LoginForm hideContainer /> : <SignUpForm hideContainer />}

        {/* CA Login Button */}
        {showCALoginButton && (
          <div className="mt-6 text-center">
            <div className="relative flex items-center py-2 mb-4">
              <div className="flex-grow border-t border-border dark:border-blue-800/50"></div>
              <span className="mx-3 flex-shrink text-xs text-muted-foreground dark:text-blue-100/50">
                OR
              </span>
              <div className="flex-grow border-t border-border dark:border-blue-800/50"></div>
            </div>
            <Link
              href="/ca/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Briefcase weight="bold" className="w-4 h-4" />
              <span>Login as CA</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
