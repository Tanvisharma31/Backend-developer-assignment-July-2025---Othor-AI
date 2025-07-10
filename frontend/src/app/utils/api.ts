const API_BASE_URL = 'http://localhost:8000/api/v1';

// Types for Summary API
export interface SummaryMetrics {
  total_revenue: string;
  avg_retention: string;
  public_safety_score: string;
  top_division: string;
  message: string;
}

// Types for Revenue API
export interface RevenueTrendData {
  quarter: string;
  [key: string]: any; // For dynamic division names
}

export interface RevenueByDivision {
  data: Record<string, number>;
  message: string;
}

// Types for HR API
export interface RetentionData {
  month: string;
  [key: string]: any; // For dynamic division names
}

export interface HRMetrics {
  avg_training_hours: number;
  avg_performance_rating: number;
  avg_satisfaction_score: number;
  message: string;
}

// Types for Security API
export type SecurityIncident = {
  month: string;
} & Record<string, number>;

export type SafetyScore = {
  month: string;
} & Record<string, number>;

// Types for Supply Chain API
export interface SupplyChainMetric {
  facility: string;
  product_line: string;
  production_volume: number;
  avg_cost_per_unit: number;
  avg_quality_score: number;
  avg_sustainability_rating: number;
  total_disruption_hours: number;
}

export type SupplyChainDisruption = {
  month: string;
} & Record<string, number>;

// Types for Narrative API
export interface DataNarrative {
  headline: string;
  insight: string;
  metrics: {
    total_revenue: string;
    revenue_growth: string;
    avg_retention: string;
    avg_satisfaction: string;
    total_incidents: number;
    avg_safety_score: string;
    total_disruptions: string;
    avg_quality_score: string;
  };
  timestamp: string;
}

// Summary Endpoints
export const fetchSummaryMetrics = async (): Promise<SummaryMetrics> => {
  const response = await fetch(`${API_BASE_URL}/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch summary metrics');
  }
  return await response.json();
};

// Revenue Endpoints
export const fetchRevenueTrends = async (): Promise<RevenueTrendData[]> => {
  const response = await fetch(`${API_BASE_URL}/revenue/trends`);
  if (!response.ok) {
    throw new Error('Failed to fetch revenue trends');
  }
  const data = await response.json();
  return data.data || [];
};

export const fetchRevenueByDivision = async (): Promise<RevenueByDivision> => {
  const response = await fetch(`${API_BASE_URL}/revenue/by-division`);
  if (!response.ok) {
    throw new Error('Failed to fetch revenue by division');
  }
  return await response.json();
};

// HR Endpoints
export const fetchRetentionRates = async (): Promise<RetentionData[]> => {
  const response = await fetch(`${API_BASE_URL}/hr/retention`);
  if (!response.ok) {
    throw new Error('Failed to fetch retention rates');
  }
  const data = await response.json();
  return data.data || [];
};

export const fetchHRMetrics = async (): Promise<HRMetrics> => {
  const response = await fetch(`${API_BASE_URL}/hr/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch HR metrics');
  }
  return await response.json();
};

// Security Endpoints
export const fetchSecurityIncidents = async (): Promise<SecurityIncident[]> => {
  const response = await fetch(`${API_BASE_URL}/security/incidents`);
  if (!response.ok) {
    throw new Error('Failed to fetch security incidents');
  }
  const data = await response.json();
  return data.data || [];
};

export const fetchSafetyScores = async (): Promise<SafetyScore[]> => {
  const response = await fetch(`${API_BASE_URL}/security/safety-scores`);
  if (!response.ok) {
    throw new Error('Failed to fetch safety scores');
  }
  const data = await response.json();
  return data.data || [];
};

// Supply Chain Endpoints
export const fetchSupplyChainMetrics = async (): Promise<SupplyChainMetric[]> => {
  const response = await fetch(`${API_BASE_URL}/supply-chain/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch supply chain metrics');
  }
  const data = await response.json();
  return data.data || [];
};

export const fetchSupplyChainDisruptions = async (): Promise<SupplyChainDisruption[]> => {
  const response = await fetch(`${API_BASE_URL}/supply-chain/disruptions`);
  if (!response.ok) {
    throw new Error('Failed to fetch supply chain disruptions');
  }
  const data = await response.json();
  return data.data || [];
};

// Narrative Endpoint
export const fetchDataNarrative = async (): Promise<DataNarrative> => {
  const response = await fetch(`${API_BASE_URL}/narrative/insight`);
  if (!response.ok) {
    throw new Error('Failed to fetch data narrative');
  }
  return await response.json();
};
