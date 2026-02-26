import { ReactLenis } from '@studio-freight/react-lenis';
import React from 'react';

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,
                duration: 1.5,
                smoothWheel: true,
            }}
        >
            {children}
        </ReactLenis>
    );
}
