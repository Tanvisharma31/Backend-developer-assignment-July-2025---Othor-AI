'use client';

import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint {
  project_id: string;
  budget: number;
  potential: number;
  division: string;
  roi: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function RdChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - in a real app, this would come from your API
        const divisions = ['Aerospace', 'Defense', 'Tech', 'Energy', 'Healthcare'];
        const mockData: DataPoint[] = [];
        
        divisions.forEach((division, divIndex) => {
          for (let i = 0; i < 5; i++) {
            const budget = Math.floor(Math.random() * 10) + 1;
            const potential = Math.random() * 3 + 1;
            mockData.push({
              project_id: `PRJ-${division.substring(0, 3).toUpperCase()}-${100 + i}`,
              budget: budget * 1000000, // in millions
              potential: parseFloat(potential.toFixed(1)),
              division,
              roi: parseFloat((Math.random() * 2 + 0.5).toFixed(2))
            });
          }
        });
        
        setData(mockData);
        setDivisions(['All', ...divisions]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = selectedDivision === 'All' 
    ? data 
    : data.filter(item => item.division === selectedDivision);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <label htmlFor="division-select" className="text-sm font-medium text-gray-700 mr-2">
          Filter by Division:
        </label>
        <select
          id="division-select"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          {divisions.map(division => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="budget" 
              name="Budget" 
              unit="M"
              domain={[0, 12000000]}
              tickFormatter={(value) => `$${value / 1000000}M`}
            />
            <YAxis 
              type="number" 
              dataKey="potential" 
              name="Potential" 
              domain={[0, 5]}
            />
            <ZAxis type="number" dataKey="roi" range={[100, 1000]} name="ROI" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: string) => {
                if (name === 'Budget') return [`$${value / 1000000}M`, name];
                if (name === 'ROI') return [`${(value * 100).toFixed(0)}%`, name];
                return [value, name];
              }}
              labelFormatter={(label) => `Project: ${label}`}
            />
            <Legend />
            <Scatter name="Projects" data={filteredData}>
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[divisions.indexOf(entry.division) % COLORS.length]} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
