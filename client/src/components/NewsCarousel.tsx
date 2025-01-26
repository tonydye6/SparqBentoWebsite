
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: 'NIL' | 'AI Gaming' | 'Web3';
  date: string;
  url?: string;
}

// This would be replaced with an API call in production
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "NCAA Athletes Leverage NIL Deals in Gaming Industry",
    content: "College athletes are finding new opportunities in the gaming sector...",
    category: "NIL",
    date: new Date().toLocaleDateString()
  },
  {
    id: 2,
    title: "AI Revolutionizes Player Experience in Sports Games",
    content: "New AI technology is transforming how players interact with sports games...",
    category: "AI Gaming",
    date: new Date().toLocaleDateString()
  },
  {
    id: 3,
    title: "Web3 Integration in College Sports Gaming",
    content: "Blockchain technology is creating new possibilities for college sports fans...",
    category: "Web3",
    date: new Date().toLocaleDateString()
  },
  {
    id: 4,
    title: "The Future of NIL Deals in Gaming",
    content: "How gaming companies are partnering with college athletes...",
    category: "NIL",
    date: new Date().toLocaleDateString()
  }
];

export function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(0, mockNews.length - 2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextNews = () => {
    setCurrentIndex((prev) => 
      (prev + 1) % Math.max(0, mockNews.length - 2)
    );
  };

  const prevNews = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + Math.max(0, mockNews.length - 2)) % Math.max(0, mockNews.length - 2)
    );
  };

  const visibleNews = mockNews.slice(currentIndex, currentIndex + 3);

  if (selectedArticle) {
    return (
      <div className="h-full p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            <h3 className="font-semibold">{selectedArticle.category}</h3>
          </div>
          <Button variant="ghost" onClick={() => setSelectedArticle(null)}>
            Back
          </Button>
        </div>

        <Card className="flex-1 p-4 bg-black/20 overflow-y-auto">
          <h4 className="text-xl font-semibold mb-2">{selectedArticle.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{selectedArticle.date}</p>
          <p className="text-sm">{selectedArticle.content}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5" />
        <h3 className="font-semibold">Word Around Town</h3>
      </div>

      <div className="flex-1 space-y-2">
        {visibleNews.map((news) => (
          <Card 
            key={news.id}
            className="p-3 bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
            onClick={() => setSelectedArticle(news)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-1">{news.title}</p>
                <span className="text-xs text-muted-foreground">{news.category} • {news.date}</span>
              </div>
            </div>
          </Card>
        ))}
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
