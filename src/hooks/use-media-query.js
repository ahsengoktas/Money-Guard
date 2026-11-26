import { useSyncExternalStore } from 'react';

// Returns true while the CSS media query matches, and updates on resize.
export const useMediaQuery = (query) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
  );

export const MOBILE_QUERY = '(max-width: 767px)';
