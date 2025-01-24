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

export function JoinUs() {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h3 className="font-semibold">Join Our Team</h3>
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
                <div className="font-medium">{job.title}</div>
                <div className="text-xs text-muted-foreground">
                  {job.department} • {job.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Contact Us
          </h4>
          <a
            href="mailto:info@sparqgames.com"
            className="text-sm text-primary hover:underline"
          >
            info@sparqgames.com
          </a>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Share Your Ideas
          </h4>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.location.href = 'mailto:ideas@sparqgames.com'}
          >
            Submit Game Idea
          </Button>
        </div>
      </div>
    </div>
  );
}
