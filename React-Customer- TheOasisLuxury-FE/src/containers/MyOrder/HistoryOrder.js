import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';
import CancelledOrders from './CancelledOrders';
import CompletedOrders from './CompletedOrders';
import { AuthContext } from 'context/AuthProvider';

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

    


    return (
        <div>
            <Tabs defaultActiveKey="1" centered>
                <Tabs.TabPane tab="Chờ thanh toán" key="1">
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
    );
};

export default HistoryOrder;
