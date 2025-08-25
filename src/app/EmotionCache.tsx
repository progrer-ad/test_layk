// src/app/EmotionCache.tsx
'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

// Bu fayl Next.js App Router bilan Emotion.js dan to'g'ri foydalanish uchun kerak
// Chunki Next.js server-side rendering qiladi, Emotion stillari to'g'ri inject qilinishi kerak.

export default function NextAppDirEmotionCacheProvider(props: any) {
  const { options, children } = props;

  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <EmotionCacheProvider value={cache}>{children}</EmotionCacheProvider>;
}