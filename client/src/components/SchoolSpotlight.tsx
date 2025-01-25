
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
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src="/utes.png"
            alt="University of Utah"
            className="w-[200%] h-[200%] object-contain"
          />
        </div>
        <div className="mt-auto text-center">
          <h4 className="text-lg font-semibold">
            University of Utah
          </h4>
          <p className="text-sm text-muted-foreground mt-2">
            Proud partner in the Sparq gaming ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
