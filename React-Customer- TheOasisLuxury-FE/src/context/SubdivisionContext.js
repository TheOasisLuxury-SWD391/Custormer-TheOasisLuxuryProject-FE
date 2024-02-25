import React, { createContext, useState, useEffect, useCallback } from 'react';

export const SubdivisionContext = createContext();

export const SubdivisionProvider = ({ children }) => {
  const [subdivisions, setSubdivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subdivisionDetails, setSubdivisionDetails] = useState({});

  useEffect(() => {
    const fetchSubdivisions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token-based authentication
        const response = await fetch("http://localhost:5000/api/v1/subdivisions/", {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data); // Logging the data for debug purposes
          setSubdivisions(Array.isArray(data.result) ? data.result : []);
        } else {
          console.error("Failed to fetch subdivisions with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching subdivisions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubdivisions();
  }, []);

  const fetchSubdivisionDetails = useCallback(async (slug) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/subdivisions/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setSubdivisionDetails({[slug]: jsonResponse.result});
      } else {
        console.error('Failed to fetch subdivision details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching subdivision details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SubdivisionContext.Provider value={{ subdivisions, subdivisionDetails, fetchSubdivisionDetails, loading }}>
      {children}
    </SubdivisionContext.Provider>
  );
};
