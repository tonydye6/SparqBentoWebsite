import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BentoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BentoCardModal({
  isOpen,
  onClose,
  children,
  title
}: BentoCardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 bg-background/95 backdrop-blur-sm border-none">
        <div className="relative h-full flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {title && (
            <div className="px-6 py-4 border-b">
              <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
          )}
          
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
