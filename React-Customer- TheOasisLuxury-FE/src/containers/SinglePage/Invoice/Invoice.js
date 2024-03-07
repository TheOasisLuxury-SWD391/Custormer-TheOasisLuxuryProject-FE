import React from 'react';
import { Col, Row, Table } from 'antd';
import HeaderInvoice from './HeaderInvoice';
import BodyInvoice from './BodyInvoice';
import { useNavigate } from 'react-router-dom';
import Container from 'components/UI/Container/Container';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import { BOOK_TIME_SHARE, CONTRACT_TIME_SHARE, HOME_PAGE, INVOICE_PAGE, LISTING_POSTS_PAGE, PAYMENT_FORM } from 'settings/constant';

const invoiceData = {
    villaName: 'Villa Sunset',
    villaCode: 'VS123',
    address: '123 Beachside, Beautiful Island',
    project: 'Ocean Views',
    sector: 'Luxury',
    price: 10000000,
    VAT: 10,
    totalPrice: 11000000,
};

const columns = [
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Số lượng',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'VAT',
        dataIndex: 'vat',
        key: 'vat',
    },
    {
        title: 'Tổng cộng',
        dataIndex: 'total',
        key: 'total',
    },
];

const dataSource = [
    {
        key: '1',
        description: `Villa: ${invoiceData.villaName} (Mã: ${invoiceData.villaCode})`,
        amount: 1,
        price: `${invoiceData.price.toLocaleString()} VND`,
        vat: `${invoiceData.VAT}%`,
        total: `${invoiceData.totalPrice.toLocaleString()} VND`,
    },
];

const InvoiceComponent = () => {
    const navigate = useNavigate();

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
                    <div className="flex justify-end">
                        <img
                            src="https://png.pngtree.com/png-clipart/20230912/original/pngtree-paid-in-full-fully-invoiced-picture-image_13032550.png"
                            alt="Stamp"
                            className="w-2/6 object-cover"
                        />
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default InvoiceComponent;
