"use client";

import { ReactNode } from "react";

interface StoryPageProps {
    children: ReactNode;
    pageNumber?: number;
}

export function StoryPage({ children, pageNumber }: StoryPageProps) {
    return (
        <div className="story-page bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-r-2xl">
            <div className="h-full w-full p-6 md:p-8 flex flex-col">
                {children}
            </div>
            {pageNumber !== undefined && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
                    {pageNumber}
                </div>
            )}
        </div>
    );
}
