import { useState, useCallback } from 'react';
import { API_BASE, getAuthHeaders } from '@/lib/api';

interface RiskFactors {
  workloadManagement: number;
  strengthAsymmetry: number;
  neuromuscularControl: number;
  mentalRecovery: number;
  anatomicalFixedRisk: number;
}

interface RiskFactorEntry {
  _id: string;
  workloadManagement: number;
  strengthAsymmetry: number;
  neuromuscularControl: number;
  mentalRecovery: number;
  anatomicalFixedRisk: number;
  reportType: 'daily' | 'weekly' | 'monthly';
  submittedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  submittedAt: string;
  notes?: string;
}

interface RiskFactorData {
  athleteId: string;
  currentRiskFactors: RiskFactors;
  lastUpdated: string;
  historyCount: number;
  recentHistory: RiskFactorEntry[];
}

interface SubmitRiskFactorData {
  athleteId?: string;
  athleteEmail?: string;
  reportType: string;
  riskFactors: Partial<RiskFactors>;
  notes?: string;
}

interface UseRiskFactorsReturn {
  loading: boolean;
  error: string | null;
  submitRiskFactors: (data: SubmitRiskFactorData) => Promise<void>;
  getRiskFactors: (athleteId: string) => Promise<RiskFactorData | null>;
  getRiskFactorsByEmail: (athleteEmail: string) => Promise<RiskFactorData | null>;
  getRiskFactorHistory: (
    athleteId: string,
    filters?: {
      reportType?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      page?: number;
    }
  ) => Promise<any>;
  getRiskFactorSummary: (athleteId: string, days?: number) => Promise<any>;
  clearError: () => void;
}

export const useRiskFactors = (): UseRiskFactorsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiCall = async <T>(
    apiCall: () => Promise<Response>,
    successMessage?: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (successMessage) {
        console.log(successMessage);
      }

      return data.data || data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API call failed:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitRiskFactors = useCallback(async (data: SubmitRiskFactorData) => {
    await handleApiCall(
      () => fetch(`${API_BASE}/risk-factors/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
      'Risk factors submitted successfully'
    );
  }, []);

  const getRiskFactors = useCallback(async (athleteId: string): Promise<RiskFactorData | null> => {
    return await handleApiCall<RiskFactorData>(
      () => fetch(`${API_BASE}/risk-factors/athlete/${athleteId}`, { headers: getAuthHeaders() })
    );
  }, []);

  const getRiskFactorsByEmail = useCallback(async (athleteEmail: string): Promise<RiskFactorData | null> => {
    return await handleApiCall<RiskFactorData>(
      () => fetch(`${API_BASE}/risk-factors/athlete/email/${athleteEmail}`, { headers: getAuthHeaders() })
    );
  }, []);

  const getRiskFactorHistory = useCallback(async (
    athleteId: string,
    filters: {
      reportType?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      page?: number;
    } = {}
  ) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_BASE}/risk-factors/history/${athleteId}${queryString ? `?${queryString}` : ''}`;

    return await handleApiCall(
      () => fetch(url, { headers: getAuthHeaders() })
    );
  }, []);

  const getRiskFactorSummary = useCallback(async (athleteId: string, days: number = 30) => {
    return await handleApiCall(
      () => fetch(`${API_BASE}/risk-factors/summary/${athleteId}?days=${days}`, { headers: getAuthHeaders() })
    );
  }, []);

  return {
    loading,
    error,
    submitRiskFactors,
    getRiskFactors,
    getRiskFactorsByEmail,
    getRiskFactorHistory,
    getRiskFactorSummary,
    clearError,
  };
};

export default useRiskFactors;

