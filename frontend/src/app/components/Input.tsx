import React, { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, type = "text", onChange, ...rest }, ref) => {
    return (
      <input
        className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
        ref={ref}
        onChange={onChange}
        type={type}
        name={name}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
