// OrderCard.js
import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

function getOrderStatusStyle(status) {
  switch (status) {
    case "PENDING":
      return { backgroundColor: "orange", color: "white" };
    case "CONFIRMED":
      return { backgroundColor: "#007bff", color: "white" };
    case "COMPLETED":
      return { backgroundColor: "#28a745", color: "white" };
    case "CANCELLED":
      return { backgroundColor: "#dc3545", color: "white" };
    default:
      return {};
  }
}

const OrderCard = ({ order, index, onSelect, status }) => {
  let navigate = useNavigate();
  const orderId = order._id;

  const handleClick = () => {
    navigate(`/order/${orderId}`);
  };

  return (
    <Card title={`Mã đơn: ${order.invoice_id}`}>
      <div className='flex absolute top-2 right-6'>
        <p className='m-2'><strong>TRẠNG THÁI ĐƠN HÀNG:</strong></p>
        <p
          className="text-gray-600"
          style={{
            borderRadius: "5px",
            padding: "10px",
            ...getOrderStatusStyle(order.status),
          }}
        >
          {" "}
          {order.status === "PENDING" && "ĐANG CHỜ"}
          {order.status === "CONFIRMED" && "ĐÃ XÁC NHẬN ĐƠN"}
          {order.status === "COMPLETED" && "ĐÃ HOÀN THÀNH"}
          {order.status === "CANCELLED" && "ĐÃ HUỶ"}
        </p>
      </div>
      <div className='text-lg mb-4'>
        <p>Tên đơn đặt Timeshare: <strong >{order.order_name}</strong></p>
        <p>Ngày bắt đầu: {order.start_date} - Ngày kết thúc: {order?.end_date}</p>
      </div>
      <div className='flex text-xl font-bold text-center text-cyan-700'>
        <p className='mr-4'>Tổng tiền: </p> <p>${order.price}</p>
      </div>
      {/* <p>Đơn giá: ${order.price}</p> */}
      <hr />
      <div>
      </div>
      <button
        className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded float-right mt-4"
        onClick={handleClick}
      >
        Xem chi tiết
      </button>
    </Card>
  );
};

export default OrderCard;
