"use client";

import { AboutUs } from "./AboutUs";
import { GameNews } from "./GameNews";
import { DiscordWidget } from "./DiscordWidget";
import { JoinUs } from "./JoinUs";
import { SchoolSpotlight } from "./SchoolSpotlight";
import { TeamCarousel } from "./TeamCarousel";
import { ThreeViewer } from "./ThreeViewer";
import { BetaForm } from "./BetaForm";

export function BentoGrid() {
  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <div className="bento-grid">
        {/* AI Chat - Card 1 */}
        <div className="bento-card card-1">
          <AboutUs title="AI Chat" variant="secondary" />
        </div>

        {/* Enter Sparqverse - Card 2 */}
        <div className="bento-card card-2">
          <AboutUs />
        </div>

        {/* Join Beta - Card 3 */}
        <div className="bento-card card-3">
          <BetaForm />
        </div>

        {/* News - Card 4 */}
        <div className="bento-card card-4">
          <GameNews />
        </div>

        {/* About Us - Card 5 */}
        <div className="bento-card card-5">
          <AboutUs variant="secondary" />
        </div>

        {/* Join Us - Card 6 */}
        <div className="bento-card card-6">
          <JoinUs />
        </div>

        {/* School Spotlight - Card 7 */}
        <div className="bento-card card-7">
          <SchoolSpotlight />
        </div>

        {/* Team - Card 8 */}
        <div className="bento-card card-8">
          <TeamCarousel />
        </div>

        {/* Discord - Card 9 */}
        <div className="bento-card card-9">
          <DiscordWidget />
        </div>

        {/* 3D Character - Card 10 */}
        <div className="bento-card card-10">
          <ThreeViewer />
        </div>
      </div>
    </div>
  );
}