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
    <div className="min-h-screen bg-[#0A0A1E]">
      <div className="grid-container">
        {/* Card 1: AI Chat */}
        <Card 
          className="bento-card card-1 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("ai-chat")}
        >
          <AiChat />
        </Card>

        {/* Card 2: Enter Sparqverse */}
        <Card 
          className="bento-card card-2 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("sparqverse")}
        >
          <AboutUs />
        </Card>

        {/* Card 3: Join Beta */}
        <Card 
          className="bento-card card-3 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("beta")}
        >
          <BetaForm />
        </Card>

        {/* Card 4: News */}
        <Card 
          className="bento-card card-4 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("news")}
        >
          <GameNews />
        </Card>

        {/* Card 5: About Us */}
        <Card 
          className="bento-card card-5 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("about")}
        >
          <AboutUs title="Our Mission" variant="secondary" />
        </Card>

        {/* Card 6: Join Us */}
        <Card 
          className="bento-card card-6 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("join")}
        >
          <JoinUs />
        </Card>

        {/* Card 7: School Spotlight */}
        <Card 
          className="bento-card card-7 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("school")}
        >
          <SchoolSpotlight />
        </Card>

        {/* Card 8: Team */}
        <Card 
          className="bento-card card-8 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("team")}
        >
          <TeamCarousel />
        </Card>

        {/* Card 9: Discord */}
        <Card 
          className="bento-card card-9 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleCardClick("discord")}
        >
          <DiscordWidget />
        </Card>

        {/* Card 10: 3D Character */}
        <Card className="bento-card card-10">
          <ThreeViewer />
        </Card>
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