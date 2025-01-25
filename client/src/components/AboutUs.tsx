import { Button } from "@/components/ui/button";
import { Gamepad2, Sparkles, Trophy } from "lucide-react";

interface AboutUsProps {
  title?: string;
  variant?: 'primary' | 'secondary';
}

export function AboutUs({ title = "Enter the Sparqverse", variant = 'primary' }: AboutUsProps) {
  return (
    <div className="h-full p-6 flex flex-col text-white">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {variant === 'primary' ? (
        <p className="text-white/80 mb-6">
          Join the revolution in sports-centric mobile gaming, powered by AAA Sports IP,
          cutting-edge AI, and blockchain technology.
        </p>
      ) : (
        <p className="text-white/80 mb-6">
          A Vision Worth Founding
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          <span className="text-sm">700+ University IPs</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">AI-Powered Gaming</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Next-Gen Experience</span>
        </div>
      </div>

      {variant === 'primary' && (
        <Button 
          className="mt-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          onClick={() => {
            // Handle expansion to full screen
            console.log("Expand About Us");
          }}
        >
          Learn More
        </Button>
      )}
    </div>
  );
}