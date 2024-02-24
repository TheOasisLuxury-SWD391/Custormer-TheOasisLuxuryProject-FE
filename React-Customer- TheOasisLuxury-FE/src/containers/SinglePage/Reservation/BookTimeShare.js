import React, { useContext, useState } from 'react';
import { Input, Button, DatePicker, Select, InputNumber, Row, Col, Typography } from 'antd';
import Container from 'components/UI/Container/Container';
import Card from 'components/UI/Card/Card';
import { AuthContext } from 'context/AuthProvider.js';
import { useLocation } from 'react-router-dom';


const { Title, Text } = Typography;

const { Option } = Select;

const BookingTimeShareForm = () => {
    const { user } = useContext(AuthContext);
    // Form state

    const location = useLocation();
    const reservationState = location.state; // This contains startDate, endDate, totalWeeks, totalPrice
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        startDate: null,
        passengers: 1,
        destination: 'destination1',
        adults: 1,
        children: 0,
        additionalRequests: '',
        // Add other form fields as necessary
    });

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Prepare the data to be sent in the POST request
        const postData = {
            // user_id: user.user_id, 
            user_id: "65d60caa6be4f4569b2978ff", // dattq user
            villa_time_share_id: "65d60c1418aae7db0ac56409", // Replace with actual villa time share ID
            price: 6000000, // Replace with actual price or calculate based on form inputs
            start_date: form.startDate?.format('YYYY-MM-DD'), // Format the date as required
            // Include other data as necessary
        };
        console.log('postData', postData);
        try {
            const token = localStorage.getItem('token'); // Assuming you're using token-based authentication
            const response = await fetch('http://localhost:5000/api/v1/users/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    // Include other headers as necessary, like authorization tokens
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            // Handle the response as necessary, e.g., show a success message or redirect the user
        } catch (error) {
            console.error('Error during the fetch operation:', error);
        }
    };


    return (
        <Container>
            <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
                <Col span={24}>
                    <div className="tour-overview-container">
                        <Card className="tour-overview-card">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="tour-image-container">
                                        {/* This will be the image container where you can place the image */}
                                        <img src="{url_image}" alt="Tour Image" className="tour-image" />
                                    </div>
                                </Col>
                                <Col span={16}>
                                    <div className="tour-details ">
                                        <Title level={4}>villa_name</Title>
                                        <p><strong>Mã Order: </strong> NDSGN850-026-270424XE-D</p>
                                        <p><strong>Địa chỉ: </strong> address</p>
                                        <p><strong>Diện  tích: </strong> area</p>
                                        <p><strong>Ngày bắt đầu: </strong> {reservationState?.startDate || 'Default Start Date'}</p>
                                        <p><strong>Ngày kết thúc: </strong> {reservationState?.endDate || 'Default End Date'}</p>
                                        <p><strong>Tổng thời gian: </strong> {reservationState?.totalWeeks || 'Default Weeks'} tuần</p>
                                        <p><strong>Tổng tiền: </strong> ${reservationState?.totalPrice || 'Default Price'}</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>

            <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
                <Col xl={16}>
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        {/* Header section */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">BOOKING TIME SHARE VILLAS FORM</h2>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Họ và Tên*
                            </label>
                            <Input placeholder="Nhập họ tên" id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email*
                            </label>
                            <Input placeholder="Email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>

                        {/* Phone Number */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                                Số điện thoại*
                            </label>
                            <Input placeholder="Số điện thoại" id="phoneNumber" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                        </div>

                        {/* Date Picker */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="datePicker">
                                Ngày sinh*
                            </label>
                            <DatePicker onChange={(date) => setForm({ ...form, startDate: date })} />
                        </div>

                        {/* Number of Passengers */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passengers">
                                Số lượng hành khách
                            </label>
                            <Select defaultValue="1" style={{ width: 120 }} id="passengers">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                            </Select>
                        </div>

                        {/* Destination */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                                Điểm đến*
                            </label>
                            <Select defaultValue="destination1" style={{ width: '100%' }} id="destination">
                                <Option value="destination1">Miền Tây: An Giang - Châu Đốc - Rạch Giá - Cà Mau - Bạc Liêu - Sóc Trăng (Bản giáo hưởng của Biển Rừng Phương Nam)</Option>
                                {/* ... other options ... */}
                            </Select>
                        </div>

                        {/* Number of Adults */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adults">
                                Người lớn (Từ 12 tuổi)*
                            </label>
                            <InputNumber min={1} defaultValue={1} id="adults" />
                        </div>

                        {/* Number of Children */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="children">
                                Trẻ em (Từ 5 - 11 tuổi)
                            </label>
                            <InputNumber min={0} defaultValue={0} id="children" />
                        </div>

                        {/* Additional Requests */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalRequests">
                                Ghi chú thêm
                            </label>
                            <Input.TextArea rows={4} id="additionalRequests" placeholder="Vui lòng nhập nội dung lời nhắn bằng tiếng Anh hoặc tiếng Việt" />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between">
                            <Button type="primary" htmlType="submit">
                                ĐẶT NGAY
                            </Button>
                        </div>
                    </form>
                </Col>
                {/* Tổng quan và tổng tiền*/}
                <Col xl={8}>
                    <Card className="bg-white shadow-md rounded">
                        <div className="mb-4">
                            <Title level={4}>Tóm tắt chuyến đi</Title>
                        </div>

                        {/* ... other summary items ... */}

                        <div className="mb-4">
                            <Text strong>Dịch vụ tùy chọn Xe suốt tuyến - Khách sạn tương đương 3* và 4*</Text>
                        </div>

                        <div className="mb-4">
                            <Text strong>Tour trọn gói (9 khách)</Text>
                            <Text block>Miền Tây: An Giang - Châu Đốc - Rach Giá - Cà Mau - Bac Lieu - Sóc Trăng (Bản giáo hưởng của Biển Rừng...)</Text>
                        </div>

                        {/* Date and Passenger details */}
                        <div className="mb-4">
                            <Text strong>Bắt đầu chuyến đi:</Text>
                            <Text block>T7, 27 Tháng 4 Năm 2024</Text>
                        </div>

                        <div className="mb-4">
                            <Text strong>Kết thúc chuyến đi:</Text>
                            <Text block>T4, 1 Tháng 5 Năm 2024</Text>
                        </div>

                        <div className="mb-4">
                            <Text strong>Hành khách:</Text>
                            <Text block>Người lớn: 1 x 6.390.000 đ</Text>
                            <Text block>Phụ thu phòng đơn: 1.600.000 đ</Text>
                            <Text block>Ưu đãi giờ chót: -400.000 đ</Text>
                        </div>

                        {/* Total Cost */}
                        <div className="mb-4">
                            <Title level={4}>TỔNG TIỀN</Title>
                            <Title level={3} type="danger">7.590.000 đ</Title>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between">
                            <Button type="primary" size="large" block>
                                ĐẶT NGAY
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
        // <div className="container mx-auto p-4">

        // </div>
    );
};

export default BookingTimeShareForm;