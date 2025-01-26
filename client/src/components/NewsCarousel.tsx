
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface NewsItem {
  id: number;
  title: string;
  url: string;
  category: 'NIL' | 'AI Gaming' | 'Web3';
  createdAt: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  const response = await fetch('/api/news');
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
}

export function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 24 * 60 * 60 * 1000, // Refresh every 24 hours
    retry: 3
  });

  useEffect(() => {
    if (news.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, news.length));
  };

  const prevNews = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + Math.max(1, news.length)) % Math.max(1, news.length)
    );
  };

  const openArticle = (article: NewsItem) => {
    if (article?.url) {
      window.open(article.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <Card className="p-4 bg-black/20">
          <h3 className="font-semibold text-xl mb-4">Word Around Town</h3>
          <p>Loading news...</p>
        </Card>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="h-full p-4">
        <Card className="h-full p-4 bg-black/20">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5" />
            <h3 className="font-semibold">Word Around Town</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Check back later for the latest updates in gaming and sports.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col">
      <Card className="flex-1 p-4 bg-black/20 border-0">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5" />
            <h3 className="font-semibold">Word Around Town</h3>
          </div>
          {news[currentIndex] && (
            <div 
              className="cursor-pointer" 
              onClick={() => openArticle(news[currentIndex])}
            >
              <span className="text-xs font-medium text-primary mb-2 block">
                {news[currentIndex].category}
              </span>
              <h4 className="text-lg font-semibold mb-2">
                {news[currentIndex].title}
              </h4>
            </div>
          )}
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
