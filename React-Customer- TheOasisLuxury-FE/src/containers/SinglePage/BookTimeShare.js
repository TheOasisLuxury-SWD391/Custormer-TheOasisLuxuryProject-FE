import React, { useContext, useState } from 'react';
import { Input, Button, DatePicker, Select, InputNumber, Row, Col, Typography } from 'antd';
import Container from 'components/UI/Container/Container';
import Card from 'components/UI/Card/Card';
import { AuthContext } from 'context/AuthProvider.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { VillaContext } from 'context/VillaContext';


const { Title, Text } = Typography;

const { Option } = Select;

const BookingTimeShareForm = () => {
    const { user } = useContext(AuthContext);
    const { villaDetails } = useContext(VillaContext);
    // console.log('villaDetails',villaDetails);
    const navigate = useNavigate(); // Initialize use
    const idVilla = villaDetails && Object.keys(villaDetails)[0];
    const details = villaDetails[idVilla];
    console.log('details', details);




    // Form state
    const location = useLocation();
    const reservationState = location.state; // This contains startDate, endDate, totalWeeks, totalPrice
    console.log('reservationState', reservationState);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        startDate: null,
        endDate: null, // Added for capturing end date
        passengers: 1,
        destination: 'destination1',
        totalWeeks: reservationState?.totalWeeks,
        additionalRequests: '',
        description: '',
        total_week: reservationState?.totalWeeks, // Added for order description
    });

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Prepare the data to be sent in the POST request
        const postData = {
            user_id: user.user_id,
            villa_time_share_id: "65d60c1418aae7db0ac56409",
            price: reservationState?.totalPrice,
            start_date: reservationState?.startDate,
            end_date: reservationState?.endDate, // Format the end date
            description: form.description, // Description from form
            order_name: details.villa_name,
            status: "PENDING",
            total_week: form.total_week,
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
            const orderId = result.result._id; // result là phản hồi từ API
            navigate(`/villas/${idVilla}/orders/${orderId}/contract`);
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
                                        <img src={details.url_image} alt="Tour Image" className="tour-image" />
                                    </div>
                                </Col>
                                <Col span={16}>
                                    <div className="tour-details ">
                                        <Title level={4}>{details.villa_name}</Title>
                                        <p><strong>Địa chỉ: </strong> {details.address}</p>
                                        <p><strong>Thuộc dự án: </strong> project name</p>
                                        <p><strong>Thuộc phân khu: </strong> subdivision name</p>
                                        <p><strong>Diện  tích: </strong> {details.area}</p>
                                        <p><strong>Tổng số phòng: </strong> 10 (1 Phòng khách, 5 phòng ngủ, 4 wc)</p>
                                        <p><strong>View:  </strong> View hướng biển</p>
                                        <p><strong>Tiện ích bao gồm: </strong> hồ bơi, wifi,...</p>
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

                        <div className='mb4'>
                            <p><strong>Ngày bắt đầu: </strong> {reservationState?.startDate || 'Default Start Date'}</p>
                            <p><strong>Ngày kết thúc: </strong> {reservationState?.endDate || 'Default End Date'}</p>
                            {/* <p><strong>Tổng thời gian: </strong> <InputNumber min={1} value={form.total_week} onChange={(e) => setForm({ ...form, total_week: e.target.value })} id="total_week" /> tuần</p> */}
                            
                        </div>

                        {/* Date Picker
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="datePicker">
                                Ngày sinh*
                            </label>
                            <DatePicker />
                        </div> */}

                        {/* Number of total_week */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_week">
                                Tổng thời gian mua (đơn vị Tuần):
                            </label>
                            <InputNumber min={1} value={form.total_week} onChange={(e) => setForm({ ...form, total_week: e.target.value })} id="total_week" />
                        </div>

                        {/* Number of Children
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="children">
                                Trẻ em (Từ 5 - 11 tuổi)
                            </label>
                            <InputNumber min={0} defaultValue={0} id="children" />
                        </div> */}

                        {/* Additional Requests */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalRequests">
                                Ghi chú thêm
                            </label>
                            <Input.TextArea rows={4} id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả cho đơn hàng" />
                        </div>
                        <div className='flex text-xl font-bold text-center text-cyan-700'>
                        <p className='mr-4'>Tổng tiền: </p> <p>${reservationState?.totalPrice || 'Default Price'}</p> 
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
                            <Title level={4}>Chính sách mua Timeshare Villa</Title>
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
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingTimeShareForm;