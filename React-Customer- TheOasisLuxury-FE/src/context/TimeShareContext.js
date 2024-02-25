import React, { createContext, useState, useEffect, useCallback } from 'react';

export const TimeSharesContext = createContext();

export const TimeSharesProvider = ({ children }) => {
  const [timeShares, setTimeShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeShareDetails, setTimeShareDetails] = useState({});

  useEffect(() => {
    const fetchTimeShares = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token-based authentication
        const response = await fetch("http://localhost:5000/api/v1/timeshares/", {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data); // Logging the data for debug purposes
          setTimeShares(Array.isArray(data.result) ? data.result : []);
        } else {
          console.error("Failed to fetch timeshares with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching timeshares:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeShares();
  }, []);

  const fetchTimeShareDetails = useCallback(async (slug) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/timeshares/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setTimeShareDetails({[slug]: jsonResponse.result});
      } else {
        console.error('Failed to fetch timeshare details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching timeshare details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TimeSharesContext.Provider value={{ timeShares, timeShareDetails, fetchTimeShareDetails, loading }}>
      {children}
    </TimeSharesContext.Provider>
  );
};
