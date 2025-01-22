import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  name: string;
  title: string;
  photo: string;
  linkedIn: string;
  previousCompanies: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "John Smith",
    title: "CEO & Founder",
    photo: "/team/john.jpg",
    linkedIn: "https://linkedin.com/in/johnsmith",
    previousCompanies: ["EA", "Activision", "Unity"]
  },
  {
    name: "Sarah Johnson",
    title: "CTO",
    photo: "/team/sarah.jpg",
    linkedIn: "https://linkedin.com/in/sarahjohnson",
    previousCompanies: ["Epic Games", "Ubisoft"]
  }
];

export function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const member = teamMembers[currentIndex];

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h3 className="font-semibold">Our Team</h3>
      </div>

      <Card className="flex-1 p-4 bg-black/20 flex flex-col items-center">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarImage src={member.photo} alt={member.name} />
          <AvatarFallback>
            {member.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <h4 className="font-semibold text-center">{member.name}</h4>
        <p className="text-sm text-muted-foreground mb-4">{member.title}</p>

        <div className="flex gap-2 mb-4">
          {member.previousCompanies.map((company, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-primary/10"
            >
              {company}
            </span>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="mt-auto"
          onClick={() => window.open(member.linkedIn, '_blank')}
        >
          <SiLinkedin className="w-5 h-5" />
        </Button>
      </Card>

      <div className="flex justify-between mt-4">
        <Button variant="ghost" size="icon" onClick={prevMember}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={nextMember}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
