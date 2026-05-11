import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FinCalcHub',
  description: 'FinCalcHub privacy policy - how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p><strong>Last Updated:</strong> May 2026</p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
        <p>
          FinCalcHub does not require user accounts or collect personal information through our calculators.
          All calculator inputs are processed locally in your browser and are not stored on our servers.
          We may collect anonymous usage data through analytics services (such as Google Analytics and Plausible)
          to understand how visitors use our site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Cookies</h2>
        <p>
          We use cookies for essential site functionality, analytics, and advertising. Third-party vendors,
          including Google, use cookies to serve ads based on your prior visits to our website. You can
          opt out of personalized advertising by visiting Google Ads Settings or through the cookie consent
          banner on our site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Advertising</h2>
        <p>
          We use Google AdSense and affiliate partnerships to support our free service. These third parties
          may use cookies and web beacons to collect information about your browsing activity for
          advertising purposes. For EU/EEA visitors, we obtain consent before setting non-essential cookies
          in compliance with GDPR and ePrivacy Directive.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Affiliate Links</h2>
        <p>
          Some links on FinCalcHub are affiliate links. If you click through and take action (such as opening
          an account or applying for a product), we may receive a commission. We clearly mark all affiliate
          content and only recommend products we believe provide value to our users.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information. We may share anonymized, aggregated
          data with analytics and advertising partners.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have rights regarding your personal data (GDPR in EU/EEA,
          CCPA in California). You can exercise these rights by contacting us at hello@fincalchub.com.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Contact</h2>
        <p>
          For privacy-related questions, contact us at hello@fincalchub.com.
        </p>
      </div>
    </div>
  );
}
