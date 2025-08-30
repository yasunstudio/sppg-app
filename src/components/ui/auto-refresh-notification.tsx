import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export function AutoRefreshNotification({ message, type = 'info', duration = 3000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
  }[type];

  const textColor = {
    success: 'text-green-800 dark:text-green-200',
    info: 'text-blue-800 dark:text-blue-200',
    warning: 'text-yellow-800 dark:text-yellow-200'
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <Card className={`${bgColor} p-3 min-w-[280px] shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
            <span className={`text-sm font-medium ${textColor}`}>
              {message}
            </span>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className={`${textColor} hover:opacity-75`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
