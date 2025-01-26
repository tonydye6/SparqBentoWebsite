
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: 'NIL' | 'AI Gaming' | 'Web3';
  url?: string;
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
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 24 * 60 * 60 * 1000, // Refresh every 24 hours
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(0, news.length - 2));
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  const nextNews = () => {
    setCurrentIndex((prev) => 
      (prev + 1) % Math.max(0, news.length - 2)
    );
  };

  const prevNews = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + Math.max(0, news.length - 2)) % Math.max(0, news.length - 2)
    );
  };

  const visibleNews = news.slice(currentIndex, currentIndex + 3);

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
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(selectedArticle.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm">{selectedArticle.content}</p>
          {selectedArticle.url && (
            <a 
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline mt-4 block"
            >
              Read more
            </a>
          )}
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
                <span className="text-xs text-muted-foreground">
                  {news.category} • {new Date(news.createdAt).toLocaleDateString()}
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
