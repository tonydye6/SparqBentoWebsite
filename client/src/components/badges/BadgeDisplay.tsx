import { type Badge } from "@/lib/badges";
import { Card } from "@/components/ui/card";

interface BadgeDisplayProps {
  badge: Badge;
}

export function BadgeDisplay({ badge }: BadgeDisplayProps) {
  const earnedDate = badge.earnedAt ? new Date(badge.earnedAt) : null;
  const formattedDate = earnedDate ? earnedDate.toLocaleDateString() : "Not yet earned";

  return (
    <Card className="p-4 flex flex-col items-center gap-2">
      <div className="text-2xl">{badge.icon}</div>
      <h3 className="font-bold">{badge.name}</h3>
      <p className="text-sm text-muted-foreground">{badge.description}</p>
      <p className="text-xs">Earned: {formattedDate}</p>
    </Card>
  );
}