import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  headline: string;
  content: string;
  summary: string;
  category: string;
  createdAt: string;
}

interface GameNewsProps {
  expanded: boolean;
  onHeadlineClick: (headline: string, content: string, category: string, date: string) => void;
}

export function GameNews({ expanded, onHeadlineClick }: GameNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      headline: "VR Dev Fast Travel Games Cuts 30 Employees Amid Uncertainty",
      content: "Fast Travel Games, a prominent VR game developer, has announced a significant workforce reduction of 30 employees due to market uncertainties. The company, known for their innovative VR titles, cited challenging market conditions and the need to restructure operations for long-term sustainability. This development reflects broader challenges in the VR gaming sector as companies navigate economic pressures and evolving market dynamics.",
      summary: "Major VR game developer reduces workforce",
      category: "Technology",
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      headline: "NCAA NIL Updates",
      content: "Latest developments in Name, Image, and Likeness regulations affecting college athletes. The NCAA has introduced new guidelines that will significantly impact how student-athletes can monetize their personal brands while maintaining their eligibility.",
      summary: "New NIL regulations announced",
      category: "Sports",
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      headline: "Mobile Gaming Trends 2025",
      content: "Industry analysts predict revolutionary changes in mobile gaming by 2025, with AI-driven personalization and cloud gaming taking center stage. The report highlights emerging technologies that will reshape how we play and interact with mobile games.",
      summary: "Future trends in mobile gaming",
      category: "Gaming",
      createdAt: new Date().toISOString()
    }
  ]);

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + newsItems.length) % newsItems.length
    );
  };

  const currentNews = newsItems[currentIndex];

  return (
    <div className="h-full flex flex-col">
      <div 
        className="flex-1 p-2 cursor-pointer hover:bg-gray-800/50 transition-all duration-200"
        onClick={() => onHeadlineClick(
          currentNews.headline,
          currentNews.content,
          currentNews.category,
          currentNews.createdAt
        )}
      >
        <div className="text-center">
          <span className="text-sm font-medium text-primary mb-2 block">
            {currentNews.category}
          </span>
          <h4 className="text-lg font-semibold hover:text-primary transition-colors">
            {currentNews.headline}
          </h4>
        </div>
      </div>

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