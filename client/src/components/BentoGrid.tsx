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
    <div className="min-h-screen bg-[#0A0A1E]">
      <div className="grid-container">
        {/* Card 1: AI Chat */}
        <Card className="bento-card card-1">
          <AiChat />
        </Card>

        {/* Card 2: Enter Sparqverse */}
        <Card className="bento-card card-2">
          <AboutUs />
        </Card>

        {/* Card 3: Join Beta */}
        <Card className="bento-card card-3">
          <BetaForm />
        </Card>

        {/* Card 4: News */}
        <Card className="bento-card card-4">
          <GameNews />
        </Card>

        {/* Card 5: About Us */}
        <Card className="bento-card card-5">
          <AboutUs title="Our Mission" variant="secondary" />
        </Card>

        {/* Card 6: Join Us */}
        <Card className="bento-card card-6">
          <JoinUs />
        </Card>

        {/* Card 7: School Spotlight */}
        <Card className="bento-card card-7">
          <SchoolSpotlight />
        </Card>

        {/* Card 8: Team */}
        <Card className="bento-card card-8">
          <TeamCarousel />
        </Card>

        {/* Card 9: Discord */}
        <Card className="bento-card card-9">
          <DiscordWidget />
        </Card>

        {/* Card 10: 3D Character */}
        <Card className="bento-card card-10">
          <ThreeViewer />
        </Card>
      </div>
    </div>
  );
}