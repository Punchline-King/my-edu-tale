"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-blue-500 text-white shadow-lg",
    secondary: "bg-secondary hover:bg-purple-500 text-white shadow-lg",
    success: "bg-success hover:bg-green-500 text-white shadow-lg",
    danger: "bg-danger hover:bg-red-500 text-white shadow-lg",
    ghost: "bg-white/80 hover:bg-white text-foreground shadow-md",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-3xl",
    xl: "px-10 py-6 text-2xl md:text-3xl rounded-3xl",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`
        font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Loading...
                </span>
            ) : (
                children
            )}
        </motion.button>
    );
}
