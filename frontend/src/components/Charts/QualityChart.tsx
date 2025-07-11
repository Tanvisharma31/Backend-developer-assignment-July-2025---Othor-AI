'use client';

import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataPoint {
  subject: string;
  quality: number;
  sustainability: number;
  fullMark: number;
}

export default function QualityChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - in a real app, this would come from your API
        const mockData: DataPoint[] = [
          { subject: 'Aerospace', quality: 4.5, sustainability: 3.8, fullMark: 5 },
          { subject: 'Defense', quality: 4.2, sustainability: 4.0, fullMark: 5 },
          { subject: 'Tech', quality: 4.8, sustainability: 4.5, fullMark: 5 },
          { subject: 'Energy', quality: 4.0, sustainability: 4.7, fullMark: 5 },
          { subject: 'Healthcare', quality: 4.3, sustainability: 4.2, fullMark: 5 },
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
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 5]} />
        <Tooltip 
          formatter={(value: number, name: string) => [value, name === 'quality' ? 'Quality Score' : 'Sustainability']}
        />
        <Radar
          name="Quality Score"
          dataKey="quality"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Sustainability"
          dataKey="sustainability"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
