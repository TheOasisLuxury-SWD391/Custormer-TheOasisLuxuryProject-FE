import React, { useState } from 'react';
import { Select, Button, InputNumber, Divider, Col, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from 'components/UI/ButtonBACK';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import Container from 'components/UI/Container/Container';

const { Option } = Select;

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  console.log('orderId', orderId)



  const handlePayment = () => {
    // Navigate to the invoice page
    navigate(`/orders/${orderId}/invoice`);
  };

  const handleChange = (value) => {
    setPaymentMethod(value);
  };
  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'User', href: '/user' },
    // Thêm các breadcrumb khác nếu cần
  ];

  return (
    <div>
      <Container className='mb-10'>
        <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
          <Col span={24} className='flex'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <BackButton />
          </Col>
        </Row>
      </Container>
      <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Thông tin thanh toán</h2>
          <Divider />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Chọn phương thức thanh toán
          </label>
          <Select
            className="w-full"
            placeholder="Chọn phương thức"
            onChange={handleChange}
            value={paymentMethod}
          >
            <Option value="momo">Momo</Option>
            <Option value="paypal">PayPal</Option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tổng tiền
          </label>
          <InputNumber
            className="w-full"
            formatter={value => `${value}₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\₫\s?|(,*)/g, '')}
            disabled
            defaultValue={100000} // Giả sử tổng tiền mặc định là 100,000 đồng
          />
        </div>

        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-800">Thông tin đơn hàng</h3>
          <p className="text-gray-600">Mã đơn hàng: #123456</p>
          <p className="text-gray-600">Số lượng: 3</p>
          <p className="text-gray-600">Ngày đặt hàng: 2024-02-25</p>
        </div>

        <Button type="primary" className="w-full" onClick={handlePayment}>
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
