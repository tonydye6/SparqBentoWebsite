import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AboutUs } from "./AboutUs";
import { GameNews } from "./GameNews";
import { DiscordWidget } from "./DiscordWidget";
import { JoinUs } from "./JoinUs";
import { SchoolSpotlight } from "./SchoolSpotlight";
import { TeamCarousel } from "./TeamCarousel";
import { ThreeViewer } from "./ThreeViewer";
import { BetaForm } from "./BetaForm";
import { BentoCardModal } from "./BentoCardModal";

type ExpandedCard = 
  | "ai-chat" 
  | "sparqverse" 
  | "beta" 
  | "news" 
  | "about" 
  | "join" 
  | "school" 
  | "team" 
  | "discord" 
  | "3d" 
  | null;

export function BentoGrid() {
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const handleCardClick = (card: ExpandedCard) => {
    setExpandedCard(card);
  };

  const handleCloseModal = () => {
    setExpandedCard(null);
  };

  const getModalContent = () => {
    switch (expandedCard) {
      case "ai-chat":
        return <AboutUs title="AI Chat" variant="secondary" />;
      case "sparqverse":
        return <AboutUs />;
      case "beta":
        return <BetaForm />;
      case "news":
        return <GameNews />;
      case "about":
        return <AboutUs variant="secondary" />;
      case "join":
        return <JoinUs />;
      case "school":
        return <SchoolSpotlight />;
      case "team":
        return <TeamCarousel />;
      case "discord":
        return <DiscordWidget />;
      case "3d":
        return <ThreeViewer />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="bento-grid">
        <motion.div
          className="bento-card card-1"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("ai-chat")}
        >
          <AboutUs title="AI Chat" variant="secondary" />
        </motion.div>

        <motion.div
          className="bento-card card-2"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("sparqverse")}
        >
          <AboutUs />
        </motion.div>

        <motion.div
          className="bento-card card-3"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("beta")}
        >
          <BetaForm />
        </motion.div>

        <motion.div
          className="bento-card card-4"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("news")}
        >
          <GameNews />
        </motion.div>

        <motion.div
          className="bento-card card-5"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("about")}
        >
          <AboutUs variant="secondary" />
        </motion.div>

        <motion.div
          className="bento-card card-6"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("join")}
        >
          <JoinUs />
        </motion.div>

        <motion.div
          className="bento-card card-7"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("school")}
        >
          <SchoolSpotlight />
        </motion.div>

        <motion.div
          className="bento-card card-8"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("team")}
        >
          <TeamCarousel />
        </motion.div>

        <motion.div
          className="bento-card card-9"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("discord")}
        >
          <DiscordWidget />
        </motion.div>

        <motion.div
          className="bento-card card-10"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("3d")}
        >
          <ThreeViewer />
        </motion.div>
      </div>

      <AnimatePresence>
        {expandedCard && (
          <BentoCardModal
            isOpen={true}
            onClose={handleCloseModal}
            title={expandedCard.charAt(0).toUpperCase() + expandedCard.slice(1)}
          >
            {getModalContent()}
          </BentoCardModal>
        )}
      </AnimatePresence>
    </div>
  );
}