import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";

export function DiscordWidget() {
  return (
    <div className="h-full w-full">
      <iframe 
        src="https://discord.com/widget?id=1326318974761173002&theme=dark" 
        width="100%" 
        height="100%" 
        allowTransparency={true} 
        frameBorder="0" 
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </div>
  );
}