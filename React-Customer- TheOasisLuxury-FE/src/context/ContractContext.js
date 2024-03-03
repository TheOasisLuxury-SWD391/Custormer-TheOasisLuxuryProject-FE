import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contractDetails, setContractDetails] = useState({});

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/api/v1/users/create-contracts", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data);
          setContracts(Array.isArray(data.result) ? data.result : []);
        } else {
          console.error("Failed to fetch contracts with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const fetchContractDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/users/create-contracts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setContractDetails({[id]: jsonResponse.result});
      } else {
        console.error('Failed to fetch contract details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContract = async (contractData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/users/create-contracts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error creating contract:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (id, contractData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/users/create-contracts/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating contract:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContractContext.Provider value={{ contracts, contractDetails, fetchContractDetails, createContract, updateContract, loading }}>
      {children}
    </ContractContext.Provider>
  );
};
