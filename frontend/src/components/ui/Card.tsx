"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

type CardVariant = "default" | "lemon" | "sky" | "mint" | "pink" | "lavender";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    variant?: CardVariant;
    className?: string;
    hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
    default: "bg-white/90",
    lemon: "bg-gradient-to-br from-lemon to-yellow-100",
    sky: "bg-gradient-to-br from-sky to-blue-100",
    mint: "bg-gradient-to-br from-mint to-green-100",
    pink: "bg-gradient-to-br from-pink to-pink-100",
    lavender: "bg-gradient-to-br from-lavender to-purple-100",
};

export function Card({
    children,
    variant = "default",
    className = "",
    hover = true,
    ...props
}: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
        rounded-3xl shadow-lg p-6
        ${variantStyles[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
}
