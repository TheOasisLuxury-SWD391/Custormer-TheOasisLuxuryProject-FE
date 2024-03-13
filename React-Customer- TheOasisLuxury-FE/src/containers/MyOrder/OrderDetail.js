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
import { BOOK_TIME_SHARE, HOME_PAGE, LISTING_POSTS_PAGE, ORDER_HISTORY } from 'settings/constant';
import Modal from 'antd/es/modal/Modal';
import { toast } from 'react-toastify';
import BodyInvoice from 'containers/SinglePage/Invoice/BodyInvoice';

const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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

const OrderDetailPage = (status, value) => {
  const { orderId } = useParams();
  console.log('orderId', orderId);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const { user, getUserInfo } = useContext(AuthContext);

  const [orderDetail, setOrderDetail] = useState(null);
  const [villaTimeShareDetail, setVillaTimeShareDetail] = useState(null);
  const [villaDetail, setVillaDetail] = useState(null); // State mới để lưu thông tin villa
  console.log('orderDetail', orderDetail);
  console.log('villaTimeShareDetail', villaTimeShareDetail);
  console.log('villaDetail', villaDetail);

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
      // console.log('order.villa_time_share_id', order.villa_time_share_id);

      const userData = await getUserInfo(user.user_id);
      if (userData) {
        setUserInfo(userData); // Cập nhật state với thông tin người dùng
      }
    };

    if (user.user_id) {
      fetchUserData();
    }
  }, [user.user_id, getUserInfo]);

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
          fetchVillaTimeShareDetail(orderData.villa_time_share_id); // Fetch Villa Time Share detail
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

  useEffect(() => {
    if (villaTimeShareDetail && villaTimeShareDetail.result && villaTimeShareDetail.result.villa_id) {
      fetchVillaDetail(villaTimeShareDetail.result.villa_id);
    }
  }, [villaTimeShareDetail]);

  // Fetch villa time share detail by villa_time_share_id
  const fetchVillaTimeShareDetail = async (villaTimeShareId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/villas/get-villa0time-share/${villaTimeShareId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const villaTimeShareData = await response.json();
        setVillaTimeShareDetail(villaTimeShareData);
      } else {
        console.error('Failed to fetch villa time share detail:', response.status);
      }
    } catch (error) {
      console.error('Error fetching villa time share detail:', error);
    }
  };

  const fetchVillaDetail = async (villaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/villas/${villaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const villaData = await response.json();
        setVillaDetail(villaData); // Cập nhật state với thông tin villa
      } else {
        console.error('Failed to fetch villa detail:', response.status);
      }
    } catch (error) {
      console.error('Error fetching villa detail:', error);
    }
  };



  const order = userInfo.user?.orders?.find(order => order._id === orderId);


  const handleContractSigning = () => {
    if (villaDetail !== null && villaDetail.result && villaDetail.result._id) {
      navigate(`/orders/${orderId}/contract/`, { state: { orderId, idVilla: villaDetail.result._id } });
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
    { title: 'Order History', href: ORDER_HISTORY },
    { title: 'Order Detail', href: BOOK_TIME_SHARE },
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
        <Col xl={18}>
          {orderDetail ? (
            <div className="p-8 bg-white shadow-md rounded w-3/4 mx-auto mt-10">
              {/* Logo and company info here */}
              <main>
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-cyan-700">THÔNG TIN ĐƠN ĐẶT MUA TIMESHARE VILLA</h2>
                </div>
                <div>

                  <div className="mb-8">
                    <div className="mb-2">
                      <h1 className='text-center text-lg font-bold'>MÃ HOÁ ĐƠN: {orderDetail.invoice_id}</h1>
                      <h3 className="text-lg font-bold">Thông Tin Người Đặt</h3>
                    </div>
                    <div className="bg-white p-4 shadow rounded text-base">
                      <div className="mb-2"><strong>Họ tên người mua hàng:</strong> {orderDetail.user.full_name}</div>
                      <div className="mb-2"><strong>Địa chỉ:</strong> {orderDetail.user.place_provide_CCCD}</div>
                      <div className="mb-2"><strong>Email:</strong> {orderDetail.user.email}</div>
                      <div className="mb-2"><strong>Số điện thoại:</strong> {orderDetail.user.phone_number}</div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold">Thông Tin Chi Tiết Căn Villa</h3>
                    </div>
                    <div className="overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="mt-5 border-t border-gray-200">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-base font-medium text-gray-500">Tên đơn mua Timeshare căn Villa</dt>
                              <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">{orderDetail.order_name} </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-base font-medium text-gray-500">Thời Gian Bắt Đầu</dt>
                              <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">{orderDetail.start_date}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-base font-medium text-gray-500">Thời Gian Kết Thúc</dt>
                              <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">{orderDetail.end_date}</dd>
                            </div>
                            {/* Thêm các hàng khác tương tự với thông tin cần thiết */}
                          </dl>
                        </div>
                        <hr />
                        <div className="mt-4">
                          <div className="flex float-right m-4">
                            <div className=" mr-32">
                              {/* <h3 className="text-base leading-6 font-medium text-gray-900">VAT (10%)</h3> */}
                              <h3 className="text-lg leading-6 font-bold text-cyan-700">Tổng Cộng Tiền Thanh Toán</h3>
                            </div>
                            <div className="ml-4 ">
                              {/* <div className="text-base leading-6 font-medium text-gray-90 text-right">VND: 0</div> */}
                              <div className="text-lg leading-6 font-bold text-cyan-700 text-right"> {formatter(orderDetail?.price)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
              <footer className="text-right mt-4">
                <div className="flex justify-end text-xl">
                  <p className='m-2'><strong>TRẠNG THÁI ĐƠN HÀNG:</strong></p>
                  <p
                    className="text-gray-600"
                    style={{
                      borderRadius: "5px",
                      padding: "10px",
                      ...getOrderStatusStyle(orderDetail.status),
                    }}
                  >
                    {" "}
                    {orderDetail.status === "PENDING" && "ĐANG CHỜ"}
                    {orderDetail.status === "CONFIRMED" && "ĐÃ XÁC NHẬN ĐƠN"}
                    {orderDetail.status === "COMPLETED" && "ĐÃ HOÀN THÀNH"}
                    {orderDetail.status === "CANCELLED" && "ĐÃ HUỶ"}
                  </p>
                </div>
                <p className='m-4'><span className='text-rose-700 font-bold'>*</span> Đơn đặt hàng của bạn đang chờ xét duyệt bởi Nguyễn Văn Anh. Bạn vui lòng chờ đơn được duyệt trong khoảng 24h. <br />Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi! Nếu có thắc mắc thì hãy liên hệ chúng tôi qua đường dây nóng 1900 2324.</p>
              </footer>

              <FormActionArea className='flex justify-around'>
                {['PENDING', 'CONFIRMED'].includes(orderDetail.status) && (
                <Button type="primary" className="!bg-white !text-cyan-700" onClick={showConfirmDialog} >
                  HUỶ
                </Button>
                )}
                {orderDetail.status === 'PENDING' && (
                <Button type="primary" className="p-2" onClick={handleContractSigning}>
                  KÝ CONTRACT
                </Button>
                )}
              </FormActionArea>
              {/* {orderDetail.status === 'PENDING' && (
                <FormActionArea>
                  <Button type="primary" onClick={handleContractSigning}>
                    Ký Contract
                  </Button>
                </FormActionArea>
              )} */}
              {/* {['PENDING', 'CONFIRMED'].includes(orderDetail.status) && (
                <FormActionArea>
                  <Button type="default" onClick={showConfirmDialog}>
                    Cancel Order
                  </Button>
                </FormActionArea>
              )} */}
            </div>) : (
            <div>Loading...</div>
          )}
        </Col>
        {/* Tổng quan và tổng tiền*/}
        <Col xl={6}>
          <Card className="bg-white shadow-md rounded mt-10">
            <Policy />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
