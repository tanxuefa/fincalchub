interface ResultCardProps {
  label: string;
  value: string | number | boolean;
  highlight?: boolean;
  prefix?: string;
}

export default function ResultCard({ label, value, highlight = false, prefix }: ResultCardProps) {
  const displayValue = typeof value === 'boolean'
    ? (value ? 'Yes' : 'No')
    : typeof value === 'number'
      ? String(value)
      : value;

  return (
    <div
      className={`rounded-lg p-4 ${
        highlight
          ? 'bg-blue-50 border-2 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
          : 'bg-gray-50 border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700'
      }`}
    >
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className={`mt-1 text-2xl font-bold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
        {prefix}{displayValue}
      </dd>
    </div>
  );
}

interface ResultGridProps {
  children: React.ReactNode;
}

export function ResultGrid({ children }: ResultGridProps) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </dl>
  );
}
