
import React from 'react';

export const DiscordWidget: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <iframe 
        src="https://discord.com/widget?id=YOUR_DISCORD_SERVER_ID&theme=dark"
        width="100%" 
        height="100%" 
        frameBorder="0" 
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="rounded-lg"
      />
    </div>
  );
};
