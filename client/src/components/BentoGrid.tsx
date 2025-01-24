import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MouseTrail } from "./MouseTrail";
import { Card } from "@/components/ui/card";
import { AboutUs } from "./AboutUs";
import { GameNews } from "./GameNews";
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
      default:
        return null;
    }
  };

  return (
    <div className="bento-grid">
      {/* Card 2: Join Beta */}
      <motion.div
        className="bento-card card-2 beta-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("beta")}
      >
        <BetaForm />
      </motion.div>

      {/* Card 1: Title Bar */}
      <motion.div
        className="bento-card card-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between p-4">
          <img src="/sparqIcon.png" alt="Sparq Games Logo" className="h-16" />
          <h1 className="text-2xl font-bold text-white">Break Free. Play Future</h1>
          <img src="/sparqIcon.png" alt="Sparq Games Logo" className="h-16" />
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

      {/* Card 4: Choose Character */}
      <motion.div
        className="bento-card card-4"
        whileHover={{ scale: 1.02 }}
      >
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Choose Your Character</h3>
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

      {/* Card 6: Team Showcase */}
      <motion.div
        className="bento-card card-6"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("team")}
      >
        <TeamCarousel />
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

      {/* Card 9: Social Links */}
      <motion.div
        className="bento-card card-9"
        whileHover={{ scale: 1.02 }}
      >
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
          <div className="flex flex-col gap-4">
            {/* Social links will go here */}
          </div>
        </div>
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
        <AboutUs variant="secondary" />
      </motion.div>

      {/* Card 12: AI Chat */}
      <motion.div
        className="bento-card card-12 ai-chat-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("ai-chat")}
      >
        <AboutUs title="AI Chat" variant="secondary" />
      </motion.div>

      {/* Cards 13-15: Mission/Vision/Values */}
      <motion.div className="bento-card card-13">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Mission</h3>
          <p className="text-sm text-white/80">Revolutionize sports gaming through innovation</p>
        </div>
      </motion.div>
      <motion.div className="bento-card card-14">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Vision</h3>
          <p className="text-sm text-white/80">Create the future of interactive sports entertainment</p>
        </div>
      </motion.div>
      <motion.div className="bento-card card-15">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Values</h3>
          <p className="text-sm text-white/80">Innovation, Community, Excellence</p>
        </div>
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