// custom hook for API calls
import { useState, useCallback } from 'react';

export const useApi = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // REST API url environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const apiCall = useCallback(
        async (endpoint, options = {}) => {
            setLoading(true);
            setError(null);

            try {
                const url = `${API_URL}${endpoint}`;
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    ...options,
                };

                console.log(`Making API call to ${url}`);

                const response = await fetch(url, config);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message ||
                            `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                const data = await response.json();
                console.log(`API response status: ${response.status}`);
                return data;
            } catch (err) {
                console.error('API Error:', err);
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [API_URL]
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        apiCall,
        loading,
        error,
        clearError,
    };
};
