import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Calculators Blog - FinCalcHub',
  description: 'Guides, tips, and insights to help you make better financial decisions.',
};

const articles = [
  {
    slug: 'mortgage-guide-2026',
    title: 'Complete Guide to Mortgage Payments in 2026',
    excerpt: 'Everything you need to know about calculating your monthly mortgage payment, including taxes, insurance, and PMI.',
    date: '2026-05-01',
    category: 'mortgage',
  },
  {
    slug: 'compound-interest-explained',
    title: 'How Compound Interest Grows Your Wealth Over Time',
    excerpt: 'Learn how the power of compound interest works and see real examples of wealth building over decades.',
    date: '2026-04-15',
    category: 'investment',
  },
  {
    slug: 'debt-payoff-strategies',
    title: 'Avalanche vs. Snowball: Which Debt Payoff Strategy is Right for You?',
    excerpt: 'Compare the two most popular debt payoff methods and find out which one saves you more money.',
    date: '2026-04-01',
    category: 'debt',
  },
  {
    slug: 'fire-movement-guide',
    title: 'FIRE Movement: Your Path to Financial Independence in 2026',
    excerpt: 'Understand the FIRE concept, calculate your FIRE number, and learn strategies to reach financial independence faster.',
    date: '2026-03-20',
    category: 'investment',
  },
  {
    slug: 'emergency-fund-guide',
    title: 'How Much Should Your Emergency Fund Be?',
    excerpt: 'Calculate your ideal emergency fund size based on your monthly expenses, job security, and lifestyle.',
    date: '2026-03-10',
    category: 'savings',
  },
];

export default function BlogPage() {
  const t = useTranslations('blog');

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
        {t('description')}
      </p>
      <div className="mt-10 space-y-8">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:hover:border-blue-700">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {article.category}
              </span>
              <time>{article.date}</time>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Link href={`/blog/${article.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {article.title}
              </Link>
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {article.excerpt}
            </p>
            <Link href={`/blog/${article.slug}`} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
