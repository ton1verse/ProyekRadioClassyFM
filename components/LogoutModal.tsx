import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function LogoutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    {/* Logout Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <LogOut className="w-6 h-6 text-red-600 ml-1" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
                    <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                        Apakah Anda yakin ingin keluar dari aplikasi? <br />Anda harus login kembali untuk mengakses dashboard.
                    </p>

                    {/* Actions */}
                    <div className="flex space-x-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? 'Keluar...' : 'Ya, Keluar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
