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

export function BentoGrid() {
  return (
    <div className="grid-container p-6 gap-6">
      {/* Card 1: AI Chat */}
      <Card className="bento-card card-1 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <AiChat />
      </Card>

      {/* Card 2: Enter Sparqverse */}
      <Card className="bento-card card-2 bg-gradient-to-br from-[#5B4CDB] to-[#3B0099]">
        <AboutUs />
      </Card>

      {/* Card 3: Join Beta */}
      <Card className="bento-card card-3 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <BetaForm />
      </Card>

      {/* Card 4: News Carousel */}
      <Card className="bento-card card-4 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <GameNews />
      </Card>

      {/* Card 5: 2D Character */}
      <Card className="bento-card card-5 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <img src="/basketballPlayer.png" alt="Basketball Player" className="w-full h-full object-cover" />
      </Card>

      {/* Card 6: Join Us */}
      <Card className="bento-card card-6 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <JoinUs />
      </Card>

      {/* Card 7: School Spotlight */}
      <Card className="bento-card card-7 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <SchoolSpotlight />
      </Card>

      {/* Card 8: Team */}
      <Card className="bento-card card-8 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <TeamCarousel />
      </Card>

      {/* Card 9: Discord */}
      <Card className="bento-card card-9 bg-[rgba(28,28,44,0.8)] backdrop-blur-md">
        <DiscordWidget />
      </Card>

      {/* Card 10: 3D Character Viewer */}
      <Card className="bento-card card-10 rounded-full bg-[#E01E3C]">
        <ThreeViewer />
      </Card>
    </div>
  );
}