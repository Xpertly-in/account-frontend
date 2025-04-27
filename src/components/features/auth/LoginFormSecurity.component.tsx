"use client";

import { Lock, ShieldCheck } from "@phosphor-icons/react";

export default function LoginFormSecurity() {
  return (
    <div className="mt-6 space-y-3 pt-4 border-t border-border dark:border-blue-800/50">
      <h3 className="text-sm font-medium text-foreground dark:text-white">Secure login</h3>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <ShieldCheck className="h-4 w-4 text-green-500" weight="fill" />
        </div>
        <p className="text-xs text-muted-foreground dark:text-blue-100/70">
          Your connection to Xpertly is encrypted end-to-end for maximum security
        </p>
      </div>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Lock className="h-4 w-4 text-green-500" weight="fill" />
        </div>
        <p className="text-xs text-muted-foreground dark:text-blue-100/70">
          We use industry-standard authentication protocols to protect your account
        </p>
      </div>
    </div>
  );
}
