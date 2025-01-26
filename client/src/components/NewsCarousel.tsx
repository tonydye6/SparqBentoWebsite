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
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(0, news.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  const nextNews = () => {
    setCurrentIndex((prev) => 
      (prev + 1) % news.length
    );
  };

  const prevNews = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + news.length) % news.length
    );
  };

  const openArticle = (article: NewsItem) => {
    if (article.url) {
      window.open(article.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <p>Error loading news</p>
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
        {news.map((article, index) => (
          <Card 
            key={article.id}
            className={`p-3 bg-black/20 cursor-pointer hover:bg-black/30 transition-colors transform ${
              index === currentIndex ? 'scale-105' : 'scale-100'
            }`}
            onClick={() => openArticle(article)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-1">{article.title}</p>
                <span className="text-xs text-muted-foreground">
                  {article.category} • {new Date(article.createdAt).toLocaleDateString()}
                </span>
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