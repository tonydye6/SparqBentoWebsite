import { Button } from "@/components/ui/button";
import { Users, Send, Lightbulb } from "lucide-react";

interface JobPosting {
  title: string;
  department: string;
  location: string;
  description: string;
}

const openings: JobPosting[] = [
  {
    title: "Senior Game Developer",
    department: "Engineering",
    location: "Remote",
    description: "Lead development of next-gen sports gaming experiences using cutting-edge AI and blockchain technology. Must have experience with Unity/Unreal Engine and multiplayer game development."
  },
  {
    title: "AI Engineer",
    department: "AI/ML",
    location: "Colorado Springs",
    description: "Develop and implement AI systems for player behavior analysis, game balancing, and dynamic content generation. Strong background in machine learning and game AI required."
  }
];

export function JoinUs({ expanded = false }) {
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
    <div className="h-full p-4 flex flex-col">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-4">Current Openings</h3>
        <div className="space-y-4">
          {openings.map((job, index) => (
            <div
              key={index}
              className="p-4 rounded bg-black/20 backdrop-blur-sm"
            >
              <div className="font-medium text-lg mb-2">{job.title}</div>
              <div className="text-sm text-accent-cyan mb-2">
                {job.department} • {job.location}
              </div>
              <p className="text-sm text-white/80">{job.description}</p>
              <button 
                onClick={() => window.open('mailto:careers@sparqgames.com')}
                className="mt-3 px-4 py-2 bg-accent-cyan/20 hover:bg-accent-cyan/30 text-white rounded-md transition-colors"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded bg-white/5 backdrop-blur-sm text-center">
          <h4 className="font-medium mb-2">Don't see a perfect fit?</h4>
          <p className="text-sm text-white/80 mb-3">We're always looking for talented individuals to join our team!</p>
          <button 
            onClick={() => window.open('mailto:careers@sparqgames.com?subject=General Job Inquiry')}
            className="px-6 py-2 bg-primary-red hover:bg-primary-red/80 text-white rounded-md transition-colors"
          >
            Submit General Inquiry
          </button>
        </div>
      </div>
    </div>
  );
}