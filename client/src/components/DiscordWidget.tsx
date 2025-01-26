import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { useState, useEffect } from "react";

export function DiscordWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeError = () => {
    setError("Failed to load Discord widget. Please check your connection.");
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <SiDiscord className="w-12 h-12 text-[#5865F2]" />
        <p className="text-center text-sm text-white/80">{error}</p>
        <Button 
          variant="outline"
          onClick={() => window.open('https://discord.gg/sparqgames', '_blank')}
          className="flex items-center gap-2 hover:bg-[#5865F2] hover:text-white transition-all duration-300"
        >
          <SiDiscord className="w-4 h-4" />
          Join Our Server
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <SiDiscord className="w-12 h-12 text-[#5865F2] animate-pulse" />
            <p className="text-sm text-white/80">Loading Discord chat...</p>
          </div>
        </div>
      )}
      <iframe 
        src="https://discord.com/widget?id=1326318974761173002&theme=dark"
        width="100%" 
        height="100%" 
        allowTransparency={true} 
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        onError={handleIframeError}
        className="rounded-lg bg-[#36393f]"
      />
    </div>
  );
}