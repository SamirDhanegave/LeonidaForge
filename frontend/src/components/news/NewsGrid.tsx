import React from 'react';
import { NewsCard } from './NewsCard';
import type { News } from '../../types';

interface NewsGridProps {
  articles: News[];
  columns?: 2 | 3;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ articles, columns = 3 }) => {
  const colClass = columns === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${colClass} gap-5`}>
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
};
