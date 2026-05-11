import { notFound } from 'next/navigation';
import { calculators } from '@/data/calculators';
import type { Metadata } from 'next';
import CalculatorClient from './CalculatorClient';
import { CalculatorSchema } from '@/components/seo/StructuredData';

interface Props {
  params: Promise<{ locale: string; category: string; calculator: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, calculator } = await params;
  const calc = calculators.find((c) => c.category === category && c.slug === calculator);
  if (!calc) return { title: 'Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fincalchub.com';
  const url = `${baseUrl}/${locale}/${category}/${calculator}`;

  return {
    title: `${calc.nameKey} - FinCalcHub`,
    description: calc.descriptionKey,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/${category}/${calculator}`,
        es: `${baseUrl}/es/${category}/${calculator}`,
        de: `${baseUrl}/de/${category}/${calculator}`,
        fr: `${baseUrl}/fr/${category}/${calculator}`,
      },
    },
    openGraph: {
      title: `${calc.nameKey} - FinCalcHub`,
      description: calc.descriptionKey,
      url,
      siteName: 'FinCalcHub',
      type: 'website',
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { locale, category, calculator } = await params;
  const calc = calculators.find((c) => c.category === category && c.slug === calculator);

  if (!calc) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fincalchub.com';
  const url = `${baseUrl}/${locale}/${category}/${calculator}`;

  return (
    <>
      <CalculatorSchema name={calc.nameKey} description={calc.descriptionKey} url={url} />
      <CalculatorClient calculator={calc} locale={locale} />
    </>
  );
}
