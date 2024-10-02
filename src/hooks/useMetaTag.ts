// src/hooks/useMetaTag.ts
import { useEffect } from 'react';

function useMetaTag(name: string, content: string) {
  useEffect(() => {
    const metaTag = document.querySelector(`meta[name="${name}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.setAttribute('name', name);
      newMetaTag.setAttribute('content', content);
      document.head.appendChild(newMetaTag);
    }
  }, [name, content]);
}

export default useMetaTag;