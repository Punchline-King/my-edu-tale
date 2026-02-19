"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    showCloseButton = true,
    className = "",
}: ModalProps) {
    // Handle ESC key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-[120] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`
                bg-white rounded-3xl shadow-2xl 
                max-w-2xl w-full max-h-[90vh] overflow-y-auto
                ${className}
              `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    {title && (
                                        <h2 className="text-2xl font-bold text-foreground">
                                            {title}
                                        </h2>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            aria-label="Close modal"
                                        >
                                            <X size={24} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
