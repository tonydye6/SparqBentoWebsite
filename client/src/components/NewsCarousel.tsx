import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BentoCardModal } from "@/components/BentoCardModal";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: 'NIL' | 'AI Gaming' | 'Web3';
  createdAt: string;
  url?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  if (isLoading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <Card className="p-4 bg-black/20">
          <div className="flex flex-col items-center gap-2 mb-4 w-full">
            <Newspaper className="w-5 h-5" />
            <h3 className="font-semibold text-center">Word Around Town</h3>
          </div>
          <p>Loading news...</p>
        </Card>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="h-full p-4">
        <Card className="h-full p-4 bg-black/20">
          <div className="flex flex-col items-center gap-2 mb-4 w-full">
            <Newspaper className="w-5 h-5" />
            <h3 className="font-semibold text-center">Word Around Town</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Check back later for the latest updates in gaming and sports.
          </p>
        </Card>
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <div className="h-full flex flex-col">
      <Card 
        className="flex-1 p-2 bg-black/20 border-0 cursor-pointer hover:bg-white/5 transition-all duration-200"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="h-full flex flex-col">
          {currentNews && (
            <div className="p-4">
              <div className="text-center">
                <span className="text-sm font-medium text-primary mb-3 block">
                  {currentNews.category}
                </span>
                <h4 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                  {currentNews.title}
                </h4>
              </div>
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

      {currentNews && (
        <BentoCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentNews.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {currentNews.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(currentNews.createdAt).toLocaleDateString()}
              </span>
            </div>
            <article className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                {currentNews.content}
              </p>
              {currentNews.url && (
                <a
                  href={currentNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-primary hover:underline"
                >
                  Read full article
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              )}
            </article>
          </div>
        </BentoCardModal>
      )}
    </div>
  );
}