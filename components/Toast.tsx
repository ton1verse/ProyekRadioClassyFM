'use client';

import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const bgColor = type === 'success' ? 'bg-[#22c55e]' : type === 'error' ? 'bg-[#ef4444]' : 'bg-blue-600';
    const icon = type === 'success' ? <CheckCircle className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />;
    const title = type === 'success' ? 'Berhasil' : 'Gagal';

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
        >
            <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-start space-x-4 min-w-[300px] max-w-sm`}>
                <div className="mt-1">
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{title}</h4>
                    <p className="text-sm text-white/90 leading-relaxed font-light">
                        {message}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="text-white/70 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
