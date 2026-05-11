'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations('footer');
  const n = useTranslations('nav');

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">FinCalcHub</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('made_with')}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{n('calculators')}</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href={`/${locale}/mortgage`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Mortgage</Link>
              <Link href={`/${locale}/investment`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Investment</Link>
              <Link href={`/${locale}/debt`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Loan & Debt</Link>
              <Link href={`/${locale}/savings`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Savings</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href={`/${locale}/privacy`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">{n('privacy')}</Link>
              <Link href={`/${locale}/terms`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">{n('terms')}</Link>
              <Link href={`/${locale}/about`} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">{n('about')}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{n('language')}</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/en" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">English</Link>
              <Link href="/es" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Español</Link>
              <Link href="/de" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Deutsch</Link>
              <Link href="/fr" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">Français</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-xs text-gray-500">{t('copyright')}</p>
          <p className="mt-2 text-xs text-gray-400">{t('disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
