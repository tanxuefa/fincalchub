import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { calculatorCategories, calculators } from '@/data/calculators';

export default function HomePage() {
  const t = useTranslations('home');
  const tc = useTranslations('categories');

  const featured = ['mortgage-payment', 'compound-interest', 'retirement', 'credit-card-payoff', 'debt-payoff', 'currency-converter'];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 dark:from-blue-950/20 dark:to-gray-950 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            {t('hero_title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('hero_subtitle')}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="#categories"
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
              Browse Calculators
            </Link>
            <Link
              href="#featured"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              Popular Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Calculators */}
      <section id="featured" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('featured_title')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculators
              .filter((c) => featured.includes(c.slug))
              .map((calc) => (
                <Link
                  key={calc.slug}
                  href={`${calc.category}/${calc.slug}`}
                  className="group rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:hover:border-blue-700"
                >
                  <div className="text-3xl">{calc.icon}</div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white">
                    {calc.nameKey}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {calc.descriptionKey}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categories_title')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {calculatorCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
              >
                <div className="text-3xl">{cat.icon}</div>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                  {cat.nameKey}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {cat.descriptionKey}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why FinCalcHub */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {t('why_title')}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🆓', title: t('why_free') },
              { icon: '✅', title: t('why_accurate') },
              { icon: '🔒', title: t('why_privacy') },
              { icon: '🔗', title: t('why_sharing') },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl">{item.icon}</div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
