
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JobPosting {
  title: string;
  department: string;
  location: string;
  description: string;
}

const openings: JobPosting[] = [
  {
    title: "Chief Technology Officer",
    department: "Executive",
    location: "Colorado Springs",
    description: "To be hired by 3/1/2025"
  }
];

export function JoinUs({ expanded = false }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  if (!expanded) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-4">Join the Sparq Uprising!</h2>
        <p className="text-white/80 text-center">
          Join the revolution in sports-centric mobile gaming, powered by AAA Sports IP,
          cutting-edge AI, and blockchain technology.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Join Sparq Games</h2>
        <p className="text-lg leading-relaxed">
          Sparq's platform simplifies how games get built and marketed so that the employee owners and development partners focus on creativity instead of the tedious tasks that absorb game-building hours. Sparq is making games more fun by rewarding the best people in the business to truly do what they do best.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Current Openings</h3>
        <div className="grid gap-4">
          {openings.map((job, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5 backdrop-blur-sm">
              <h4 className="text-lg font-semibold">{job.title}</h4>
              <p className="text-sm text-white/80">{job.department} • {job.location}</p>
              <p className="mt-2">{job.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Submit Your Resume</h3>
        <div className="flex gap-4 items-center">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="max-w-sm"
          />
          <Button
            onClick={() => {
              // Handle resume submission
              if (selectedFile) {
                console.log("Resume submitted:", selectedFile.name);
              }
            }}
            disabled={!selectedFile}
          >
            Submit Resume
          </Button>
        </div>
      </div>

      <blockquote className="border-l-4 border-primary-red pl-4 py-2 my-6 italic">
        <p className="text-lg">
          "We're hiring - not firing - and making Sparq one of the best places to work. We defy the old approach to game building which destroyed employees and stifled creativity. When human beings love working in a modern, successful setting, they use their vast work experience to create the best games in the world. That's the key to creating fun for the gamer."
        </p>
        <footer className="mt-2 text-sm font-semibold">
          - Jan Horsfall, CEO
        </footer>
      </blockquote>
    </div>
  );
}
