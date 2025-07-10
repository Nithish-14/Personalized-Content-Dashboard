
import { useEffect, useCallback, RefObject } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = (
  targetRef: RefObject<HTMLElement>,
  { hasMore, loading, onLoadMore, threshold = 100 }: UseInfiniteScrollOptions
) => {
  const handleScroll = useCallback(() => {
    if (!targetRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = targetRef.current;
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onLoadMore();
    }
  }, [targetRef, loading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    
    // Check if we need to load more content on mount
    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};
