
import { Card } from "@/components/ui/card";
import { School } from "lucide-react";

export function SchoolSpotlight() {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <School className="w-5 h-5" />
        <h3 className="font-semibold">School Spotlight</h3>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center overflow-hidden pt-20 relative">
          <img
            src="/ustad.png"
            alt="USTAD"
            className="absolute w-[400%] h-[400%] object-contain transform scale-150 opacity-15"
          />
          <img
            src="/utes.png"
            alt="Utah Utes"
            className="relative w-[400%] h-[400%] object-contain transform scale-150"
          />
        </div>
        <div className="mt-auto text-center">
          <p className="text-sm text-muted-foreground mt-2">
            Proud partner in the Sparq gaming ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
