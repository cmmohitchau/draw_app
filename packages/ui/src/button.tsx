"use client";

import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps   {
  children: ReactNode;
  className?: string;
  onclick : MouseEventHandler<HTMLButtonElement>;
  size? : "sm" | "md" | "lg"
}

export const Button =
 ({
  children,
  className ,
  onclick ,
  size= "sm"
 }: ButtonProps) => {
  const baseClasses =
    "text-white font-medium rounded-lg text-center me-2 mb-2 focus:outline-none focus:ring-4";

  const sizeClasses: Record<string, string> = {
    sm: "text-sm px-3 py-2",
    md: "text-base px-5 py-3",
    lg: "text-lg px-7 py-4",
  };
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className ?? ""} w-full`}
      onClick={onclick}
    >
      {children}
    </button>
  );
};
