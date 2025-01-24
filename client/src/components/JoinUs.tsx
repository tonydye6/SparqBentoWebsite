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
    <div className="h-full w-full flex items-center justify-center">
      <h2 className="text-4xl font-bold text-white text-center">Join the Sparq Uprising!</h2>
    </div>
  );
}