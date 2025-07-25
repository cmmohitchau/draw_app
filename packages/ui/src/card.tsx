import { type JSX } from "react";
interface CardInterface {
  className?: string;
  title?: string;
  children: React.ReactNode;
  href?: string;
}

export function Card({
  className,
  title,
  children,
  href,
}:CardInterface ): JSX.Element {
  return (
  <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {children}
  </div>

  );
}
