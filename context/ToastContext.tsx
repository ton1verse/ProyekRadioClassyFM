'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastContextType {
    idx: number; // to force re-render if needed, mostly internal
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);
    const [count, setCount] = useState(0);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setCount(c => c + 1);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ idx: count, showToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col space-y-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className="relative">
                        {/* Note: We handle positioning in the Toast component itself relative to the container if needed, 
                 but normally a stack is handled here. 
                 The Toast component previously defined had fixed positioning. 
                 We should slightly adjust the Toast component or the container. 
                 Since the user screenshot implies a stack, we'll let the container handle stacking.
             */}
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
