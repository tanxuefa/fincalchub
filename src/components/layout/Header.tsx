'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { locales, localeNames } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n/config';

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = newLocale;
    window.location.href = '/' + segments.join('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <span className="text-2xl">💰</span>
            FinCalcHub
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href={`/${locale}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300">
            {t('home')}
          </Link>
          <Link href={`/${locale}#categories`} className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300">
            {t('calculators')}
          </Link>
          <Link href={`/${locale}/blog`} className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300">
            {t('blog')}
          </Link>

          {/* Language Switcher */}
          <div className="relative ml-4">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600"
            >
              {localeNames[locale]}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-md border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => { switchLocale(l); setLangMenuOpen(false); }}
                    className={cn(
                      'block w-full px-4 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800',
                      l === locale && 'font-bold text-blue-600'
                    )}
                  >
                    {localeNames[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link href={`/${locale}#categories`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
              {t('calculators')}
            </Link>
            <Link href={`/${locale}/blog`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
              {t('blog')}
            </Link>
            <div className="flex gap-2 mt-2">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs border',
                    l === locale ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  {localeNames[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
