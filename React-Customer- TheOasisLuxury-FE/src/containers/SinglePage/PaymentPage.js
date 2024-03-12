import React, { useEffect, useState } from 'react';
import { Select, Button, InputNumber, Divider, Col, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from 'components/UI/ButtonBACK';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import Container from 'components/UI/Container/Container';
import { BOOK_TIME_SHARE, CONTRACT_TIME_SHARE, HOME_PAGE, LISTING_POSTS_PAGE, PAYMENT_FORM } from 'settings/constant';
import { minWidth } from 'styled-system';
import { FormActionArea } from './Reservation/Reservation.style';
import { toast } from 'react-toastify';
import Modal from 'antd/es/modal/Modal';

const { Option } = Select;

const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const PaymentForm = ({ value }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  console.log('orderId', orderId)

  const [orderDetail, setOrderDetail] = useState(null);
  console.log('orderDetail', orderDetail)


  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const orderData = await response.json();
          setOrderDetail(orderData);
          //   fetchVillaTimeShareDetail(orderData.villa_time_share_id); // Fetch Villa Time Share detail
        } else {
          console.error('Failed to fetch order detail:', response.status);
        }
      } catch (error) {
        console.error('Error fetching order detail:', error);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const handleCancel = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!orderId) {
            console.error("No order ID found. Unable to update order status.");
            return;
        }

        const orderResponse = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "CANCELLED" }),
        });

       
        if (!orderResponse.ok ) {
            throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }

        console.log("Order cancelled successfully");
        toast.success("Order cancelled successfully");
        navigate(HOME_PAGE); // Redirect user to a different page after cancellation if desired
    } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error("Error cancelling order");
    }
};

  const showConfirmDialog = () => {
    Modal.confirm({
        title: 'Vui lòng xem chính sách huỷ đơn đặt và huỷ hợp đồng',
        content: 'Bạn chắc chắn huỷ đơn chứ?',
        okText: 'Yes',
        cancelText: 'No',
        onOk() {
            handleCancel();
        },
        onCancel() {
            console.log('Cancel operation aborted by the user.');
        },
        okButtonProps: {
            className: 'bg-cyan-700 hover:bg-cyan-900 text-white font-bold  rounded float-right',
        },
    });
};

  const handlePayment = () => {
    // Navigate to the invoice page
    navigate(`/orders/${orderId}/invoice`);
  };

  const handleChange = (value) => {
    setPaymentMethod(value);
  };
  const breadcrumbs = [
    { title: 'Home', href: HOME_PAGE },
    { title: 'Villa', href: LISTING_POSTS_PAGE },
    { title: 'Order', href: BOOK_TIME_SHARE },
    { title: 'Contract', href: CONTRACT_TIME_SHARE },
    { title: 'Payment', href: PAYMENT_FORM },
    // Thêm các breadcrumb khác nếu cần
  ];

  return (
    <div>


      <Container className='mb-10'>
        <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 60 }}>
          <Col span={24} className='flex'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <BackButton />
          </Col>
        </Row>
      </Container>
      {orderDetail ? (
        <div className="p-4 mx-auto bg-white shadow-md rounded-lg w-1/2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">ĐƠN HÀNG CỦA BẠN</h2>
            <Divider />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Thông tin đơn hàng</h3>
            <p className='mb-4'> <strong>Mã đơn hàng: </strong> #{orderDetail?.invoice_id} </p>
            <p className="text-gray-600"><strong>Tên đơn đặt Timeshare:</strong> {orderDetail?.order_name}</p>
            <p className="text-gray-600"><strong>Ngày đặt hàng:</strong> {orderDetail?.insert_date}</p>
            <p className="text-gray-600">
              <strong>Trạng thái đơn hàng:</strong>{" "}
              {orderDetail?.status === "PENDING" && "ĐANG CHỜ"}
              {orderDetail?.status === "CONFIRMED" && "ĐÃ XÁC NHẬN ĐƠN"}
              {orderDetail?.status === "COMPLETED" && "ĐÃ HOÀN THÀNH"}
              {orderDetail?.status === "CANCELLED" && "ĐÃ HUỶ"}
            </p>
          </div>
          <Divider />

          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-800">
              Chọn phương thức thanh toán
            </label>
            <p><span className='text-rose-700 font-bold'> * </span>Hãy mở App Momo hoặc App ngân hàng lên để quét mã thanh toán. Sau khi thanh toán xong thì ấn nút ĐÃ THANH TOÁN phía dưới.</p>

            <Select
              className="w-1/2 m-4"
              placeholder="Chọn phương thức"
              onChange={handleChange}
              value={paymentMethod}
            >
              <Option value="momo">Momo</Option>
              <Option value="paypal">Tài khoản ngân hàng</Option>
            </Select>
            {paymentMethod === 'momo' && (
              <div>
                <p><strong>Số Momo:</strong> 0984135344</p>
                <p><strong>Tên tài khoản:</strong> Nguyễn Văn Anh</p>
                <p><strong>Nội dunng chuyển khoản:</strong> #{orderDetail?.invoice_id}</p>
                <img className='w-60 p-4' src="https://homepage.momocdn.net/blogscontents/momo-upload-api-220808102122-637955508824191258.png" title='QR Momo' />
              </div>
            )}
            {paymentMethod === 'paypal' && (
              <div>
                <p><strong>Tên ngân hàng:</strong> Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam</p>
                <p><strong>Số tài khoản:</strong> 5011 2051 34332 </p>
                <p><strong>Tên tài khoản:</strong> Nguyễn Văn Anh</p>
                <p><strong>Nội dunng chuyển khoản:</strong> #{orderDetail?.invoice_id}</p>
                <img className='w-60 p-4' src="https://image.congan.com.vn/thumbnail/CATP-347-2020-4-17/qr.png" title='QR Bank' />
              </div>
            )}
            {(!paymentMethod) && (
              <p>Vui lòng chọn phương thức thanh toán</p>
            )}
          </div>

          <div className=' mb-4 flex text-xl font-bold text-center text-cyan-700'>
            <p className='mr-4'>Tổng tiền: </p> <p>{formatter(orderDetail?.price)}</p>
          </div>

          <Divider />

          <FormActionArea className='flex justify-around'>
            <Button type="primary" className="!bg-white !text-cyan-700" onClick={showConfirmDialog} >
              HUỶ
            </Button>
            <Button type="primary" className="p-2" onClick={handlePayment}>
              ĐÃ THANH TOÁN
            </Button>
          </FormActionArea>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PaymentForm;
