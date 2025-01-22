import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { AboutUs } from "./AboutUs";
import { GameNews } from "./GameNews";
import { DiscordWidget } from "./DiscordWidget";
import { JoinUs } from "./JoinUs";
import { SchoolSpotlight } from "./SchoolSpotlight";
import { TeamCarousel } from "./TeamCarousel";
import { ThreeViewer } from "./ThreeViewer";
import { BetaForm } from "./BetaForm";
import { AiChat } from "./AiChat";
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { BentoCardModal } from "./BentoCardModal";


export function BentoGrid() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const cursorX = useSpring(0, { stiffness: 1000, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 1000, damping: 50 });

  // Custom cursor effect
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX.set(clientX - 12);
      cursorY.set(clientY - 12);
      setCursorPos({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  // Update cursor position
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor") as HTMLElement;
    if (cursor) {
      cursor.style.transform = `translate(${cursorX.get()}px, ${cursorY.get()}px)`;
    }
  }, [cursorPos]);

  // Click animations
  const handleCardClick = (event: React.MouseEvent, animationType: "pulse" | "ripple") => {
    const card = event.currentTarget as HTMLElement;

    if (animationType === "ripple") {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ripple = document.createElement("div");
      ripple.className = "ripple-effect";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      card.appendChild(ripple);
      setTimeout(() => card.removeChild(ripple), 600);
    } else {
      card.classList.add("pulse");
      setTimeout(() => card.classList.remove("pulse"), 500);
    }
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <motion.div 
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* AI Chat - Card 1 */}
        <motion.div
          className="bento-card card-1"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "pulse")}
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <AiChat/>
        </motion.div>

        {/* Enter Sparqverse - Card 2 */}
        <motion.div
          className="bento-card card-2"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "ripple")}
          whileHover={{
            scale: 1.02,
            rotateX: -5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <AboutUs />
        </motion.div>

        {/* Join Beta - Card 3 */}
        <motion.div
          className="bento-card card-3"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "pulse")}
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: -5,
            transition: { duration: 0.3 }
          }}
        >
          <BetaForm />
        </motion.div>

        {/* News - Card 4 */}
        <motion.div
          className="bento-card card-4"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "ripple")}
          whileHover={{
            scale: 1.02,
            rotateX: -5,
            rotateY: -5,
            transition: { duration: 0.3 }
          }}
        >
          <GameNews />
        </motion.div>

        {/* About Us - Card 5 */}
        <motion.div
          className="bento-card card-5"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "pulse")}
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <AboutUs variant="secondary" />
        </motion.div>

        {/* Join Us - Card 6 */}
        <motion.div
          className="bento-card card-6"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "ripple")}
          whileHover={{
            scale: 1.02,
            rotateX: -5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <JoinUs />
        </motion.div>

        {/* School Spotlight - Card 7 */}
        <motion.div
          className="bento-card card-7"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "pulse")}
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: -5,
            transition: { duration: 0.3 }
          }}
        >
          <SchoolSpotlight />
        </motion.div>

        {/* Team - Card 8 */}
        <motion.div
          className="bento-card card-8"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "ripple")}
          whileHover={{
            scale: 1.02,
            rotateX: -5,
            rotateY: -5,
            transition: { duration: 0.3 }
          }}
        >
          <TeamCarousel />
        </motion.div>

        {/* Discord - Card 9 */}
        <motion.div
          className="bento-card card-9"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "pulse")}
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <DiscordWidget />
        </motion.div>

        {/* 3D Character - Card 10 */}
        <motion.div
          className="bento-card card-10"
          variants={cardVariants}
          onClick={(e) => handleCardClick(e, "ripple")}
          whileHover={{
            scale: 1.02,
            rotateX: -5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <ThreeViewer />
        </motion.div>
      </motion.div>
    </div>
  );
}