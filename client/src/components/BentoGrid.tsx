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
import { TeamCarousel, executiveTeam, advisoryTeam } from "./TeamCarousel";
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
      {/* Card 2: Join Beta */}
      <div
        className="bento-card card-2 beta-card relative overflow-hidden cursor-pointer z-10"
        onClick={() => handleCardClick("beta")}
      >
        <h2 className="sparq-title">Join Beta Now!</h2>
        <div className="absolute inset-0 bg-gradient-to-br from-carbon/80 to-carbon/40 pointer-events-none" />
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: 'url("/ftcc.png")',
            opacity: 0.6,
          }}
        />
      </div>

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
        <h2 className="sparq-title">Connect With Us</h2>
        <div className="flex flex-col h-full">
          <div className="flex-1 flex justify-center items-center gap-8 p-4">
            <a
              href="https://www.instagram.com/sparqgames"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="2" />
                <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="https://x.com/sparqgames"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.7778 3L12.5556 11.9444L21 21H17.4444L11.3889 14.5L4.55556 21H3L10.6667 11.4722L2.55556 3H6.11111L11.7222 8.94444L18.1111 3H19.7778ZM18.2222 19.5L7.22222 4.27778H5.33333L16.3889 19.5H18.2222Z" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@sparqgames"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9.5V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15C5 11.134 8.13401 8 12 8V11C9.79086 11 8 12.7909 8 15C8 17.2091 9.79086 19 12 19C14.2091 19 16 17.2091 16 15V2H19C19 2 19 2.5 19 3C19 5.20914 20.7909 7 23 7V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
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
      <div className="bento-card card-6 relative overflow-hidden">
        <TeamCard />
      </div>

      {/* Card 7: Join Us */}
      <motion.div
        className="bento-card card-7 join-card overflow-hidden"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("join")}
      >
        <h2 className="sparq-title">Join the Sparq Uprising!</h2>
        <JoinUs />
      </motion.div>

      {/* Card 8: School Spotlight */}
      <motion.div
        className="bento-card card-8 school-card"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("school")}
      >
        <h2 className="sparq-title">School Spotlight</h2>
        <SchoolSpotlight />
      </motion.div>

      {/* Card 9: Team Showcase */}
      <motion.div
        className="bento-card card-9"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("team")}
      >
        <h2 className="sparq-title">Meet Our Team</h2>
        <div className="flex flex-col h-full gap-2">
          <div className="flex-1 h-[45%]">
            <TeamCarousel members={executiveTeam} />
          </div>
          <div className="flex-1 h-[45%]">
            <TeamCarousel members={advisoryTeam} />
          </div>
        </div>
      </motion.div>

      {/* Card 10: Word Around Town */}
      <motion.div
        className="bento-card card-10 news-card"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex flex-col h-full">
          <h2 className="sparq-title text-center mb-2">Word Around Town</h2>
          <div className="flex-1 overflow-hidden">
            <NewsCarousel />
          </div>
        </div>
      </motion.div>

      {/* Card 11: The Sparq Story */}
      <motion.div
        className="bento-card card-11"
        whileHover={{ scale: 1.02 }}
        onClick={() => handleCardClick("about")}
      >
        <h2 className="sparq-title">The Sparq Story</h2>
      </motion.div>

      {/* Card 12: AI Chat */}
      <motion.div
        className="bento-card card-12 ai-chat-card p-4"
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="sparq-title">Sparq Assistant</h2>
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