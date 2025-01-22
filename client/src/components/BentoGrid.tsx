import { Card } from "@/components/ui/card";
import { ThreeViewer } from "./ThreeViewer";
import { AiChat } from "./AiChat";
import { BetaForm } from "./BetaForm";
import { DiscordWidget } from "./DiscordWidget";

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
      {/* Box 1: Main 3D Viewer */}
      <Card className="row-span-2 col-span-2 p-6 bg-black/80 overflow-hidden">
        <ThreeViewer />
      </Card>

      {/* Box 2: AI Chat */}
      <Card className="row-span-1 p-4 bg-[#10B981]/10">
        <AiChat />
      </Card>

      {/* Box 3: Discord */}
      <Card className="row-span-1 p-4 bg-[#5865F2]/10">
        <DiscordWidget />
      </Card>

      {/* Box 4: Beta Signup */}
      <Card className="col-span-2 p-6 bg-primary/10">
        <BetaForm />
      </Card>
    </div>
  );
}
