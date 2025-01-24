import { useEffect } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { Badge } from "@/lib/badges";

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastProvider>
      <Toast className="bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="grid gap-1">
          <ToastTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">{badge.icon}</span>
            Badge Unlocked!
          </ToastTitle>
          <ToastDescription className="text-white/90">
            {badge.name} - {badge.description}
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
