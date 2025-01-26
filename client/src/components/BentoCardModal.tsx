import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BentoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20
  }
};

export function BentoCardModal({
  isOpen,
  onClose,
  children,
  title
}: BentoCardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 border-none overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          className="relative h-full flex flex-col bg-background/80 backdrop-blur-md rounded-lg"
          style={{
            boxShadow: "0 0 20px rgba(235, 0, 40, 0.3), 0 0 40px rgba(235, 0, 40, 0.1)",
            border: "1px solid rgba(235, 0, 40, 0.3)"
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 text-white hover:bg-white/10 hover:scale-110 transition-all duration-200"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {title && (
            <div className="px-8 py-6 border-b border-white/10">
              <h2 className="font-heading text-2xl font-semibold text-white"
                  style={{ 
                    textShadow: "0 0 10px rgba(235, 0, 40, 0.3)",
                    fontFamily: "Chakra Petch, sans-serif"
                  }}>
                {title}
              </h2>
            </div>
          )}

          <div className="flex-1 overflow-auto p-8 font-body">
            {children}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}