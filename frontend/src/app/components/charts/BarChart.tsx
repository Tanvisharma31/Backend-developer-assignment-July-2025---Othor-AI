import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: any[];
  xDataKey: string;
  barDataKeys: string[];
  colors?: string[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  barSize?: number;
  stacked?: boolean;
}

const defaultColors = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

export default function BarChart({
  data,
  xDataKey,
  barDataKeys,
  colors = defaultColors,
  title,
  xAxisLabel,
  yAxisLabel,
  height = 300,
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  barSize = 30,
  stacked = false,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsBarChart
            data={data}
            margin={margin}
            barSize={barSize}
            barGap={stacked ? 0 : 2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xDataKey} 
              label={{ 
                value: xAxisLabel, 
                position: 'insideBottom', 
                offset: -5,
                className: 'text-xs fill-gray-500'
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                className: 'text-xs fill-gray-500'
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
            {barDataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                name={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                stackId={stacked ? 'stack' : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
