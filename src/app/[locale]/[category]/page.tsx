import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { calculators, calculatorCategories } from '@/data/calculators';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

const categoryMeta: Record<string, { title: string; description: string }> = {
  mortgage: { title: 'Mortgage & Real Estate Calculators', description: 'Calculate mortgage payments, amortization, refinance, and home affordability.' },
  investment: { title: 'Investment & Retirement Calculators', description: 'Compound interest, retirement planning, FIRE, and investment return calculators.' },
  debt: { title: 'Loan & Debt Calculators', description: 'Auto loans, personal loans, student loans, and debt payoff calculators.' },
  savings: { title: 'Savings Calculators', description: 'Savings goals, emergency funds, CDs, and college savings calculators.' },
  'credit-card': { title: 'Credit Card Calculators', description: 'Credit card payoff, balance transfer, and rewards calculators.' },
  tax: { title: 'Tax Calculators', description: 'Income tax estimators, capital gains tax, and VAT calculators.' },
  business: { title: 'Business & Real Estate Calculators', description: 'ROI, NPV, break-even analysis, and rental property calculators.' },
  currency: { title: 'Currency & Inflation Calculators', description: 'Currency converter, inflation calculator, and exchange fee calculators.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) return { title: 'Not Found' };
  return {
    title: `${meta.title} - FinCalcHub`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  const cat = calculatorCategories.find((c) => c.slug === category);

  if (!cat) notFound();

  const categoryCalculators = calculators.filter((c) => c.category === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {cat.icon} <CatName nameKey={cat.nameKey} />
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          <CatDesc descKey={cat.descriptionKey} />
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCalculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${locale}/${category}/${calc.slug}`}
            className="group rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:hover:border-blue-700"
          >
            <div className="text-3xl">{calc.icon}</div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white">
              <CalcTitle nameKey={calc.nameKey} />
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <CalcDesc descKey={calc.descriptionKey} />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CatName({ nameKey }: { nameKey: string }) {
  const t = useTranslations();
  return <>{t(nameKey as Parameters<typeof t>[0])}</>;
}
function CatDesc({ descKey }: { descKey: string }) {
  const t = useTranslations();
  return <>{t(descKey as Parameters<typeof t>[0])}</>;
}
function CalcTitle({ nameKey }: { nameKey: string }) {
  const t = useTranslations();
  return <>{t(nameKey as Parameters<typeof t>[0])}</>;
}
function CalcDesc({ descKey }: { descKey: string }) {
  const t = useTranslations();
  return <>{t(descKey as Parameters<typeof t>[0])}</>;
}
