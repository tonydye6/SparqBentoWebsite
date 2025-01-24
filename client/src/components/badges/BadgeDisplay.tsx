import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBadgeStore } from "@/lib/badges";
import { cn } from "@/lib/utils";

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
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <Medal className="h-6 w-6" />
          {earnedCount > 0 && (
            <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              {earnedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Achievements</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                badge.earned
                  ? "bg-primary/10 border-primary"
                  : "opacity-50"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="font-semibold">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                  {badge.earned && badge.earnedAt && (
                    <p className="text-xs text-primary mt-1">
                      Earned on {badge.earnedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
