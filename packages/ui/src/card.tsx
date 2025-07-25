import { type JSX } from "react";
interface CardInterface {
  className?: string;
  title?: string;
  children: React.ReactNode;
  href?: string;
  size? : string
}

export function Card({
  className,
  title,
  children,
  href,
  size = "sm"
}:CardInterface ): JSX.Element {

  const sizeClasses : Record<string , string> =  {
    "sm" : "w-60 h-60",
    "md" : "w-80 h-80",
    "lg" : "w-[25rem] h-[22.5rem]"
  }
  return (
  <div className={`${sizeClasses[size]} p-8 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700`}>
      {children}
  </div>

  );
}
