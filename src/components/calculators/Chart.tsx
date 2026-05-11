'use client';

import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { useTheme } from 'next-themes';

interface ChartProps {
  data: Record<string, unknown>[];
  type?: 'line' | 'area' | 'bar';
  xKey: string;
  lines?: { key: string; color: string; name: string }[];
}

export default function Chart({ data, type = 'line', xKey, lines }: ChartProps) {
  const t = useTranslations('layout');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!lines || lines.length === 0 || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-gray-400">{t('chart_title')}</div>;
  }

  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#E5E7EB';

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xKey} stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
              }}
            />
            <Legend />
            {lines.map((line) => (
              <Area
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                fill={line.color}
                fillOpacity={0.1}
                name={line.name}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xKey} stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
              }}
            />
            <Legend />
            {lines.map((line) => (
              <Bar key={line.key} dataKey={line.key} fill={line.color} name={line.name} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xKey} stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
              }}
            />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                name={line.name}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('chart_title')}</h3>
      <ResponsiveContainer width="100%" height={320}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
