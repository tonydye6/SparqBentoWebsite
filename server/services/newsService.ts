import { client } from '../utils/perplexityClient';
import { db } from '@db';
import { newsItems, type SelectNewsItem } from '@db/schema';
import { eq, lt } from 'drizzle-orm';
import { addDays, subDays } from 'date-fns';

export async function fetchLatestNews(): Promise<SelectNewsItem[]> {
  const messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant that finds news articles. Format your response as a JSON array with exactly 3 articles, each containing title, url, and category fields. Categories should be one of: 'NIL', 'AI Gaming', or 'Web3'."
    },
    {
      "role": "user",
      "content": "Find recent news articles about NCAA NIL developments, AI in gaming industry, and Web3 gaming."
    }
  ];

  try {
    const response = await client.chat.completions.create({
      model: "mistral-7b-instruct",
      messages,
      max_tokens: 1024,
      temperature: 0.0
    });

    const articles = JSON.parse(response.choices[0].message.content);

    // Clear old articles
    await db.delete(newsItems)
      .where(lt(newsItems.createdAt, subDays(new Date(), 1)));

    // Insert new articles
    for (const article of articles) {
      await db.insert(newsItems).values({
        title: article.title,
        url: article.url,
        category: article.category,
        active: true
      });
    }

    let items = await db.query.newsItems.findMany({
      where: eq(newsItems.active, true),
      orderBy: (newsItems, { desc }) => [desc(newsItems.createdAt)]
    });

    if (!items.length) {
      // Insert default news items
      const defaultNews = [
        {
          title: "AI Integration Revolutionizes Player Development",
          url: "https://example.com/ai-sports",
          category: "AI Gaming",
          active: true
        },
        {
          title: "Latest NIL Changes Impact College Athletes",
          url: "https://example.com/nil-update",
          category: "NIL",
          active: true
        },
        {
          title: "Web3 Gaming Platform Launches New Features",
          url: "https://example.com/web3-gaming",
          category: "Web3",
          active: true
        }
      ];

      for (const news of defaultNews) {
        await db.insert(newsItems).values(news);
      }

      items = await db.query.newsItems.findMany({
        where: eq(newsItems.active, true),
        orderBy: (newsItems, { desc }) => [desc(newsItems.createdAt)]
      });
    }

    return items;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news items');
  }
}