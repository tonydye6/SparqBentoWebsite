import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function DiscordWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const MAX_RETRIES = 3;

  useEffect(() => {
    const loadWidget = () => {
      setIsLoading(true);
      setError(null);

      // Simulate initial loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    };

    loadWidget();
  }, [retryCount]);

  const handleIframeError = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      toast({
        title: "Reconnecting to Discord",
        description: "Attempting to restore connection...",
        duration: 3000
      });
    } else {
      setError("Unable to load Discord widget. Please try again later.");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to Discord. Please check your connection.",
        duration: 5000
      });
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    setIsLoading(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <SiDiscord className="w-12 h-12 text-[#5865F2]" />
        <p className="text-center text-sm text-white/80">{error}</p>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('https://discord.gg/sparqgames', '_blank')}
            className="flex items-center gap-2 hover:bg-[#5865F2] hover:text-white transition-all duration-300"
          >
            <SiDiscord className="w-4 h-4" />
            Join Our Server
          </Button>
        </div>
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