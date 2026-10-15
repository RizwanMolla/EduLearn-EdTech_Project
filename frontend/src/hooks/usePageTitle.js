import { useEffect } from 'react';

export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | EduLearn` : 'EduLearn | Learn by building real things';
  }, [title]);
};
