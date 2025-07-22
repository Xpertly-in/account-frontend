"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/helper/tw.helper";

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

function Avatar({ className, src, alt, name, size = "md", children, ...props }: AvatarProps) {
  console.log("Avatar render:", { src, alt, name, size });

  // Helper function to get customer initials for avatar fallback
  const getInitials = (fullName: string): string => {
    if (!fullName || fullName.trim() === "") return "?";

    // Clean the name: remove extra spaces, special characters for splitting
    const cleanName = fullName
      .trim()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ");
    const words = cleanName.split(" ").filter(word => word.length > 0);

    if (words.length === 0) return "?";
    if (words.length === 1) return words[0].charAt(0).toUpperCase();

    // Take first letter of first name and first letter of last name
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  // Helper function to get dynamic avatar color based on customer name
  const getAvatarColor = (fullName: string): { light: string; dark: string } => {
    const colorPairs = [
      {
        light: "from-blue-100 via-blue-200 to-blue-300",
        dark: "from-blue-500 via-blue-600 to-blue-700",
      },
      {
        light: "from-emerald-100 via-emerald-200 to-emerald-300",
        dark: "from-emerald-500 via-emerald-600 to-emerald-700",
      },
      {
        light: "from-purple-100 via-purple-200 to-purple-300",
        dark: "from-purple-500 via-purple-600 to-purple-700",
      },
      {
        light: "from-orange-100 via-orange-200 to-orange-300",
        dark: "from-orange-500 via-orange-600 to-orange-700",
      },
      {
        light: "from-pink-100 via-pink-200 to-pink-300",
        dark: "from-pink-500 via-pink-600 to-pink-700",
      },
      {
        light: "from-indigo-100 via-indigo-200 to-indigo-300",
        dark: "from-indigo-500 via-indigo-600 to-indigo-700",
      },
      {
        light: "from-teal-100 via-teal-200 to-teal-300",
        dark: "from-teal-500 via-teal-600 to-teal-700",
      },
      {
        light: "from-red-100 via-red-200 to-red-300",
        dark: "from-red-500 via-red-600 to-red-700",
      },
      {
        light: "from-cyan-100 via-cyan-200 to-cyan-300",
        dark: "from-cyan-500 via-cyan-600 to-cyan-700",
      },
      {
        light: "from-amber-100 via-amber-200 to-amber-300",
        dark: "from-amber-500 via-amber-600 to-amber-700",
      },
      {
        light: "from-lime-100 via-lime-200 to-lime-300",
        dark: "from-lime-500 via-lime-600 to-lime-700",
      },
      {
        light: "from-rose-100 via-rose-200 to-rose-300",
        dark: "from-rose-500 via-rose-600 to-rose-700",
      },
      {
        light: "from-violet-100 via-violet-200 to-violet-300",
        dark: "from-violet-500 via-violet-600 to-violet-700",
      },
      {
        light: "from-sky-100 via-sky-200 to-sky-300",
        dark: "from-sky-500 via-sky-600 to-sky-700",
      },
      {
        light: "from-green-100 via-green-200 to-green-300",
        dark: "from-green-500 via-green-600 to-green-700",
      },
      {
        light: "from-slate-100 via-slate-200 to-slate-300",
        dark: "from-slate-500 via-slate-600 to-slate-700",
      },
    ];

    // Generate consistent color based on name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = ((hash << 5) - hash + fullName.charCodeAt(i)) & 0xffffffff;
    }
    return colorPairs[Math.abs(hash) % colorPairs.length];
  };

  // Size configurations
  const sizeConfig = {
    xs: {
      container: "h-6 w-6",
      text: "text-xs font-semibold",
      ring: "ring-1",
    },
    sm: {
      container: "h-8 w-8",
      text: "text-sm font-semibold",
      ring: "ring-1",
    },
    md: {
      container: "h-10 w-10",
      text: "text-base font-bold",
      ring: "ring-2",
    },
    lg: {
      container: "h-12 w-12",
      text: "text-lg font-bold",
      ring: "ring-2",
    },
    xl: {
      container: "h-16 w-16",
      text: "text-xl font-bold",
      ring: "ring-2",
    },
    "2xl": {
      container: "h-20 w-20",
      text: "text-2xl font-bold",
      ring: "ring-3",
    },
  };

  const config = sizeConfig[size];
  const initials = name ? getInitials(name) : "";
  const colorPair = name
    ? getAvatarColor(name)
    : {
        light: "from-gray-200 to-gray-300",
        dark: "from-gray-600 to-gray-700",
      };

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        "ring-white/20 ring-offset-2 ring-offset-background",
        "transition-all duration-300 ease-out",
        "hover:ring-4 hover:ring-blue-500/30 hover:scale-105 hover:shadow-lg",
        "focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none",
        "cursor-pointer select-none",
        config.container,
        config.ring,
        className
      )}
      {...props}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={alt || name || ""}
          className="object-cover w-full h-full transition-all duration-300"
        />
      )}
      {name && initials && (
        <div className="relative w-full h-full">
          {/* Light mode fallback */}
          <AvatarFallback
            className={cn(
              "tracking-tight leading-none font-black",
              "flex items-center justify-center w-full h-full",
              "shadow-lg shadow-black/25",
              "relative overflow-hidden",
              "border border-gray-300/30",
              `bg-gradient-to-br ${colorPair.light} text-gray-900`,
              "dark:hidden",
              config.text
            )}
          >
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
            <span className="relative z-10 font-black">{initials}</span>
          </AvatarFallback>

          {/* Dark mode fallback */}
          <AvatarFallback
            className={cn(
              "tracking-tight leading-none font-black",
              "flex items-center justify-center w-full h-full",
              "shadow-lg shadow-black/25",
              "relative overflow-hidden",
              "border border-white/10",
              `bg-gradient-to-br ${colorPair.dark} text-white`,
              "hidden dark:flex",
              "absolute inset-0",
              config.text
            )}
          >
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
            <span className="relative z-10 font-black">{initials}</span>
          </AvatarFallback>
        </div>
      )}
      {children}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  console.log("AvatarImage render:", { src: props.src, alt: props.alt });

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square h-full w-full object-cover",
        "transition-all duration-300 ease-out",
        className
      )}
      onLoad={() => console.log("Avatar image loaded successfully:", props.src)}
      onError={e => console.log("Avatar image failed to load:", props.src, e)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full",
        "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800",
        "text-gray-700 dark:text-gray-200 font-semibold",
        "transition-all duration-300 ease-out",
        "border border-gray-300/50 dark:border-gray-600/50",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
