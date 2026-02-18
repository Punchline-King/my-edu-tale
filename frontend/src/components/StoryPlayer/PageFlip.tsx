"use client";

import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import HTMLFlipBook with no SSR - using default export
const HTMLFlipBookComponent = dynamic(
    () => import('react-pageflip'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-[600px] bg-amber-50 rounded-2xl">
                <div className="text-lg text-gray-600 animate-pulse">📖 책을 불러오는 중...</div>
            </div>
        ),
    }
) as any;

interface PageFlipBookProps {
    children: React.ReactNode;
    onPageChange?: (pageIndex: number) => void;
    width?: number;
    height?: number;
    usePortrait?: boolean;
}

export interface PageFlipBookHandle {
    flipNext: () => void;
    flipPrev: () => void;
    flipToPage: (page: number) => void;
    getCurrentPage: () => number;
}

export const PageFlipBook = forwardRef<PageFlipBookHandle, PageFlipBookProps>(
    ({ children, onPageChange, width = 550, height = 733, usePortrait = false }, ref) => {
        const bookRef = useRef<any>(null);
        const [isMounted, setIsMounted] = useState(false);

        useEffect(() => {
            setIsMounted(true);
        }, []);

        useImperativeHandle(ref, () => ({
            flipNext: () => {
                if (bookRef.current?.pageFlip) {
                    bookRef.current.pageFlip().flipNext();
                }
            },
            flipPrev: () => {
                if (bookRef.current?.pageFlip) {
                    bookRef.current.pageFlip().flipPrev();
                }
            },
            flipToPage: (page: number) => {
                if (bookRef.current?.pageFlip) {
                    bookRef.current.pageFlip().flip(page);
                }
            },
            getCurrentPage: () => {
                if (bookRef.current?.pageFlip) {
                    return bookRef.current.pageFlip().getCurrentPageIndex();
                }
                return 0;
            },
        }));

        const handleFlip = (e: any) => {
            if (onPageChange) {
                onPageChange(e.data);
            }
        };

        if (!isMounted) {
            return (
                <div className="flex items-center justify-center min-h-[600px] bg-amber-50 rounded-2xl">
                    <div className="text-lg text-gray-600">📚 책을 준비하는 중...</div>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center w-full bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl p-1 md:p-4 shadow-2xl">
                <HTMLFlipBookComponent
                    ref={bookRef}
                    width={width}
                    height={height}
                    size="fixed"
                    minWidth={width}
                    maxWidth={width}
                    minHeight={height}
                    maxHeight={height}
                    drawShadow={true}
                    flippingTime={800}
                    usePortrait={usePortrait}
                    startZIndex={0}
                    autoSize={false}
                    maxShadowOpacity={0.5}
                    showCover={false}
                    mobileScrollSupport={true}
                    onFlip={handleFlip}
                    className="book-flip-container"
                    style={{
                        margin: '0 auto',
                    }}
                >
                    {children}
                </HTMLFlipBookComponent>
            </div>
        );
    }
);

PageFlipBook.displayName = 'PageFlipBook';

// Page component for individual pages
interface PageProps {
    children: React.ReactNode;
    className?: string;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
    ({ children, className = '' }, ref) => {
        return (
            <div
                ref={ref}
                className={`page bg-white shadow-xl rounded-lg overflow-auto ${className}`}
                style={{
                    padding: '30px',
                    boxSizing: 'border-box',
                    height: '100%',
                }}
            >
                {children}
            </div>
        );
    }
);

Page.displayName = 'Page';
