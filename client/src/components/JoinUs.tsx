import { Button } from "@/components/ui/button";
import { Users, Send, Lightbulb } from "lucide-react";

interface JobPosting {
  title: string;
  department: string;
  location: string;
}

const openings: JobPosting[] = [
  {
    title: "Senior Game Developer",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "AI Engineer",
    department: "AI/ML",
    location: "Colorado Springs"
  }
];

export function JoinUs({ expanded = false }) {
  if (!expanded) {
    return (
      <div className="h-full flex items-center justify-center">
        <h2 className="text-4xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Join the Sparq Uprising!</h2>
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h3 className="font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Join Our Team</h3>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <h4 className="text-sm font-medium mb-2">Open Positions</h4>
          <div className="space-y-2">
            {openings.map((job, index) => (
              <div
                key={index}
                className="p-2 rounded bg-black/20 text-sm"
              >
                <div className="font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{job.title}</div>
                <div className="text-xs text-muted-foreground drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {job.department} • {job.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <Send className="w-4 h-4" />
            Contact Us
          </h4>
          <a
            href="mailto:info@sparqgames.com"
            className="text-sm text-primary hover:underline drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          >
            info@sparqgames.com
          </a>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <Lightbulb className="w-4 h-4" />
            Share Your Ideas
          </h4>
          <Button
            variant="outline"
            size="sm"
            className="w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            onClick={() => window.location.href = 'mailto:ideas@sparqgames.com'}
          >
            Submit Game Idea
          </Button>
        </div>
      </div>
    </div>
  );
}