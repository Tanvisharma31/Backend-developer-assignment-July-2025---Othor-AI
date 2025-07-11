'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues
const RevenueChart = dynamic(() => import('@/components/Charts/RevenueChart'), { ssr: false });
const EmployeeChart = dynamic(() => import('@/components/Charts/EmployeeChart'), { ssr: false });
const SecurityChart = dynamic(() => import('@/components/Charts/SecurityChart'), { ssr: false });
const QualityChart = dynamic(() => import('@/components/Charts/QualityChart'), { ssr: false });
const RdChart = dynamic(() => import('@/components/Charts/RdChart'), { ssr: false });

interface SummaryData {
  total_revenue: number;
  avg_retention: number;
  avg_satisfaction: number;
  avg_quality_score: number;
  total_incidents: number;
}

interface NarrativeData {
  headline: string;
  subtitle: string;
  insights: string[];
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [narrative, setNarrative] = useState<NarrativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would use environment variables for the API URL
        const [summaryRes, narrativeRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/summary`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/narrative`)
        ]);

        if (!summaryRes.ok || !narrativeRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [summaryData, narrativeData] = await Promise.all([
          summaryRes.json(),
          narrativeRes.json()
        ]);

        setSummary(summaryData);
        setNarrative(narrativeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wayne Enterprises</h1>
        <p className="text-gray-600">Business Intelligence Dashboard</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Revenue"
          value={summary?.total_revenue ? `$${(summary.total_revenue / 1e6).toFixed(1)}M` : 'N/A'}
          change={12.5}
          icon={<ChartBarIcon className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Retention Rate"
          value={summary?.avg_retention ? `${summary.avg_retention}%` : 'N/A'}
          change={3.2}
          icon={<UserGroupIcon className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Satisfaction"
          value={summary?.avg_satisfaction ? `${summary.avg_satisfaction}/5` : 'N/A'}
          change={-1.8}
          icon={<ShieldCheckIcon className="h-6 w-6 text-yellow-500" />}
        />
        <SummaryCard
          title="Security Incidents"
          value={summary?.total_incidents?.toString() || 'N/A'}
          change={-15.3}
          isNegative
          icon={<ShieldCheckIcon className="h-6 w-6 text-red-500" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue vs R&D Investment</h2>
          <div className="h-80">
            <RevenueChart />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Employee Performance</h2>
          <div className="h-80">
            <EmployeeChart />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Security Incidents</h2>
          <div className="h-80">
            <SecurityChart />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Product Quality</h2>
          <div className="h-80">
            <QualityChart />
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      {narrative && (
        <div className="bg-blue-50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">{narrative.headline}</h2>
          <p className="text-blue-700 mb-4">{narrative.subtitle}</p>
          <ul className="space-y-2">
            {narrative.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* R&D Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">R&D Budget vs Commercial Potential</h2>
        <div className="h-96">
          <RdChart />
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  isNegative?: boolean;
}

function SummaryCard({ title, value, change, icon, isNegative = false }: SummaryCardProps) {
  const isPositive = change >= 0;
  const changeColor = isNegative 
    ? (isPositive ? 'text-red-500' : 'text-green-500')
    : (isPositive ? 'text-green-500' : 'text-red-500');

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center mt-2 ${changeColor}`}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} from last quarter
            </span>
          </div>
        </div>
        <div className="p-3 rounded-full bg-blue-50">
          {icon}
        </div>
      </div>
    </div>
  );
}