import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";

interface NewsItem {
  id: string;
  headline: string;
  content: string;
  summary: string;
}

export function GameNews({ expanded, onHeadlineClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      headline: "AI Revolution in Gaming",
      content: "How artificial intelligence is transforming the gaming industry with advanced NPCs and dynamic storytelling.",
      summary: "AI transforms gaming with smarter NPCs"
    },
    {
      id: '2',
      headline: "NCAA NIL Updates",
      content: "Latest developments in Name, Image, and Likeness regulations affecting college athletes.",
      summary: "New NIL regulations announced"
    },
    {
      id: '3',
      headline: "Mobile Gaming Trends 2025",
      content: "The future of mobile gaming and emerging technologies shaping the industry.",
      summary: "Future trends in mobile gaming"
    }
  ]);

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  return (
    <div className="h-full p-4">
      {newsItems.map((item) => (
        <div 
          key={item.id}
          className="news-item cursor-pointer p-2 hover:bg-gray-800/50 transition-all duration-200"
          onClick={() => onHeadlineClick(item.headline, item.content)}
        >
          <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.headline}</h3>
          <p className="text-sm text-gray-400 truncate">{item.summary}</p>
        </div>
      ))}

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