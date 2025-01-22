
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
      <div className="flex gap-4 max-w-[1600px] mx-auto">
        <div className="flex-1">
          <Card 
            className="bento-card h-126 mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("team")}
          >
            <TeamCarousel />
          </Card>
          <Card 
            className="bento-card h-72 mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("sparqverse")}
          >
            <AboutUs />
          </Card>
          <Card 
            className="bento-card h-72 mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("beta")}
          >
            <BetaForm />
          </Card>
          <Card 
            className="bento-card h-[270px] mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("ai-chat")}
          >
            <AiChat />
          </Card>
        </div>

        <div className="flex-1">
          <Card 
            className="bento-card h-[180px] mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("news")}
          >
            <GameNews />
          </Card>
          <Card className="bento-card h-72 mb-4">
            <ThreeViewer />
          </Card>
          <Card 
            className="bento-card h-72 mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("join")}
          >
            <JoinUs />
          </Card>
          <Card 
            className="bento-card h-36 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("about")}
          >
            <AboutUs title="Our Mission" variant="secondary" />
          </Card>
        </div>

        <div className="flex-1">
          <Card 
            className="bento-card h-[600px] mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("discord")}
          >
            <DiscordWidget />
          </Card>
          <Card 
            className="bento-card h-90 mb-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCardClick("school")}
          >
            <SchoolSpotlight />
          </Card>
          <Card 
            className="bento-card h-72"
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-2xl font-bold">Additional Content</span>
            </div>
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
