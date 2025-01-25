import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseTrail } from "./MouseTrail";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { AboutUs } from "./AboutUs";
import { GameNews } from "./GameNews";
import { AiChat } from "./AiChat";
import { DiscordWidget } from "./DiscordWidget";
import { JoinUs } from "./JoinUs";
import { SchoolSpotlight } from "./SchoolSpotlight";
import { TeamCarousel } from "./TeamCarousel";
import { ThreeViewer } from "./ThreeViewer";
import { BetaForm } from "./BetaForm";
import { BentoCardModal } from "./BentoCardModal";
import { Trophy, Star, Users } from "lucide-react";
import { useBadgeStore, BADGES, type Badge } from "@/lib/badges";
import { BadgeDisplay } from "./badges/BadgeDisplay";
import { BadgeNotification } from "./badges/BadgeNotification";

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
  | "mission"
  | "vision"
  | "values"
  | null;

const MagneticCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-50, 50], [10, -10]);
  const rotateY = useTransform(springX, [-50, 50], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const card = ref.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 400;

      if (distance < maxDistance) {
        const factor = 1 - distance / maxDistance;
        x.set(deltaX * factor * 0.2);
        y.set(deltaY * factor * 0.2);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
};

export function BentoGrid() {
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);
  const [recentBadge, setRecentBadge] = useState<Badge | null>(null);
  const visitedSections = useRef(new Set<string>());
  const { awardBadge, hasBadge } = useBadgeStore();

  const checkExplorerBadge = () => {
    if (visitedSections.current.size >= 5 && !hasBadge(BADGES.EXPLORER.id)) {
      awardBadge(BADGES.EXPLORER.id);
      setRecentBadge({
        ...BADGES.EXPLORER,
        earned: true,
        earnedAt: new Date(),
      });
    }
  };

  const handleCardClick = (card: ExpandedCard) => {
    setExpandedCard(card);
    if (card) {
      visitedSections.current.add(card);
      checkExplorerBadge();

      switch (card) {
        case 'discord':
          if (!hasBadge(BADGES.SOCIAL.id)) {
            awardBadge(BADGES.SOCIAL.id);
            setRecentBadge({
              ...BADGES.SOCIAL,
              earned: true,
              earnedAt: new Date(),
            });
          }
          break;
        case 'beta':
          if (!hasBadge(BADGES.EARLY_ADOPTER.id)) {
            awardBadge(BADGES.EARLY_ADOPTER.id);
            setRecentBadge({
              ...BADGES.EARLY_ADOPTER,
              earned: true,
              earnedAt: new Date(),
            });
          }
          break;
        case 'about':
          if (!hasBadge(BADGES.CURIOUS_MIND.id)) {
            awardBadge(BADGES.CURIOUS_MIND.id);
            setRecentBadge({
              ...BADGES.CURIOUS_MIND,
              earned: true,
              earnedAt: new Date(),
            });
          }
          break;
        case 'team':
          if (!hasBadge(BADGES.TEAM_PLAYER.id)) {
            awardBadge(BADGES.TEAM_PLAYER.id);
            setRecentBadge({
              ...BADGES.TEAM_PLAYER,
              earned: true,
              earnedAt: new Date(),
            });
          }
          break;
      }
    }
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
        return <BetaForm expanded />;
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
      case "mission":
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-lg">Revolutionize sports gaming through innovation, creating immersive and authentic experiences that bring athletes and fans closer to the games they love.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Push the boundaries of sports gaming technology</li>
              <li>Create authentic and engaging experiences</li>
              <li>Connect athletes and fans in meaningful ways</li>
            </ul>
          </div>
        );
      case "vision":
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <p className="text-lg">Create the future of interactive sports entertainment where every player can experience the thrill and excitement of their favorite sports in unprecedented ways.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lead the evolution of sports gaming</li>
              <li>Bridge the gap between virtual and real sports</li>
              <li>Empower athletes and fans through technology</li>
            </ul>
          </div>
        );
      case "values":
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Our Values</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Innovation</h3>
                <p>Constantly pushing boundaries and embracing new technologies</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Community</h3>
                <p>Building strong connections between players, athletes, and fans</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Excellence</h3>
                <p>Striving for the highest quality in everything we do</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bento-grid">
      {/* Card 2: Join Beta */}
      <motion.div
        className="bento-card card-2 beta-card flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("beta")}
      >
        <h2 className="text-[8rem] font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-center px-4">Join Beta Now!</h2>
      </motion.div>

      {/* Card 1: Title Bar */}
      <motion.div
        className="bento-card card-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center h-full w-full p-4">
          <img 
            src="/logo_2.png" 
            alt="Sparq Logo" 
            className="max-h-[90%] max-w-[90%] w-auto object-contain" 
          />
        </div>
      </motion.div>

      {/* Card 3: Discord Live Chat */}
      <motion.div
        className="bento-card card-3 discord-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("discord")}
      >
        <DiscordWidget />
      </motion.div>

      {/* Card 4: Connect With Us */}
      <motion.div
        className="bento-card card-4"
        whileHover={{ scale: 1.02 }}
      >
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Connect With Us</h3>
          <div className="flex justify-center items-center h-full">
            {/* Character selection interface will go here */}
          </div>
        </div>
      </motion.div>

      {/* Card 5: Spline 3D Viewport */}
      <motion.div
        className="bento-card card-5"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("3d")}
      >
        <ThreeViewer />
      </motion.div>

      {/* Card 6: Video Teaser */}
      <motion.div
        className="bento-card card-6 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
      >
        <video
          className="w-full h-full object-cover"
          src="/teaser_1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            const video = e.currentTarget.parentElement?.querySelector('video');
            if (video) {
              video.muted = !video.muted;
            }
          }}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Card 7: Join Us */}
      <motion.div
        className="bento-card card-7 join-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("join")}
      >
        <JoinUs />
      </motion.div>

      {/* Card 8: School Spotlight */}
      <motion.div
        className="bento-card card-8 school-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("school")}
      >
        <SchoolSpotlight />
      </motion.div>

      {/* Card 9: Team Showcase */}
      <motion.div
        className="bento-card card-9"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("team")}
      >
        <TeamCarousel />
      </motion.div>

      {/* Card 10: Sparqverse */}
      <motion.div
        className="bento-card card-10 sparqverse-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("sparqverse")}
      >
        <AboutUs />
      </motion.div>

      {/* Card 11: Our Story */}
      <motion.div
        className="bento-card card-11"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("about")}
      >
        <AboutUs title="Our Story" variant="secondary" />
      </motion.div>

      {/* Card 12: AI Chat */}
      <motion.div
        className="bento-card card-12 ai-chat-card p-4"
        whileHover={{ scale: 1.02 }}
      >
        <div className="h-full">
          <AiChat />
        </div>
      </motion.div>

      {/* Cards 13-15: Mission/Vision/Values */}
      <motion.div 
        className="bento-card card-13 cursor-pointer flex items-center justify-center relative"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("mission")}
      >
        <img 
          src="/footbalPlayer.png" 
          alt="Football Player"
          className="absolute w-auto h-full object-cover opacity-50"
        />
        <h3 className="text-6xl font-bold transform -rotate-90 relative z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Mission</h3>
      </motion.div>
      <motion.div 
        className="bento-card card-14 cursor-pointer flex items-center justify-center relative"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("vision")}
      >
        <img 
          src="/softballPlayer.png" 
          alt="Softball Player"
          className="absolute w-auto h-full object-cover opacity-60"
        />
        <h3 className="text-6xl font-bold transform -rotate-90 relative z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Vision</h3>
      </motion.div>
      <motion.div 
        className="bento-card card-15 cursor-pointer flex items-center justify-center relative"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("values")}
      >
        <img 
          src="/basketballPlayer.png" 
          alt="Basketball Player"
          className="absolute w-auto h-full object-cover opacity-40"
        />
        <h3 className="text-6xl font-bold transform -rotate-90 relative z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Values</h3>
      </motion.div>

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

      <BadgeDisplay />
      {recentBadge && (
        <BadgeNotification
          badge={recentBadge}
          onClose={() => setRecentBadge(null)}
        />
      )}

      <MouseTrail />
    </div>
  );
}