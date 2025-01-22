import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
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

  useEffect(() => {
    const cards = document.querySelectorAll('.bento-card');

    const handleMouseMove = (e: MouseEvent) => {
      const card = (e.currentTarget as HTMLElement);
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / card.offsetWidth) * 100;
      const y = ((e.clientY - rect.top) / card.offsetHeight) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove as any);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove as any);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#4E2FE6] dark:bg-[#1a1a2e] p-6">
      {/* Tech Purple PMS 2736 */} {/* Tech Purple background */}
      <div className="flex gap-5 max-w-[1600px] mx-auto">
        <div className="flex-1">
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[440px] mb-6 cursor-pointer team-card" onClick={() => handleCardClick("team")}>
              <TeamCarousel />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[220px] mb-6 cursor-pointer sparqverse-card" onClick={() => handleCardClick("sparqverse")}>
              <AboutUs />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[340px] mb-6 cursor-pointer beta-card" onClick={() => handleCardClick("beta")}>
              <BetaForm />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[440px] mb-6 cursor-pointer ai-chat-card" onClick={() => handleCardClick("ai-chat")}>
              <AiChat />
            </Card>
          </motion.div>
        </div>

        <div className="flex-1">
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[315px] mb-6 cursor-pointer news-card" onClick={() => handleCardClick("news")}>
              <GameNews />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[440px] mb-6 image-card">
              <ThreeViewer />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[220px] mb-5 cursor-pointer join-card" onClick={() => handleCardClick("join")}>
              <JoinUs />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[220px] mb-5 overflow-hidden image-card"> 
              <div className="h-full flex items-center justify-center relative">
                <img
                  src="/path/to/your/image1.png"
                  alt="Description"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[220px] mb-5 overflow-hidden image-card"> 
              <div className="h-full flex items-center justify-center relative">
                <img
                  src="/path/to/your/image2.png"
                  alt="Description"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="flex-1">
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[440px] mb-5 cursor-pointer discord-card" onClick={() => handleCardClick("discord")}>
              <DiscordWidget />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[340px] mb-5 cursor-pointer school-card" onClick={() => handleCardClick("school")}>
              <SchoolSpotlight />
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[440px] mb-5 image-card">
              <motion.div className="h-full flex items-center justify-center relative overflow-hidden" whileHover={{ z: 20 }} style={{ transformStyle: "preserve-3d" }}>
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
              </motion.div>
            </Card>
          </motion.div>
          <motion.div className="relative perspective-1000" style={{ transformStyle: "preserve-3d" }} whileHover={{ scale: 1.02 }}>
            <Card className="bento-card h-[220px] mb-5 cursor-pointer about-card" onClick={() => handleCardClick("about")}>
              <AboutUs title="Our Mission" variant="secondary" />
            </Card>
          </motion.div>
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

{/* Added CSS styles for background colors */}
<style jsx>{`
  .ai-chat-card {
    background-color: #4682B4; /* Future Blue */
  }
  .image-card {
    background-color: #50C878; /* Digital Green */
  }
  .beta-card {
    background-color: #FFA500; /* Energy Orange */
  }
  .news-card {
    background-color: #50C878; /* Digital Green */
  }
  .join-card {
    background-color: #FFA500; /* Energy Orange */
  }
  .about-card {
    background-color: #FFA500; /* Energy Orange */
  }
  .team-card {
    background-color: #4682B4; /* Future Blue */
  }
  .sparqverse-card {
    background-color: #50C878; /* Digital Green */
  }
  .discord-card {
    background-color: #4682B4; /* Future Blue */
  }
  .school-card {
    background-color: #FFA500; /* Energy Orange */
  }

`}</style>