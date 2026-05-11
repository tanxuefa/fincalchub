'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  slot: 'above-calculator' | 'in-content' | 'sidebar' | 'below-calculator';
  format: 'banner' | 'rectangle' | 'vertical';
}

const AD_SLOTS: Record<string, string> = {
  'above-calculator': '1234567890', // Placeholder - replace with real AdSense slot IDs
  'in-content': '1234567891',
  'sidebar': '1234567892',
  'below-calculator': '1234567893',
};

export default function AdUnit({ slot, format }: AdUnitProps) {
  const t = useTranslations('layout');
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adVisible, setAdVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAdVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!adVisible || adLoaded) return;

    try {
      // AdSense loader - only load when visible (lazy)
      const adsbygoogle = (window as unknown as Record<string, unknown>).adsbygoogle as unknown[] | undefined;
      if (adsbygoogle && typeof adsbygoogle.push === 'function') {
        adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch {
      // AdSense not available (ad blocker, dev mode, etc.)
    }
  }, [adVisible, adLoaded]);

  const formatStyles = {
    banner: 'min-h-[90px] max-w-[728px]',
    rectangle: 'min-h-[250px] max-w-[300px]',
    vertical: 'min-h-[600px] max-w-[160px]',
  };

  return (
    <div
      ref={adRef}
      className={`${formatStyles[format]} mx-auto w-full overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900`}
    >
      {adVisible && (
        <div className="flex h-full items-center justify-center">
          {/* Real AdSense code - replace in production */}
          <ins
            className="adsbygoogle block"
            data-ad-client="ca-pub-7163013428197750"
            data-ad-slot={AD_SLOTS[slot]}
            data-ad-format="auto"
            data-full-width-responsive="true"
            style={{ display: 'block', width: '100%' }}
          />
          {/* Placeholder visible in dev */}
          {!adLoaded && (
            <span className="text-xs text-gray-400 dark:text-gray-600">
              {t('sponsored')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
