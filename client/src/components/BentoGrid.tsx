
"use client";

import { motion } from "framer-motion";
import { useState, type MouseEvent } from "react";
import { AboutUs } from "./AboutUs";
import { GameNews } from "./GameNews";
import { DiscordWidget } from "./DiscordWidget";
import { JoinUs } from "./JoinUs";
import { SchoolSpotlight } from "./SchoolSpotlight";
import { TeamCarousel } from "./TeamCarousel";
import { ThreeViewer } from "./ThreeViewer";
import { BetaForm } from "./BetaForm";

export function BentoGrid() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <div className="bento-grid">
        {/* AI Chat - Card 1 */}
        <motion.div
          className="bento-card card-1"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <AboutUs title="AI Chat" variant="secondary" />
        </motion.div>

        {/* Enter Sparqverse - Card 2 */}
        <motion.div
          className="bento-card card-2"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <AboutUs />
        </motion.div>

        {/* Join Beta - Card 3 */}
        <motion.div
          className="bento-card card-3"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <BetaForm />
        </motion.div>

        {/* News - Card 4 */}
        <motion.div
          className="bento-card card-4"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <GameNews />
        </motion.div>

        {/* About Us - Card 5 */}
        <motion.div
          className="bento-card card-5"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <AboutUs variant="secondary" />
        </motion.div>

        {/* Join Us - Card 6 */}
        <motion.div
          className="bento-card card-6"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <JoinUs />
        </motion.div>

        {/* School Spotlight - Card 7 */}
        <motion.div
          className="bento-card card-7"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <SchoolSpotlight />
        </motion.div>

        {/* Team - Card 8 */}
        <motion.div
          className="bento-card card-8"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <TeamCarousel />
        </motion.div>

        {/* Discord - Card 9 */}
        <motion.div
          className="bento-card card-9"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <DiscordWidget />
        </motion.div>

        {/* 3D Character - Card 10 */}
        <motion.div
          className="bento-card card-10"
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <ThreeViewer />
        </motion.div>
      </div>
    </div>
  );
}
