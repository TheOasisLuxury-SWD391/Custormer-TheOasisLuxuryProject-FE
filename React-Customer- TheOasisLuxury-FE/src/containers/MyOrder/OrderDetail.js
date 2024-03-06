// OrderDetailPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from 'context/AuthProvider';
import { Button, Col, Row } from 'antd';
import { FormActionArea } from 'containers/SinglePage/Reservation/Reservation.style';
import Policy from 'containers/SinglePage/Policy/Policy';
import Card from 'components/UI/Card/Card';
import { VillaContext } from 'context/VillaContext';
import BackButton from 'components/UI/ButtonBACK';
import Container from 'components/UI/Container/Container';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import { BOOK_TIME_SHARE, HOME_PAGE, LISTING_POSTS_PAGE } from 'settings/constant';
import Modal from 'antd/es/modal/Modal';
import { toast } from 'react-toastify';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  console.log('orderId', orderId);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const { user, getUserInfo } = useContext(AuthContext);
  const { villaDetails } = useContext(VillaContext);
  const idVilla = villaDetails && Object.keys(villaDetails)[0];
  const details = villaDetails[idVilla];

  const showConfirmDialog = () => {
    Modal.confirm({
        title: 'Vui lòng xem chính sách huỷ hợp đồng',
        content: 'Bạn chắc chắn huỷ Hợp đồng?',
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



  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserInfo(user.user_id);
      if (userData) {
        setUserInfo(userData); // Cập nhật state với thông tin người dùng
      }
    };

    if (user.user_id) {
      fetchUserData();
    }
  }, [user.user_id, getUserInfo]);

  const order = userInfo.user?.orders?.find(order => order._id === orderId);

  const handleContractSigning = () => {
    if (details) {
      navigate(`/orders/${orderId}/contract`, { state: { orderId, idVilla: idVilla } });
    } else {
      // Handle the case where details are not available
      console.error('Villa details are not available');
    }
  };

  if (!order) {
    return <div>Order not found</div>;
  }

  const handleCancel = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!orderId) {
            console.error("No order ID found. Unable to update order status.");
            return;
        }

        const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "CANCELLED" }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Order cancelled successfully");
        toast.success("Order cancelled successfully");
        navigate(HOME_PAGE); // Redirect user to a different page after cancellation if desired
    } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error("Error cancelling order");
    }
};

  const breadcrumbs = [
    { title: 'Home', href: HOME_PAGE },
    { title: 'Villa', href: LISTING_POSTS_PAGE },
    { title: 'Order', href: BOOK_TIME_SHARE },
    // Thêm các breadcrumb khác nếu cần
  ];

  return (
    <div>

      <Container>
        <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
          <Col span={24} className='flex'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <BackButton />
          </Col>
        </Row>
      </Container>
      <Row style={{ marginTop: 30 }} className='w-2/3 mx-auto'>
        <Col xl={16}>
          {/* Header section */}
          <div className="mb-4">
            <h2 className="text-xl font-bold">ORDER DETAIL TIMESHARE VILLA </h2>
          </div>
          <div className="mb-4">
            <p><strong>Mã Order:  </strong>{order._id}</p>
          </div>
          <div className="mb-4">
            <p><strong>Tên Villa:  </strong>{order.order_name}</p>
          </div>
          <div className="mb-4">
            <p><strong>Trạng thái:  </strong>{order.status}</p>
          </div>

          <div className='mb-4 '>
            <p><strong>Ngày bắt đầu: </strong>{order.start_date}</p>
          </div>

          {/* Number of total_week */}
          {/* <div className="mb-4">
                            <p><strong>Tổng thời gian mua:  </strong> {form.total_week} tuần</p>
                        </div> */}

          {/* Additional Requests */}

          <div className='flex text-xl font-bold text-center text-cyan-700'>
            <p className='mr-4'>Tổng tiền: </p> <p>${order.price}</p>
          </div>

          {/* Submit Button */}
          {/* <div className="items-center justify-betwee w-full"> */}
          {order.status === 'PENDING' && (
            <FormActionArea>
              <Button type="primary" onClick={handleContractSigning}>
                Ký Contract
              </Button>
            </FormActionArea>
          )}
          {['PENDING', 'CONFIRMED'].includes(order.status) && (
            <FormActionArea>
              <Button type="default" onClick={showConfirmDialog}>
                Cancel Order
              </Button>
            </FormActionArea>
          )}

          {/* </div> */}

        </Col>
        {/* Tổng quan và tổng tiền*/}
        <Col xl={8}>
          <Card className="bg-white shadow-md rounded">
            <Policy />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
