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
    y: 20,
    clipPath: 'inset(0 0 100% 0)'
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    clipPath: 'inset(0 0 0 0)',
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    clipPath: 'inset(100% 0 0 0)',
    transition: {
      duration: 0.3
    }
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
          className="relative h-full flex flex-col bg-background/90 backdrop-blur-lg rounded-lg overflow-hidden"
          style={{
            boxShadow: `
              0 0 30px rgba(255, 0, 51, 0.3),
              0 0 60px rgba(0, 229, 211, 0.1)
            `,
            border: '2px solid rgba(255, 0, 51, 0.3)'
          }}
        >
          {title && (
            <div className="sticky top-0 px-6 py-4 border-b border-white/10 bg-background/95 backdrop-blur-sm">
              <h2 
                className="font-heading text-2xl font-semibold text-white uppercase tracking-wider"
                style={{ 
                  textShadow: `
                    0 0 15px rgba(255, 0, 51, 0.5),
                    0 0 30px rgba(0, 229, 211, 0.3)
                  `,
                  fontFamily: "'ADAM.CG PRO', 'Chakra Petch', sans-serif"
                }}
              >
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