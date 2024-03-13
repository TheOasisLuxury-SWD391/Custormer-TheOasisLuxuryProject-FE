import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';
import CancelledOrders from './CancelledOrders';
import CompletedOrders from './CompletedOrders';
import { AuthContext } from 'context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Container from 'components/UI/Container/Container';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import BackButton from 'components/UI/ButtonBACK';
import { HOME_PAGE, ORDER_HISTORY } from 'settings/constant';

const HistoryOrder = () => {
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

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(`/`);
    };

    const breadcrumbs = [
        { title: 'Home', href: HOME_PAGE },
        { title: 'Order History', href: ORDER_HISTORY },
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
            <div>
            <h2 className="text-xl font-bold text-center m-10">LỊCH SỬ ĐẶT HÀNG CỦA TÔI</h2>
            <Tabs defaultActiveKey="1" centered >
                <Tabs.TabPane tab="Đang chờ" key="1" >
                    <PendingOrders orders={userInfo.user?.orders?.filter(order => order.status === 'PENDING') || []} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Đã xác nhận" key="2">
                    <ConfirmedOrders orders={userInfo.user?.orders?.filter(order => order.status === 'CONFIRMED') || []} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Đã huỷ" key="3">
                    <CancelledOrders orders={userInfo.user?.orders?.filter(order => order.status === 'CANCELLED') || []} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Đã hoàn tất" key="4">
                    <CompletedOrders orders={userInfo.user?.orders?.filter(order => order.status === 'COMPLETED') || []} />
                </Tabs.TabPane>

            </Tabs>
            </div>
        </div>
    );
};

export default HistoryOrder;
