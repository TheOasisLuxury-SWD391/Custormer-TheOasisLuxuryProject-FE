import React, { createContext, useState, useEffect, useCallback } from 'react';

export const OrderContext = createContext({
  orderDetails: {}, // Default empty object or suitable default value
  fetchOrderDetails: () => {}, // Default no-op function
  // ... other defaults
});

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  const fetchOrders = useCallback(async () => {
    debugger
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
  }, []);


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrderDetails = useCallback(async (id) => {
    debugger
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

  const updateOrder = useCallback(async (id, updates) => {
    debugger
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Optionally, update the order in the local state or refetch orders
        fetchOrders();
      } else {
        console.error("Failed to update order with status: " + response.status);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  return (
    <OrderContext.Provider value={{ orders, loading, updateOrder, orderDetails, fetchOrderDetails }}>
      {children}
    </OrderContext.Provider>
  );
};
