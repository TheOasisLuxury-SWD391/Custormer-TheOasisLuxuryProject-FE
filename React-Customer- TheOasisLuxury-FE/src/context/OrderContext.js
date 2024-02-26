import React, { createContext, useState, useEffect, useCallback } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token-based authentication
        const response = await fetch("http://localhost:5000/api/v1/orders/", {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data); // Logging the data for debug purposes
          setOrders(Array.isArray(data.result) ? data.result : []);
        } else {
          console.error("Failed to fetch orders with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setOrderDetails({[id]: jsonResponse.result});
      } else {
        console.error('Failed to fetch order details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, orderDetails, fetchOrderDetails, loading }}>
      {children}
    </OrderContext.Provider>
  );
};
