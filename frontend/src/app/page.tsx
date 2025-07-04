'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiShield, 
  FiPieChart, 
  FiBarChart2,
  FiClock,
  FiBriefcase,
  FiAward,
  FiActivity
} from 'react-icons/fi';
import DashboardLayout from './components/layout/DashboardLayout';
import MetricCard from './components/cards/MetricCard';
import LineChart from './components/charts/LineChart';
import BarChart from './components/charts/BarChart';
import PieChart from './components/charts/PieChart';
import { 
  fetchFinancialData, 
  fetchSecurityMetrics, 
  fetchRDProjects, 
  fetchSupplyChainMetrics, 
  fetchHRAnalytics 
} from './utils/api';

interface FinancialData {
  division: string;
  quarter: string;
  year: number;
  revenue: number;
  profit: number;
  rnd_investment: number;
  market_share: number;
  customer_satisfaction: number;
}

interface SecurityMetrics {
  year_month: string;
  District: string;
  Incidents_Reported: number;
  Response_Time_Minutes: number;
  Wayne_Tech_Deployed: number;
  Public_Safety_Score: number;
}

export default function Home() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [securityData, setSecurityData] = useState<SecurityMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate metrics for the dashboard
  const totalRevenue = financialData.reduce((sum, item) => sum + item.revenue, 0);
  const avgCustomerSatisfaction = financialData.length > 0 
    ? (financialData.reduce((sum, item) => sum + item.customer_satisfaction, 0) / financialData.length).toFixed(1)
    : 0;
  
  const totalIncidents = securityData.reduce((sum, item) => sum + item.Incidents_Reported, 0);
  const avgResponseTime = securityData.length > 0
    ? (securityData.reduce((sum, item) => sum + item.Response_Time_Minutes, 0) / securityData.length).toFixed(1)
    : 0;

  // Process data for charts
  const processFinancialData = () => {
    const quarterlyData: Record<string, any> = {};
    
    financialData.forEach(item => {
      const quarter = `${item.quarter} ${item.year}`;
      if (!quarterlyData[quarter]) {
        quarterlyData[quarter] = { quarter };
      }
      quarterlyData[quarter][item.division] = item.revenue;
    });
    
    return Object.values(quarterlyData);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [financial, security] = await Promise.all([
          fetchFinancialData(),
          fetchSecurityMetrics(),
        ]);
        setFinancialData(financial);
        setSecurityData(security);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          value={`$${(totalRevenue / 1000).toFixed(1)}B`}
          change={12.5}
          icon={<FiDollarSign className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={`${avgCustomerSatisfaction}/10`}
          change={5.2}
          icon={<FiAward className="h-6 w-6" />}
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
          title="Avg. Response Time"
          value={`${avgResponseTime}m`}
          change={-15.7}
          icon={<FiClock className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <LineChart
              data={processFinancialData()}
              xDataKey="quarter"
              lineDataKeys={['Wayne Aerospace', 'Wayne Construction', 'Wayne Tech', 'Wayne Biotech', 'Wayne Foundation']}
              title="Quarterly Revenue by Division (Millions)"
              yAxisLabel="Revenue ($M)"
              height={400}
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <BarChart
              data={securityData.slice(0, 6)}
              xDataKey="District"
              barDataKeys={['Incidents_Reported', 'Wayne_Tech_Deployed']}
              title="Security Incidents vs Wayne Tech Deployments"
              yAxisLabel="Count"
              height={400}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status Distribution</h3>
          <div className="h-80">
            <PieChart
              data={[
                { name: 'On Track', value: 45 },
                { name: 'Delayed', value: 25 },
                { name: 'At Risk', value: 15 },
                { name: 'Completed', value: 15 },
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
              legend={true}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Satisfaction</h3>
          <div className="h-80">
            <BarChart
              data={[
                { department: 'Aerospace', score: 8.7 },
                { department: 'Construction', score: 7.9 },
                { department: 'Tech', score: 9.1 },
                { department: 'Biotech', score: 8.5 },
                { department: 'Foundation', score: 9.3 },
              ]}
              xDataKey="department"
              barDataKeys={['score']}
              yAxisLabel="Score (out of 10)"
              height={300}
              barSize={40}
            />
          </div>
        </div>
      </div>

      {/* Data Narrative */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Executive Summary: Wayne Enterprises Q2 2024 Performance
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Key insights and strategic recommendations
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Financial Performance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Wayne Enterprises has shown strong financial performance in Q2 2024, with total revenue reaching ${(totalRevenue / 1000).toFixed(1)}B, 
                a 12.5% increase from the previous quarter. The Aerospace and Construction divisions continue to drive growth, 
                while the Foundation's social impact initiatives are progressing as planned.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Security Operations</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Security incidents have decreased by 8.3% compared to last quarter, with an average response time of {avgResponseTime} minutes. 
                The deployment of Wayne Tech solutions in high-risk areas like The Narrows has shown promising results, 
                contributing to improved public safety scores across all districts.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Employee Engagement</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Employee satisfaction remains high at an average of {avgCustomerSatisfaction}/10, with the Foundation and Tech divisions 
                leading the way. Our focus on professional development and work-life balance initiatives continues to pay off, 
                with retention rates at an all-time high of 94%.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
