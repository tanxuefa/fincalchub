import { getAffiliateLinks } from '@/data/affiliates';

interface AffiliateLinksProps {
  calculatorSlug: string;
}

export default function AffiliateLinks({ calculatorSlug }: AffiliateLinksProps) {
  const links = getAffiliateLinks(calculatorSlug);

  if (links.length === 0) return null;

  return (
    <div className="space-y-3">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-medium text-blue-600 dark:text-blue-400">{link.text}</span>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
            </div>
            <svg className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <p className="mt-2 text-xs text-gray-400">{link.disclosure}</p>
        </a>
      ))}
    </div>
  );
}
