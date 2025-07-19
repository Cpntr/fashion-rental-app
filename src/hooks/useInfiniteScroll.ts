// src/hooks/useInfiniteScroll.ts

import { useEffect, useRef } from "react";

export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  loading: boolean
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    });

    if (node) observer.current.observe(node);
  };

  return lastElementRef;
};
