import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-offset-2  "
    >
      {children}
    </button>
  );
}
