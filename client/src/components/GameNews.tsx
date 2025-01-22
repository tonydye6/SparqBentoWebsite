import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  category: 'AI' | 'Gaming' | 'NCAA';
}

const mockNews: NewsItem[] = [
  {
    title: "AI Revolution in Gaming",
    description: "How artificial intelligence is transforming the gaming industry",
    category: "AI"
  },
  {
    title: "NCAA NIL Updates",
    description: "Latest developments in Name, Image, and Likeness regulations",
    category: "NCAA"
  },
  {
    title: "Mobile Gaming Trends 2025",
    description: "The future of mobile gaming and emerging technologies",
    category: "Gaming"
  }
];

export function GameNews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % mockNews.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + mockNews.length) % mockNews.length);
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5" />
        <h3 className="font-semibold">Latest News</h3>
      </div>

      <Card className="flex-1 p-4 bg-black/20">
        <div className="h-full flex flex-col">
          <span className="text-xs font-medium text-primary mb-2">
            {mockNews[currentIndex].category}
          </span>
          <h4 className="text-lg font-semibold mb-2">
            {mockNews[currentIndex].title}
          </h4>
          <p className="text-sm text-muted-foreground flex-1">
            {mockNews[currentIndex].description}
          </p>
        </div>
      </Card>

      <div className="flex justify-between mt-4">
        <Button variant="ghost" size="icon" onClick={prevNews}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={nextNews}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
