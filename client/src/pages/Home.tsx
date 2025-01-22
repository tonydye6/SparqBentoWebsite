import { BentoGrid } from "@/components/BentoGrid";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-4 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <img src="/sparqIcon.png" alt="Sparq Games" className="h-8" />
          <nav className="hidden md:flex gap-6">
            <Button variant="ghost">Join the Beta</Button>
            <Button variant="ghost">Mission & Vision</Button>
            <Button variant="ghost">Join Us</Button>
          </nav>
          <Button variant="outline" className="md:hidden">Menu</Button>
        </div>
      </header>

      <main>
        <BentoGrid />
      </main>
    </div>
  );
}