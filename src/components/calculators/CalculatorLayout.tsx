'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import AdUnit from '@/components/ads/AdUnit';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  inputs: ReactNode;
  results: ReactNode;
  schedule?: ReactNode;
  chart?: ReactNode;
  affiliateContent?: ReactNode;
}

export default function CalculatorLayout({
  title,
  description,
  inputs,
  results,
  schedule,
  chart,
  affiliateContent,
}: CalculatorLayoutProps) {
  const t = useTranslations('layout');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title + Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Ad: Above Calculator */}
      <div className="mb-6 flex justify-center">
        <AdUnit slot="above-calculator" format="banner" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t('inputs')}
            </h2>
            {inputs}
          </div>
        </div>

        {/* Results + Chart + Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t('results')}
            </h2>
            {results}
          </div>

          {/* Ad: In-Content */}
          <div className="flex justify-center">
            <AdUnit slot="in-content" format="rectangle" />
          </div>

          {chart && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {chart}
            </div>
          )}

          {schedule && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('schedule')}
              </h2>
              {schedule}
            </div>
          )}

          {/* Affiliate / Recommended Tools */}
          {affiliateContent && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('recommended_tools')}
              </h2>
              <p className="mb-3 text-xs text-gray-400">{t('affiliate_disclosure')}</p>
              {affiliateContent}
            </div>
          )}

          {/* Ad: Below Calculator */}
          <div className="flex justify-center">
            <AdUnit slot="below-calculator" format="banner" />
          </div>
        </div>
      </div>
    </div>
  );
}
