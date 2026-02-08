import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAPI = async (apiCall: Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall;
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        errors: err.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, executeAPI };
};
