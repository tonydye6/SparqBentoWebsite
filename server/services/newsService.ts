
import { client } from '../utils/perplexityClient';
import { db } from '@db';
import { newsItems, type SelectNewsItem } from '@db/schema';
import { eq, lt } from 'drizzle-orm';
import { addDays, subDays } from 'date-fns';

export async function fetchLatestNews(): Promise<SelectNewsItem[]> {
  const messages = [
    {
      "role": "system",
      "content": "Find the three most recent and relevant articles about: NCAA NIL developments, AI in gaming industry, and Web3 gaming. Return only the title and URL for each."
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

    return await db.query.newsItems.findMany({
      where: eq(newsItems.active, true),
      orderBy: (newsItems, { desc }) => [desc(newsItems.createdAt)]
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}
