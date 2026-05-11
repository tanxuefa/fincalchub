import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - FinCalcHub',
  description: 'Learn about FinCalcHub - free financial calculators for smarter money decisions.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About FinCalcHub</h1>
      <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300">
        <p>
          FinCalcHub is a free online platform providing accurate, easy-to-use financial calculators for everyone.
          Whether you&apos;re planning to buy a home, saving for retirement, paying off debt, or investing for the future,
          our calculators help you make informed financial decisions.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
        <p>
          We believe that financial literacy should be accessible to everyone. Our calculators are 100% free,
          require no registration, and work directly in your browser. We never store your financial data.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How We Make Money</h2>
        <p>
          FinCalcHub is supported by advertising and affiliate partnerships. When you click on recommended
          financial products or services, we may earn a commission. This never affects our calculator results
          or recommendations. We clearly disclose all affiliate relationships.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Disclaimer</h2>
        <p>
          All calculators are provided for informational purposes only. Results should not be considered
          financial advice. Always consult with a qualified financial advisor before making major financial decisions.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact</h2>
        <p>
          For questions, suggestions, or business inquiries, please contact us at hello@fincalchub.com.
        </p>
      </div>
    </div>
  );
}
