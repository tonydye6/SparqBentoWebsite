import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

interface BadgeStore {
  badges: Badge[];
  earnedBadges: string[];
  awardBadge: (badgeId: string) => void;
  hasBadge: (badgeId: string) => boolean;
}

// Initial badges definitions
export const BADGES = {
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit 5 different sections of the site',
    icon: '🧭',
  },
  SOCIAL: {
    id: 'social',
    name: 'Social Butterfly',
    description: 'Connect with our Discord community',
    icon: '🦋',
  },
  EARLY_ADOPTER: {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Sign up for the beta program',
    icon: '🚀',
  },
  CURIOUS_MIND: {
    id: 'curious_mind',
    name: 'Curious Mind',
    description: 'Read about our technology',
    icon: '🧠',
  },
  TEAM_PLAYER: {
    id: 'team_player',
    name: 'Team Player',
    description: 'View the entire team carousel',
    icon: '🤝',
  }
} as const;

export const useBadgeStore = create<BadgeStore>()(
  persist(
    (set, get) => ({
      badges: Object.values(BADGES).map(badge => ({
        ...badge,
        earned: false,
      })),
      earnedBadges: [],
      awardBadge: (badgeId: string) => {
        if (get().hasBadge(badgeId)) return;
        
        set(state => ({
          badges: state.badges.map(badge => 
            badge.id === badgeId 
              ? { ...badge, earned: true, earnedAt: new Date() }
              : badge
          ),
          earnedBadges: [...state.earnedBadges, badgeId],
        }));
      },
      hasBadge: (badgeId: string) => {
        return get().earnedBadges.includes(badgeId);
      },
    }),
    {
      name: 'sparq-badges',
    }
  )
);
