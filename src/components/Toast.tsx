import { useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-slide-up">
      <div
        className={`rounded-xl shadow-2xl p-4 pr-12 flex items-center gap-3 min-w-[300px] ${
          type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
        )}
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
