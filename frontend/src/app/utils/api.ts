const API_BASE_URL = 'http://localhost:8000';

export interface FinancialData {
  division: string;
  quarter: string;
  year: number;
  revenue: number;
  profit: number;
  rnd_investment: number;
  market_share: number;
  customer_satisfaction: number;
}

export interface SecurityMetrics {
  year_month: string;
  District: string;
  Incidents_Reported: number;
  Response_Time_Minutes: number;
  Wayne_Tech_Deployed: number;
  Public_Safety_Score: number;
}

export interface RDProject {
  Project_ID: string;
  Project_Name: string;
  Division: string;
  Start_Date: string;
  Budget_Allocation: number;
  Total_Spent: number;
  Commercialization_Potential: string;
  Timeline_Adherence: number;
  Security_Classification: string;
  status: string;
}

export interface SupplyChainMetrics {
  Facility: string;
  Product_Line: string;
  Production_Volume: number;
  Cost_Per_Unit: number;
  Quality_Score: number;
  Sustainability_Rating: number;
  Disruption_Hours: number;
}

export interface HRAnalytics {
  Division: string;
  Hierarchy_Level: string;
  Retention_Rate: number;
  Training_Hours: number;
  Performance_Rating: number;
  Diversity_Index: number;
  Satisfaction_Score: number;
}

export const fetchFinancialData = async (): Promise<FinancialData[]> => {
  const response = await fetch(`${API_BASE_URL}/api/financial/quarterly`);
  if (!response.ok) {
    throw new Error('Failed to fetch financial data');
  }
  const data = await response.json();
  return data.data;
};

export const fetchSecurityMetrics = async (): Promise<SecurityMetrics[]> => {
  const response = await fetch(`${API_BASE_URL}/api/security/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch security metrics');
  }
  const data = await response.json();
  return data.data;
};

export const fetchRDProjects = async (): Promise<RDProject[]> => {
  const response = await fetch(`${API_BASE_URL}/api/rd/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch R&D projects');
  }
  const data = await response.json();
  return data.data;
};

export const fetchSupplyChainMetrics = async (): Promise<SupplyChainMetrics[]> => {
  const response = await fetch(`${API_BASE_URL}/api/supply-chain/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch supply chain metrics');
  }
  const data = await response.json();
  return data.data;
};

export const fetchHRAnalytics = async (): Promise<HRAnalytics[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hr/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch HR analytics');
  }
  const data = await response.json();
  return data.data;
};
