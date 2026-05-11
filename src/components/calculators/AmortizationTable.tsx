'use client';

import { useState } from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

interface AmortizationTableProps {
  data: AmortizationRow[];
  locale?: string;
  currency?: string;
}

export default function AmortizationTable({
  data,
  locale = 'en-US',
  currency = 'USD',
}: AmortizationTableProps) {
  const [showAll, setShowAll] = useState(false);

  // Show yearly summary by default, full schedule on toggle
  const yearlyData = data.filter(
    (row) => row.month % 12 === 0 || row.month === data.length
  );
  const displayData = showAll ? data : yearlyData;

  if (data.length === 0) return null;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Month</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Payment</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Principal</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Interest</th>
              {data[0]?.extraPayment !== undefined && (
                <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Extra</th>
              )}
              <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayData.map((row) => (
              <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {showAll ? row.month : `Year ${row.month / 12}`}
                </td>
                <td className="px-3 py-2 text-right text-gray-900 dark:text-white">
                  {formatCurrency(row.payment, locale, currency)}
                </td>
                <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">
                  {formatCurrency(row.principal, locale, currency)}
                </td>
                <td className="px-3 py-2 text-right text-red-600 dark:text-red-400">
                  {formatCurrency(row.interest, locale, currency)}
                </td>
                {row.extraPayment !== undefined && (
                  <td className="px-3 py-2 text-right text-blue-600 dark:text-blue-400">
                    {row.extraPayment > 0 ? formatCurrency(row.extraPayment, locale, currency) : '-'}
                  </td>
                )}
                <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(row.balance, locale, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          {showAll ? 'Show Yearly Summary' : `Show All ${data.length} Months`}
        </button>
      )}
    </div>
  );
}
