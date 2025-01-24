import { useMemo } from "react";
import { type Badge, useBadgeStore } from "@/lib/badges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BadgeDisplay() {
  const { badges } = useBadgeStore();

  const earnedCount = useMemo(() => 
    badges.filter(badge => badge.earned).length, 
    [badges]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-primary/20 hover:bg-primary/30 backdrop-blur-sm z-50"
        >
          <Medal className="h-6 w-6" />
          {earnedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">
              {earnedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Achievements</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{badge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.earned 
                      ? `Earned: ${new Date(badge.earnedAt!).toLocaleDateString()}`
                      : "Not yet earned"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}