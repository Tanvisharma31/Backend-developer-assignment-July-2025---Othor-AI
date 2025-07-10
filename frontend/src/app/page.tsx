'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiShield,
  FiClock,
  FiBriefcase,
  FiAward,
  FiActivity,
  FiAlertTriangle,
  FiTrendingDown,
  FiUsers
} from 'react-icons/fi';
import DashboardLayout from './components/layout/DashboardLayout';
import MetricCard from './components/cards/MetricCard';
import LineChart from './components/charts/LineChart';
import BarChart from './components/charts/BarChart';
import PieChart from './components/charts/PieChart';
import { 
  fetchSummaryMetrics,
  fetchRevenueTrends,
  fetchRevenueByDivision,
  fetchRetentionRates,
  fetchHRMetrics,
  fetchSecurityIncidents,
  fetchSafetyScores,
  fetchSupplyChainMetrics,
  fetchDataNarrative,
  type SummaryMetrics,
  type RevenueTrendData,
  type RetentionData,
  type DataNarrative
} from './utils/api';

export default function Home() {
  // State for dashboard data
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrendData[]>([]);
  const [retentionRates, setRetentionRates] = useState<Array<{month: string} & Record<string, number>>>([]);
  const [securityIncidents, setSecurityIncidents] = useState<Array<{month: string} & Record<string, number>>>([]);
  const [safetyScores, setSafetyScores] = useState<Array<{month: string} & Record<string, number>>>([]);
  const [narrative, setNarrative] = useState<DataNarrative | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process revenue data for the line chart
  const processRevenueData = () => {
    if (!revenueTrends.length) return [];
    
    return revenueTrends.map(item => {
      const { quarter, ...divisions } = item;
      return {
        name: quarter,
        ...Object.fromEntries(
          Object.entries(divisions).map(([key, value]) => [key, Number(value)])
        )
      };
    });
  };

  // Process retention data for the area chart
  const processRetentionData = () => {
    if (!retentionRates.length) return [];
    
    return retentionRates.map(item => {
      const { month, ...divisions } = item;
      return {
        name: month,
        ...Object.fromEntries(
          Object.entries(divisions).map(([key, value]) => [key, Number(value)])
        )
      };
    });
  };

  // Process security incidents for the bar chart
  const processSecurityData = () => {
    if (!securityIncidents.length) return [];
    
    return securityIncidents.map(item => {
      const { month, ...incidents } = item;
      const total = Object.values(incidents)
        .filter((v): v is number => typeof v === 'number')
        .reduce((a, b) => a + b, 0);
      
      return {
        name: month,
        incidents: total
      };
    });
  };

  // Calculate metrics from the data
  const totalRevenue = summary ? parseFloat(summary.total_revenue.replace(/[^0-9.-]+/g, '')) : 0;
  const avgRetention = summary ? parseFloat(summary.avg_retention) : 0;
  const safetyScore = summary ? parseFloat(summary.public_safety_score) : 0;
  const topDivision = summary?.top_division || 'N/A';
  
  const totalIncidents = securityIncidents.reduce((sum, item) => {
    return sum + Object.values(item)
      .filter((v): v is number => typeof v === 'number')
      .reduce((a, b) => a + b, 0);
  }, 0);
  
  // Get the most recent safety score
  const latestSafetyScore = safetyScores.length > 0 
    ? safetyScores[safetyScores.length - 1] 
    : null;
    
  const avgSafetyScore = latestSafetyScore 
    ? Object.values(latestSafetyScore)
        .filter((v): v is number => typeof v === 'number')
        .reduce((a, b) => a + b, 0) / 
      Object.keys(latestSafetyScore).filter(k => k !== 'month').length
    : 0;

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          summaryData,
          revenueData,
          retentionData,
          securityIncidentData,
          safetyScoreData,
          narrativeData
        ] = await Promise.all([
          fetchSummaryMetrics(),
          fetchRevenueTrends(),
          fetchRetentionRates(),
          fetchSecurityIncidents(),
          fetchSafetyScores(),
          fetchDataNarrative()
        ]);
        
        // Update state with fetched data
        setSummary(summaryData);
        setRevenueTrends(revenueData);
        setRetentionRates(retentionData);
        setSecurityIncidents(securityIncidentData);
        setSafetyScores(safetyScoreData);
        setNarrative(narrativeData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Key performance indicators and business insights for Wayne Enterprises
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
          change={12.5}
          icon={<FiDollarSign className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Avg. Retention Rate"
          value={`${avgRetention}%`}
          change={5.2}
          icon={<FiUsers className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Security Incidents"
          value={totalIncidents.toString()}
          change={-8.3}
          icon={<FiShield className="h-6 w-6" />}
          color="red"
        />
        <MetricCard
          title="Avg. Safety Score"
          value={`${avgSafetyScore.toFixed(1)}/10`}
          change={2.4}
          icon={<FiActivity className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Revenue Trends */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trends</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <LineChart
            data={processRevenueData()}
            xDataKey="name"
            lineDataKeys={revenueTrends.length > 0 
              ? Object.keys(revenueTrends[0] || {}).filter(k => k !== 'quarter')
              : []}
            title="Quarterly Revenue by Division"
            yAxisLabel="Revenue ($M)"
            height={400}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Incidents */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Security Incidents</h3>
          <div className="h-80">
            <BarChart
              data={processSecurityData()}
              xDataKey="name"
              barDataKeys={['incidents']}
              yAxisLabel="Incidents"
              height={350}
              barSize={30}
            />
          </div>
        </div>

        {/* Retention Rates */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Retention Rates</h3>
          <div className="h-80">
            <LineChart
              data={processRetentionData()}
              xDataKey="name"
              lineDataKeys={retentionRates.length > 0 
                ? Object.keys(retentionRates[0] || {}).filter(k => k !== 'month')
                : []}
              yAxisLabel="Retention Rate (%)"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Data Narrative */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {narrative?.headline || 'Executive Dashboard Insights'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {narrative?.timestamp ? `Last updated: ${new Date(narrative.timestamp).toLocaleString()}` : 'Loading insights...'}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Financial Performance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {narrative?.insight || 'Loading financial insights...'}
                {narrative?.metrics && (
                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>Total Revenue: {narrative.metrics.total_revenue}</div>
                    <div>Revenue Growth: {narrative.metrics.revenue_growth}</div>
                  </div>
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Security & Safety</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {narrative?.metrics && (
                  <div className="space-y-2">
                    <p>
                      {totalIncidents} security incidents were reported this period, with an average safety score of {narrative.metrics.avg_safety_score}.
                      Our security initiatives are showing positive results across all districts.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>Total Incidents: {narrative.metrics.total_incidents}</div>
                      <div>Avg Safety Score: {narrative.metrics.avg_safety_score}</div>
                    </div>
                  </div>
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Employee & Operations</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {narrative?.metrics && (
                  <div className="space-y-2">
                    <p>
                      Employee retention remains strong at {narrative.metrics.avg_retention}, with high satisfaction scores across all divisions.
                      Supply chain operations show {narrative.metrics.avg_quality_score} quality score with {narrative.metrics.total_disruptions} disruptions.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>Avg Retention: {narrative.metrics.avg_retention}</div>
                      <div>Avg Satisfaction: {narrative.metrics.avg_satisfaction}</div>
                      <div>Supply Chain Quality: {narrative.metrics.avg_quality_score}</div>
                      <div>Total Disruptions: {narrative.metrics.total_disruptions}</div>
                    </div>
                  </div>
                )}              </dd>
            </div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
