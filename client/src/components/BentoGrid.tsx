
import { motion } from "framer-motion";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ThreeViewer } from "./ThreeViewer";
import { AiChat } from "./AiChat";
import { BetaForm } from "./BetaForm";
import { DiscordWidget } from "./DiscordWidget";
import { GameNews } from "./GameNews";
import { JoinUs } from "./JoinUs";
import { SchoolSpotlight } from "./SchoolSpotlight";
import { TeamCarousel } from "./TeamCarousel";
import { AboutUs } from "./AboutUs";
import { BentoCardModal } from "./BentoCardModal";

type ExpandedCard = "ai-chat" | "sparqverse" | "beta" | "news" | "about" | "join" | "school" | "team" | "discord" | null;

export function BentoGrid() {
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const handleCardClick = (card: ExpandedCard) => {
    setExpandedCard(card);
  };

  const handleCloseModal = () => {
    setExpandedCard(null);
  };

  const renderExpandedContent = () => {
    switch (expandedCard) {
      case "ai-chat":
        return <AiChat expanded />;
      case "sparqverse":
        return <AboutUs expanded />;
      case "beta":
        return <BetaForm expanded />;
      case "news":
        return <GameNews expanded />;
      case "about":
        return <AboutUs title="Our Mission" variant="secondary" expanded />;
      case "join":
        return <JoinUs expanded />;
      case "school":
        return <SchoolSpotlight expanded />;
      case "team":
        return <TeamCarousel expanded />;
      case "discord":
        return <DiscordWidget expanded />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (expandedCard) {
      case "ai-chat": return "AI Chat Assistant";
      case "sparqverse": return "Enter the Sparqverse";
      case "beta": return "Join Our Beta";
      case "news": return "Latest News";
      case "about": return "Our Mission";
      case "join": return "Join Our Team";
      case "school": return "School Spotlight";
      case "team": return "Meet Our Team";
      case "discord": return "Join Our Discord";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1E] p-6">
      <div className="flex gap-5 max-w-[1600px] mx-auto">
        <div className="flex-1">
          <Card 
            className="bento-card h-[440px] mb-6 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("team")}
          >
            <TeamCarousel />
          </Card>
          <Card 
            className="bento-card h-[220px] mb-6 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("sparqverse")}
          >
            <AboutUs />
          </Card>
          <Card 
            className="bento-card h-[340px] mb-6 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("beta")}
          >
            <BetaForm />
          </Card>
          <Card 
            className="bento-card h-[440px] mb-6 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("ai-chat")}
          >
            <AiChat />
          </Card>
        </div>

        <div className="flex-1">
          <Card 
            className="bento-card h-[315px] mb-6 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("news")}
          >
            <GameNews />
          </Card>
          <Card className="bento-card h-[440px] mb-6">
            <ThreeViewer />
          </Card>
          <Card 
            className="bento-card h-[220px] mb-5 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("join")}
          >
            <JoinUs />
          </Card>
          <Card 
            className="bento-card h-[220px] mb-5"
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-2xl font-bold">Here</span>
            </div>
          </Card>
          <Card 
            className="bento-card h-[220px] mb-5"
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-2xl font-bold">Now</span>
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <Card 
            className="bento-card h-[440px] mb-5 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("discord")}
          >
            <DiscordWidget />
          </Card>
          <Card 
            className="bento-card h-[340px] mb-5 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("school")}
          >
            <SchoolSpotlight />
          </Card>
          <motion.div
            className="relative perspective-1000"
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.02 }}
          >
            <Card 
              className="bento-card h-[440px] mb-5 transform-gpu transition-all duration-300 overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(0)",
              }}
            >
              <div className="relative">
                {["top", "right", "bottom", "left"].map((side) => (
                  <div
                    key={side}
                    style={{
                      position: "absolute",
                      background: "linear-gradient(90deg, #00f6ff, #0044ff)",
                      opacity: 0.7,
                      ...(side === "top" || side === "bottom"
                        ? { height: "2px", width: "100%", [side]: "-1px", left: 0 }
                        : { width: "2px", height: "100%", [side]: "-1px", top: 0 }),
                    }}
                  >
                    <motion.div
                      style={{
                        position: "absolute",
                        background: "#00f6ff",
                        boxShadow: "0 0 8px #00f6ff",
                        ...(side === "top" || side === "bottom"
                          ? { height: "100%", width: "20px" }
                          : { width: "100%", height: "20px" }),
                      }}
                      initial={{ 
                        [side === "top" || side === "bottom" ? "x" : "y"]: 
                        side === "right" || side === "bottom" ? "100%" : 0 
                      }}
                      animate={{ 
                        [side === "top" || side === "bottom" ? "x" : "y"]: 
                        side === "right" || side === "bottom" ? 0 : "100%" 
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                      }}
                    />
                  </div>
                ))}
              </div>
              <motion.div
                className="h-full flex items-center justify-center"
                whileHover={{ z: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="text-2xl font-bold">Additional Content</span>
              </motion.div>
            </Card>
          </motion.div>
          <Card 
            className="bento-card h-[220px] mb-5 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("about")}
          >
            <AboutUs title="Our Mission" variant="secondary" />
          </Card>
        </div>
      </div>

      <BentoCardModal 
        isOpen={expandedCard !== null}
        onClose={handleCloseModal}
        title={getModalTitle()}
      >
        {renderExpandedContent()}
      </BentoCardModal>
    </div>
  );
}