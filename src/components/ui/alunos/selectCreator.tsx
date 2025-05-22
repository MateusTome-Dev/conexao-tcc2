"use client";

import * as React from "react";

interface SelectContextType {
  value: string | null;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export function Select({ 
  children, 
  value: propValue, 
  onValueChange, 
  defaultValue 
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || null);
  const [isOpen, setIsOpen] = React.useState(false);

  // Determina se o componente é controlado ou não
  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ 
      value, 
      onValueChange: handleValueChange, 
      isOpen, 
      setIsOpen 
    }}>
      <div className="relative w-48">{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within a Select");

  return (
    <button
      className={`flex flex-row justify-center border dark:border-[#0077FF] px-4 py-2 rounded w-full text-left ${className} w-[180px]`}
      onClick={() => context.setIsOpen(!context.isOpen)}
    >
      {children}
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
  children?: (value: string | null) => React.ReactNode;
}

export function SelectValue({ 
  placeholder = "Tipo de ocorrência", 
  children 
}: SelectValueProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Error");

  return (
    <span className="text-gray-700 dark:text-white w-36 flex flex-row justify-center">
      {children ? children(context.value) : context.value || placeholder}
    </span>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Error");

  return context.isOpen ? (
    <div className="absolute mt-2 w-full border dark:border-[#141414] bg-white dark:bg-black dark:text-white shadow-md z-50">
      {children}
    </div>
  ) : null;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export function SelectItem({ children, value, disabled = false }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Error");

  return (
    <div
      className={`px-4 py-2 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100 dark:hover:bg-[#141414] cursor-pointer"
      }`}
      onClick={() => !disabled && context.onValueChange(value)}
    >
      {children}
    </div>
  );
}