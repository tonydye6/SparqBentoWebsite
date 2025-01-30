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
import { NewsCarousel } from "./NewsCarousel";
import { Trophy, Star, Users } from "lucide-react";
import { useBadgeStore, BADGES, type Badge } from "@/lib/badges";
import { BadgeDisplay } from "./badges/BadgeDisplay";
import { BadgeNotification } from "./badges/BadgeNotification";
import { TeamCard } from "./TeamCard";

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

  // Define mobile order for cards
  const mobileOrder = [1, 2, 6, 11, 10, 13, 14, 15, 7, 4];

  // Define cards with their components
  const cards = [
    { id: 1, component: <TeamCarousel />, onClick: () => handleCardClick("team") },
    { id: 2, component: <AboutUs />, onClick: () => handleCardClick("sparqverse") },
    { id: 6, component: <ThreeViewer /> },
    { id: 11, component: <GameNews />, onClick: () => handleCardClick("news") },
    { id: 10, component: <AiChat />, onClick: () => handleCardClick("ai-chat") },
    { id: 13, component: <DiscordWidget />, onClick: () => handleCardClick("discord") },
    { id: 14, component: <SchoolSpotlight />, onClick: () => handleCardClick("school") },
    { id: 15, component: <span className="text-2xl font-bold">Additional Content</span> },
    { id: 7, component: <JoinUs />, onClick: () => handleCardClick("join") },
    { id: 4, component: <BetaForm />, onClick: () => handleCardClick("beta") }
  ];

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
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">The Sparq Story</h2>
            <p className="text-lg leading-relaxed mb-4">
              We understand the dedication it takes to be a college athlete. We all played. And looking forward, we saw the opportunity to give back when Name, Image and Likeness (NIL) rules were adopted in 2022. Sparq Games was established to help athletes build their own brand through a series of video games. That's why we did it. The success of Sparq means that thousands of college athletes - men and women - will profit from their names and images being featured in our broad range of sports-based mobile video games.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Sparq is rapidly expanding, using our proprietary game publishing platform to launch up to a dozen sports-based mobile games over the next five years which combine our commitment to AI, our gamer fans, college athletes, and the top IP holders we work with - like hundreds of the top universities along with their logos, mascots, and trademarks.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Sparq takes immense pride in showcasing college athletes from hundreds of top U.S. universities. They recognize the significance of this intellectual property, believing it to be among the most powerful in existence. Sparq's commitment is to provide a platform where this cherished heritage can be celebrated and displayed with pride for years to come.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Sparq will be introducing our mobile games beginning in 2025. If you're interested in keeping tabs on Sparq and being a part of the fun as they reach out to the college sports gaming community, then please sign up for the beta. You'll see firsthand what they're building and they'll honor your feedback to make the games as fun as possible.
            </p>
            <ul className="list-disc pl-6">
              <li className="text-lg italic">
                "Current estimated annual NIL deals stand at $750 million and are projected to reach $2.5 billion by '26."<br/>
                <span className="text-sm">- Opendorse/NIL Daily - July 2, 2024</span>
              </li>
            </ul>
          </div>
        );
      case "join":
        return <JoinUs expanded={true} />;
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
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li className="text-lg leading-relaxed">
                Become the world's leading sports mobile game publishing platform, renowned for innovation, creativity, fun, and financial success.
              </li>
              <li className="text-lg leading-relaxed">
                Foster a community of passionate sports fans and gamers who share our values and enthusiasm.
              </li>
              <li className="text-lg leading-relaxed">
                Revolutionize the way athletes engage with their fans, build their personal brand, and secure their financial future.
              </li>
              <li className="text-lg leading-relaxed">
                Create a workplace that's a benchmark for happiness, creativity, and productivity in the gaming industry.
              </li>
            </ul>
          </div>
        );
      case "values":
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Our Values</h2>
            <ul className="list-none space-y-8">
              <li>
                <h3 className="text-xl font-semibold mb-2">Unleash Creativity</h3>
                <p className="text-lg leading-relaxed">
                  We empower each employee to focus on the most exciting and creative aspects of their job, leveraging AI to eliminate tedious tasks and unlock human potential.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold mb-2">Enrich Lives</h3>
                <p className="text-lg leading-relaxed">
                  We partner with athletes to help them build their brand, achieve financial enrichment, and secure a brighter future. We're committed to creating a positive impact on their lives and the lives of our employees, gamers, and the broader community.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold mb-2">Fun Above All</h3>
                <p className="text-lg leading-relaxed">
                  We're dedicated to crafting games that are ridiculously fun, merging the worlds of sports fans and sports gamers to create a vibrant, interactive, and inclusive community. We listen to feedback, iterate, and innovate to deliver the best gaming experiences possible.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold mb-2">People-Centric</h3>
                <p className="text-lg leading-relaxed">
                  We prioritize the well-being, happiness, and growth of our employees, athletes, and gamers. We strive to create a workplace that defies industry labor challenges, where people can thrive, grow, and love what they do.
                </p>
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bento-grid">
      {mobileOrder.map((id) => {
        const card = cards.find((c) => c.id === id);
        return (
          <motion.div
            key={id}
            className={`bento-card card-${id} ${
              id === 4 ? "beta-card" : id === 3 ? "discord-card" : id === 7 ? "join-card" : id === 8 ? "school-card" : id === 10 ? "news-card" : id === 12 ? "ai-chat-card" : ""
            } relative overflow-hidden cursor-pointer z-10 ${id === 1 || id === 2 || id === 11 || id === 13 || id === 14 || id === 15 ? "" : "w-[300px] h-[300px]"}`}
            whileHover={{ scale: 1.02 }}
            onClick={card?.onClick}
          >
            {id === 2 && (
              <div className="absolute inset-0 bg-gradient-to-br from-carbon/80 to-carbon/40 pointer-events-none" />
            )}
            {id === 2 && (
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: 'url("/ftcc.png")',
                  opacity: 0.6,
                }}
              />
            )}
            {id === 2 && (
              <div className="flex items-center justify-center h-full relative">
                <h2 className="text-6xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-center w-full px-2 pointer-events-none">Join Beta Now!</h2>
              </div>
            )}
             {id === 1 && (
              <div className="flex items-center justify-center h-full w-full p-4">
                <img
                  src="/logo_2.png"
                  alt="Sparq Logo"
                  className="max-h-[90%] max-w-[90%] w-auto object-contain"
                />
              </div>
            )}
            {id === 4 && (
              <div className="flex items-center justify-center h-full">
                <BetaForm />
              </div>
            )}
            {id === 6 && <ThreeViewer />}
            {id === 7 && <JoinUs />}
            {id === 10 && <AiChat />}
            {id === 11 && <GameNews />}
            {id === 13 && <DiscordWidget />}
            {id === 14 && <SchoolSpotlight />}
            {id === 15 && (
              <div className="flex items-center justify-center h-full">
                {card.component}
              </div>
            )}
            {id === 1 && (
              <div className="flex flex-col h-full">
                <h3 className="text-2xl font-bold p-4 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Meet Our Team</h3>
                <div className="flex-1">
                  <TeamCarousel />
                </div>
              </div>
            )}

            {id === 11 && <GameNews />}
            {id === 1 && <TeamCarousel />}
            {id === 2 && <AboutUs />}
            {id === 6 && <ThreeViewer />}
             {id === 11 && <GameNews />}
            {id === 10 && <AiChat />}
            {id === 13 && <DiscordWidget />}
            {id === 14 && <SchoolSpotlight />}
            {id === 7 && <JoinUs />}
            {id === 4 && <BetaForm />}
            {id === 15 && <span className="text-2xl font-bold">Additional Content</span>}
          </motion.div>
        );
      })}

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