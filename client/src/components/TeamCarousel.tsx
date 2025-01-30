
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
  previousCompanies: { name: string; logo: string }[];
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Jan Horsfall",
    title: "CEO / BOD Chair",
    photo: "/janh.png",
    linkedIn: "https://www.linkedin.com/in/janhorsfall/",
    previousCompanies: [
      { name: "Turbine Games", logo: "/turb.png" },
      { name: "Lycos", logo: "/lycos.png" }
    ],
    bio: "Ran marketing at Valvoline and then at tech juggernaut, Lycos. Had the fastest IPO in NASDAQ history, stock price surge of 3,000%, and sold for $4.5 billion. CEO roles at Gemini (acquired by Novo Networks), Gelazzi (bought by Big Freeze), Universal (sold to PetroChoice). Served as the CMO at Turbine Games (acquired by Warner Bros). On NorthWestern's board (NASDAQ: NWE) and recently completed work at MIT Sloan CSAIL (Comp Sci AI Lab) studying AI: Implications for Business Strategy."
  },
  {
    name: "Tony Dye",
    title: "President / BOD - HR Comm. Chair",
    photo: "/tonyd.png",
    linkedIn: "https://www.linkedin.com/in/tony-dye-0a0836113/",
    previousCompanies: [
      { name: "Cincinnati Bengals", logo: "/bengals.png" },
      { name: "UCLA Bruins", logo: "/ucla.png" }
    ],
    bio: "Former UCLA student-athlete and team MVP who went on to play in the NFL for the Cincinnati Bengals and Oakland Raiders. Has two brothers in the NFL. Passionate about athletics, Web3, blockchain apps, and gaming. Focus is on building games which help athletes capitalize on their name, image, & likeness."
  },
  {
    name: "Jeffrey Steefel",
    title: "SVP - Games",
    photo: "/jeffreys.png",
    linkedIn: "https://www.linkedin.com/in/jeffrey-steefel-97380/",
    previousCompanies: [
      { name: "Disney", logo: "/dis.png" },
      { name: "Wizards of the Coast", logo: "/wiz.png" }
    ],
    bio: "Game-industry thought leader who headed franchises at 7th Level, Turbine, Sony, Warner Bros., Disney, Wizards/Hasbro. Created original IP for Disney, The Lord of the Rings, Dungeons & Dragons, Magic: The Gathering, Monty Python, and Bandai. Developer of single and multiplayer games across numerous genres."
  },
  {
    name: "Daniel Algattas",
    title: "Director - AI Projects & Technology",
    photo: "/daniela.png",
    linkedIn: "https://www.linkedin.com/in/danielalgattas/",
    previousCompanies: [
      { name: "UCLA", logo: "/ucla.png" }
    ],
    bio: "QB at UCLA and Colorado State who created some of the most innovative apps used in college football coaching circles. Has an outstanding combination of skills mixing athletics and computer science. Developed apps for the Google and Apple stores and has applied AI across a myriad of computer applications."
  },
  {
    name: "Rob Vogel",
    title: "SVP - University & Player Relationships",
    photo: "/robv.png",
    linkedIn: "https://www.linkedin.com/in/robvogelj5partners/",
    previousCompanies: [
      { name: "J5 Partners", logo: "/j5.png" },
      { name: "The Bonam Group", logo: "/bng.png" }
    ],
    bio: "Founder of J5 Partners, a sports business solutions firm. Uses 30 years of sports experience and leverages his network of sports decision-makers to drive business. Worked with brands such as JPMorgan Chase, FedEx, BofA, Honda, General Mills, Heineken, US Bank, IBM, Universal Studios and sports properties including the NFL, NBA, NHL, ACC, Big 12, Ohio State, Miami, UNC and UT."
  },
  {
    name: "Chase Huber",
    title: "SVP - User Acquisition",
    photo: "/chaseh.png",
    linkedIn: "https://www.linkedin.com/in/chase-huber-132b033/",
    previousCompanies: [
      { name: "Turbine", logo: "/turb.png" },
      { name: "Warner Bros", logo: "/wb.png" }
    ],
    bio: "Visionary and strategic growth architect with two decades of experience in transformative initiatives and fostering product-led growth across diverse sectors including gaming, tech, entertainment. Proven expertise at notable firms such as Workhuman, Liberty Mutual, Warner Bros. Games, and Digitas. He embodies a data-driven and collaborative leadership approach. Studied AI at Cal Berkeley."
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
      <Card className="flex-1 p-4 bg-black/20 flex flex-col items-center">
        <Avatar className="w-40 h-40 mb-4">
          <AvatarImage src={member.photo} alt={member.name} />
          <AvatarFallback>
            {member.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <h4 className="font-semibold text-center">{member.name}</h4>
        <p className="text-sm text-muted-foreground mb-2">{member.title}</p>

        <div className="flex gap-2 mb-2">
          {member.previousCompanies.map((company, i) => (
            <div key={i} className="flex items-center gap-1">
              <img src={company.logo} alt={company.name} className="w-12 h-12 object-contain" />
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mb-4 line-clamp-4 hover:line-clamp-none">
          {member.bio}
        </p>

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
