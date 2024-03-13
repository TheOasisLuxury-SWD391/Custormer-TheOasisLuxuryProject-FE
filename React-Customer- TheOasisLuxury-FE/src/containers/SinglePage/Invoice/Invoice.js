import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'antd';
import HeaderInvoice from './HeaderInvoice';
import BodyInvoice from './BodyInvoice';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'components/UI/Container/Container';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import { BOOK_TIME_SHARE, CONTRACT_TIME_SHARE, HOME_PAGE, INVOICE_PAGE, LISTING_POSTS_PAGE, PAYMENT_FORM } from 'settings/constant';

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

const InvoiceComponent = (status) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, idVilla } = location.state || {};
    console.log('orderId', orderId);

    const [orderDetail, setOrderDetail] = useState(null);
    console.log('orderDetail', orderDetail);



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


    const handleBackClick = () => {
        navigate(`/`);
    };
    const breadcrumbs = [
        { title: 'Home', href: HOME_PAGE },
        { title: 'Villa', href: LISTING_POSTS_PAGE },
        { title: 'Order', href: BOOK_TIME_SHARE },
        { title: 'Contract', href: CONTRACT_TIME_SHARE },
        { title: 'Payment', href: PAYMENT_FORM },
        { title: 'Invoice', href: INVOICE_PAGE },
        // Thêm các breadcrumb khác nếu cần
    ];

    return (
        <div>
            <Container>
                <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 50 }}>
                    <Col span={24} className='flex'>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right mr-10"
                            onClick={handleBackClick}
                            >
                            Home
                        </button>
                    </Col>
                </Row>
            </Container>
            {orderDetail ? (

            <div className="p-8 bg-white shadow-md rounded w-3/4 mx-auto mt-10">
                {/* Logo and company info here */}
                <HeaderInvoice />
                <main>
                    <div className="mb-4 text-center">
                        <h2 className="text-xl font-bold text-cyan-700">HOÁ ĐƠN ĐẶT MUA TIMESHARE VILLA</h2>
                    </div>
                    {/* Invoice information like booking number, charge date, etc. */}
                    {/* <Table dataSource={dataSource} columns={columns} pagination={false} /> */}
                    <BodyInvoice />
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
                    <p className='m-4'><span className='text-rose-700 font-bold'>*</span> Đơn đặt hàng của bạn đang chờ xét duyệt bởi Nguyễn Văn Anh. Bạn vui lòng chờ đơn được duyệt trong khoảng 24h. <br/>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi! Nếu có thắc mắc thì hãy liên hệ chúng tôi qua đường dây nóng 1900 2324.</p>
                </footer>
            </div>) :(
                 <div>Loading...</div>
            )}
        </div>
    );
};

export default InvoiceComponent;
