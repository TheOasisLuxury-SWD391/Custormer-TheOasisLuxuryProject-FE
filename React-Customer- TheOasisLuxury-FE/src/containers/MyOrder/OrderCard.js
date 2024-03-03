// OrderCard.js
import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order, index, onSelect }) => {
    let navigate = useNavigate();
    const orderId = order._id;

    const handleClick = () => {
      navigate(`/order/${orderId}`);
    };

  return (
    <Card title={`#${index + 1} - ${order.order_name}`} onClick={handleClick}>
      <p>Price: {order.price}</p>
      <p>Status: {order.status}</p>
      <p>ID: {order._id}</p>
    </Card>
  );
};

export default OrderCard;
