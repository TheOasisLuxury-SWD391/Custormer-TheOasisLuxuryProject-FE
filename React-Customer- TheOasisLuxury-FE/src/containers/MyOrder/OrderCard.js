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
    <Card title={`Mã đơn: ${order._id}  - ${order.status}`}>
      <p>Tên Villa: {order.order_name}</p>
      <p>Ngày bắt đầu: {order.start_date} - Ngày kết thúc: {order?.end_date}</p>
      <div className='flex text-xl font-bold text-center text-cyan-700'>
        <p className='mr-4'>Tổng tiền: </p> <p>${order.price}</p>
      </div>
      {/* <p>Đơn giá: ${order.price}</p> */}
      <hr />
      <div>
      </div>
      <button
        className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded float-right"
        onClick={handleClick}
      >
        Xem chi tiết
      </button>
    </Card>
  );
};

export default OrderCard;
