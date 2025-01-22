import { BentoGrid } from "@/components/BentoGrid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-4 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <img src="/sparq-logo.svg" alt="Sparq Games" className="h-8" />
          <nav className="hidden md:flex gap-6">
            <Button variant="ghost">Leadership</Button>
            <Button variant="ghost">Mission & Vision</Button>
            <Button variant="ghost">Join Us</Button>
            <Button variant="default">Join the Beta</Button>
          </nav>
          <Button variant="outline" className="md:hidden">Menu</Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Shaping the Future of Sports-Centric Mobile Game Publishing
          </h1>
          <p className="text-xl text-muted-foreground">
            Leveraging AAA Sports IP, Cutting-Edge AI, Game Tokens, and the Blockchain
          </p>
        </div>

        <BentoGrid />
        
        <Separator className="my-12" />
        
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Join the Revolution</h2>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Join the Beta
          </Button>
        </section>
      </main>

      <footer className="bg-card mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Sparq Games</h3>
              <p className="text-sm text-muted-foreground">
                265 Northfield Rd.<br />
                Colorado Springs, CO 80919
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-primary">Discord</a></li>
                <li><a href="#" className="text-sm hover:text-primary">Twitter</a></li>
                <li><a href="#" className="text-sm hover:text-primary">LinkedIn</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-primary">About</a></li>
                <li><a href="#" className="text-sm hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-primary">Privacy</a></li>
                <li><a href="#" className="text-sm hover:text-primary">Terms</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Sparq Inc, dba Sparq Games. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
