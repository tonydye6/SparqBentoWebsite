import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";

export function DiscordWidget() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SiDiscord className="w-5 h-5 text-[#5865F2]" />
          <h3 className="font-semibold">Join our Discord</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect with other gamers and stay updated on Sparq developments.
        </p>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => window.open('https://discord.gg/sparqgames', '_blank')}
      >
        <SiDiscord className="w-4 h-4 mr-2" />
        Join Server
      </Button>
    </div>
  );
}
