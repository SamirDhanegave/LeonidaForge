import React from 'react';
import { Link } from '../../services/router';
import { ChevronRight, Home } from 'lucide-react';
import { getCanonicalUrl } from '../../config/seoConfig';

export interface BreadcrumbItemDef {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItemDef[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const fullItems: BreadcrumbItemDef[] = [
    { label: 'Home', path: '/' },
    ...items,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-2 text-xs text-[#8090a8] ${className}`}
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;
          const canonical = getCanonicalUrl(item.path);

          return (
            <li
              key={item.path}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(index + 1)} />
              {isLast ? (
                <span
                  itemProp="name"
                  aria-current="page"
                  className="text-[#f8fafc] font-semibold truncate max-w-[200px] sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="hover:text-[#c8f135] transition-colors flex items-center gap-1"
                    itemProp="item"
                  >
                    {index === 0 && <Home className="w-3 h-3" />}
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <ChevronRight className="w-3 h-3 text-[#4b5563] shrink-0" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
