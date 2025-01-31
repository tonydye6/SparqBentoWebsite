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
      <DialogContent className="sm:max-w-4xl w-full h-[95vh] sm:h-[90vh] p-0 border-none">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          className="relative h-full flex flex-col bg-background/80 backdrop-blur-md rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 0 20px rgba(235, 0, 40, 0.3), 0 0 40px rgba(235, 0, 40, 0.1)",
            border: "1px solid rgba(235, 0, 40, 0.3)"
          }}
        >
          {title && (
            <div className="sticky top-0 px-6 py-4 border-b border-white/10 bg-background/95 backdrop-blur-sm">
              <h2 className="font-heading text-2xl font-semibold text-white"
                  style={{ 
                    textShadow: "0 0 10px rgba(235, 0, 40, 0.3)",
                    fontFamily: "Chakra Petch, sans-serif"
                  }}>
                {title}
              </h2>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="news-modal-content p-6">
              {children}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}