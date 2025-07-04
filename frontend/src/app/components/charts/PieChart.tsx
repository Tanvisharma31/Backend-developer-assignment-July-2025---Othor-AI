import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  title?: string;
  height?: number;
  innerRadius?: number | string;
  outerRadius?: number | string;
  label?: boolean;
  labelLine?: boolean;
  legend?: boolean;
}

const defaultColors = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#84cc16', // lime-500
  '#14b8a6', // teal-500
];

export default function PieChart({
  data,
  dataKey,
  nameKey,
  colors = defaultColors,
  title,
  height = 300,
  innerRadius = '60%',
  outerRadius = '80%',
  label = false,
  labelLine = false,
  legend = true,
}: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + Number(innerRadius) + (Number(outerRadius) - Number(innerRadius));
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#4B5563"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
              label={label ? renderCustomizedLabel : undefined}
              labelLine={labelLine}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            {legend && (
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: '12px' }}
              />
            )}
            <Tooltip 
              formatter={(value: any, name: any, props: any) => [
                value,
                props.payload[nameKey]
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                fontSize: '12px',
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
