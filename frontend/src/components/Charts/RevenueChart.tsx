'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueDataPoint {
  quarter: string;
  revenue: number;
  rnd_investment: number;
}

interface ApiDataPoint {
  division: string;
  quarter: string;
  revenue: number;
  'r&d_investment': number;
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/charts/1');
        if (!response.ok) throw new Error('Failed to fetch data');
        const rawData: ApiDataPoint[] = await response.json();
        
        // Transform data for the chart
        const transformedData = rawData
          .filter((item: ApiDataPoint) => item.division === 'Aerospace')
          .map((item: ApiDataPoint) => ({
            quarter: `Q${item.quarter}`,
            revenue: item.revenue / 1e6,
            rnd_investment: item['r&d_investment'] / 1e6
          }))
          .sort((a: RevenueDataPoint, b: RevenueDataPoint) => a.quarter.localeCompare(b.quarter));

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="quarter" />
        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
        <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
        <Tooltip 
          formatter={(value: number, name: string) => [`$${value.toFixed(1)}M`, name === 'revenue' ? 'Revenue' : 'R&D Investment']}
          labelFormatter={(label) => `Quarter ${label}`}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          name="Revenue (Millions)"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="rnd_investment"
          name="R&D Investment (Millions)"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}