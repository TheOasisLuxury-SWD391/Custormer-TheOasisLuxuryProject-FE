// OrderDetailPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'context/AuthProvider';
import { Button, Col, Row } from 'antd';
import { FormActionArea } from 'containers/SinglePage/Reservation/Reservation.style';
import Policy from 'containers/SinglePage/Policy/Policy';
import Card from 'components/UI/Card/Card';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  console.log('orderId', orderId);
  const [userInfo, setUserInfo] = useState({});
  const { user, getUserInfo } = useContext(AuthContext);

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

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
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
                        {/* <FormActionArea>
                            <Button type="primary" htmlType="submit" className='w-full'>
                                ĐẶT NGAY
                            </Button>
                        </FormActionArea> */}

                        {/* </div> */}
                </Col>
                {/* Tổng quan và tổng tiền*/}
                <Col xl={8}>
                    <Card className="bg-white shadow-md rounded">
                        <Policy />
                    </Card>
                </Col>
            </Row>
  );
};

export default OrderDetailPage;
