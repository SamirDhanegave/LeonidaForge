import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  params: {},
});

export function getCleanPath(): string {
  // Support pathname first (clean SEO URLs), then fallback to hash if present
  if (typeof window === 'undefined') return '/';

  const pathname = window.location.pathname;
  if (pathname && pathname !== '/' && pathname !== '') {
    return pathname;
  }

  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    return hash.slice(1);
  }

  return '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(getCleanPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCleanPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (!to.startsWith('/')) {
      to = '/' + to;
    }

    try {
      window.history.pushState({}, '', to);
    } catch {
      // Fallback for sandboxed iframe environments where pushState might be restricted
      window.location.hash = '#' + to;
    }

    setCurrentPath(to);
    window.scrollTo(0, 0);
  }, []);

  // Parse path parameters (e.g. /vehicles/:slug, /guides/:slug, /news/:id)
  const params: Record<string, string> = {};
  const segments = currentPath.split('?')[0].split('#')[0].split('/').filter(Boolean);
  if (segments.length >= 2) {
    if (segments[0] === 'vehicles' || segments[0] === 'guides') {
      params.slug = segments[1];
    }
    if (segments[0] === 'news') {
      params.id = segments[1];
    }
  }

  return (
    <RouterContext.Provider value={{ path: currentPath.split('?')[0].split('#')[0], navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({
  to,
  children,
  className,
  title,
  id,
  target,
  rel,
  itemProp,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  title?: string;
  id?: string;
  target?: string;
  rel?: string;
  itemProp?: string;
  key?: React.Key;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();
  const cleanHref = to.startsWith('/') ? to : '/' + to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Respect meta keys for open in new tab/window
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || target === '_blank') {
      return;
    }

    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a
      id={id}
      href={cleanHref}
      onClick={handleClick}
      className={className}
      title={title}
      target={target}
      rel={rel}
      itemProp={itemProp}
    >
      {children}
    </a>
  );
}
