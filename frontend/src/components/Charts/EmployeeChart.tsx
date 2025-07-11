'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  division: string;
  performance: number;
  diversity: number;
}

export default function EmployeeChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - in a real app, this would come from your API
        const mockData: DataPoint[] = [
          { division: 'Aerospace', performance: 4.2, diversity: 3.8 },
          { division: 'Defense', performance: 3.9, diversity: 3.5 },
          { division: 'Tech', performance: 4.5, diversity: 4.2 },
          { division: 'Energy', performance: 3.7, diversity: 3.9 },
          { division: 'Healthcare', performance: 4.1, diversity: 4.0 },
        ];
        
        setData(mockData);
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
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="division" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <Tooltip 
          formatter={(value: number, name: string) => [value, name === 'performance' ? 'Performance (1-5)' : 'Diversity Index (1-5)']}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="performance" name="Performance" fill="#8884d8" />
        <Bar yAxisId="left" dataKey="diversity" name="Diversity Index" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
