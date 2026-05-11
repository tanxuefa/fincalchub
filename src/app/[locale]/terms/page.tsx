import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use - FinCalcHub',
  description: 'Terms of use for FinCalcHub financial calculators.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Use</h1>
      <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p><strong>Last Updated:</strong> May 2026</p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing and using FinCalcHub, you agree to be bound by these Terms of Use.
          If you do not agree, please do not use our services.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Use of Calculators</h2>
        <p>
          Our financial calculators are provided for informational and educational purposes only.
          Results are estimates and should not be construed as financial, legal, or tax advice.
          We make no guarantees regarding the accuracy or completeness of calculator results.
          Always verify calculations independently and consult qualified professionals before
          making financial decisions.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. No Financial Advice</h2>
        <p>
          FinCalcHub is not a financial advisor, lender, broker, or tax professional. Nothing
          on this website constitutes financial advice. Your use of our calculators does not
          create a client-advisor relationship.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Intellectual Property</h2>
        <p>
          All content, calculators, and materials on FinCalcHub are protected by copyright
          and intellectual property laws. You may use our calculators for personal, non-commercial
          purposes. You may not copy, modify, distribute, or create derivative works without permission.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Third-Party Links</h2>
        <p>
          Our site contains links to third-party websites, including affiliate partners.
          We are not responsible for the content, accuracy, or practices of these external sites.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Limitation of Liability</h2>
        <p>
          FinCalcHub and its operators shall not be liable for any damages arising from the use
          or inability to use our services, including but not limited to financial losses resulting
          from decisions made based on our calculators.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of FinCalcHub
          after changes constitutes acceptance of the updated terms.
        </p>
      </div>
    </div>
  );
}
