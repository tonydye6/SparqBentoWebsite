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
import { Trophy, Star, Users } from "lucide-react";

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
    <div className="min-h-screen bg-transparent">
      {/* Header Card */}
      <motion.div
        className="bento-card header-card mx-auto mb-6 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <img src="/sparqIcon.png" alt="Sparq Games Logo" className="h-12" />
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-gray-300 transition-colors">About</button>
            <button className="text-white hover:text-gray-300 transition-colors">Contact</button>
          </div>
        </div>
      </motion.div>

      <div className="bento-grid">
        {/* AI Chat */}
        <motion.div
          className="bento-card card-1"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("ai-chat")}
        >
          <AboutUs title="AI Chat" variant="secondary" />
        </motion.div>

        {/* Sparqverse */}
        <motion.div
          className="bento-card card-2"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("sparqverse")}
        >
          <AboutUs />
        </motion.div>

        {/* UCLA Card */}
        <motion.div
          className="bento-card image-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-full flex items-center justify-center p-4">
            <img
              src="/ucla.png"
              alt="UCLA"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          className="bento-card stats-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-full p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold">Game Stats</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-bold">1M+</span> Active Players</p>
              <p className="text-sm"><span className="font-bold">50+</span> Universities</p>
              <p className="text-sm"><span className="font-bold">10+</span> Sports</p>
            </div>
          </div>
        </motion.div>

        {/* News */}
        <motion.div
          className="bento-card card-4"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("news")}
        >
          <GameNews />
        </motion.div>

        {/* 3D Viewer - Now in the middle */}
        <motion.div
          className="bento-card feature-card"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("3d")}
        >
          <ThreeViewer />
        </motion.div>

        {/* About Us */}
        <motion.div
          className="bento-card card-5"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("about")}
        >
          <AboutUs variant="secondary" />
        </motion.div>

        {/* Featured Athletes Card */}
        <motion.div
          className="bento-card athlete-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-full p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Featured Athletes</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Discover rising stars in college sports
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Beta Form */}
        <motion.div
          className="bento-card card-3"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("beta")}
        >
          <BetaForm />
        </motion.div>

        {/* Join Us */}
        <motion.div
          className="bento-card card-6"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("join")}
        >
          <JoinUs />
        </motion.div>

        {/* Community Stats Card */}
        <motion.div
          className="bento-card community-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-full p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">Community</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold mb-1">50K+</p>
                <p className="text-sm text-muted-foreground">Active Players</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* School Spotlight */}
        <motion.div
          className="bento-card card-7"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("school")}
        >
          <SchoolSpotlight />
        </motion.div>

        {/* Team Carousel */}
        <motion.div
          className="bento-card card-8"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("team")}
        >
          <TeamCarousel />
        </motion.div>

        {/* Players Card */}
        <motion.div
          className="bento-card image-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-full flex items-center justify-center">
            <div className="flex w-full h-full">
              <img
                src="/basketballPlayer.png"
                alt="Basketball Player"
                className="w-1/2 h-full object-contain"
              />
              <img
                src="/softballPlayer.png"
                alt="Softball Player"
                className="w-1/2 h-full object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Discord */}
        <motion.div
          className="bento-card card-9"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleCardClick("discord")}
        >
          <DiscordWidget />
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