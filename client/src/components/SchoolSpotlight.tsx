import { School } from "lucide-react";

export function SchoolSpotlight() {
  return (
    <div className="card-content">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center overflow-hidden pt-20 relative">
          <img
            src="/ustad.png"
            alt="USTAD"
            className="absolute w-full h-full object-cover transform scale-[2.5] opacity-10"
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