import React, { createContext, useState, useEffect, useCallback } from 'react';

export const VillaContext = createContext();

export const VillaProvider = ({ children }) => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [villaDetails, setVillaDetails] = useState({});

  useEffect(() => {
    const fetchVillas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token-based authentication
        const response = await fetch("http://localhost:5000/api/v1/villas/", {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data); // Logging the data for debug purposes
          setVillas(Array.isArray(data.result) ? data.result : []);
        } else {
          console.error("Failed to fetch villas with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching villas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
  }, []);

  const fetchVillaDetails = useCallback(async (slug) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/villas/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setVillaDetails(prevState => ({...prevState, [slug]: jsonResponse.result}));
      } else {
        console.error('Failed to fetch villa details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching villa details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <VillaContext.Provider value={{ villas, villaDetails, fetchVillaDetails, loading }}>
      {children}
    </VillaContext.Provider>
  );
};
