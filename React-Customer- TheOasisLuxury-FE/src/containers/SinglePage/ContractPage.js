import React, { useState, useRef, useContext, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Checkbox, Modal } from 'antd';
import SignatureCanvas from 'react-signature-canvas';
import Container from 'components/UI/Container/Container';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { VillaContext } from 'context/VillaContext';
import { AuthContext } from 'context/AuthProvider';
import { OrderContext } from 'context/OrderContext';
import { FormActionArea } from './Reservation/Reservation.style';
import BackButton from 'components/UI/ButtonBACK';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import { BOOK_TIME_SHARE, CONTRACT_TIME_SHARE, HOME_PAGE, LISTING_POSTS_PAGE } from 'settings/constant';
import { toast } from 'react-toastify';


const ContractPage = () => {
    const [form] = Form.useForm();
    const [signatureB, setSignatureB] = useState(null);
    const [isSignatureSaved, setIsSignatureSaved] = useState(false);
    const sigPadB = useRef(null);
    const navigate = useNavigate();
    const location = useLocation()
    const { orderId, reservationDetails } = location.state;
    const { villaDetails } = useContext(VillaContext);
    const idVilla = villaDetails && Object.keys(villaDetails)[0];
    const details = villaDetails[idVilla];
    console.log('details', details)




    // Use OrderContext
    const { orderDetails, fetchOrderDetails, updateOrder } = useContext(OrderContext);

    const { getUserInfo, user } = useContext(AuthContext);

    // State to store the fetched user details
    const [userInfo, setUserInfo] = useState({});

    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user && user.user_id) {
                const userDetails = await getUserInfo(user.user_id);
                if (userDetails && userDetails.user) {
                    setUserInfo(userDetails.user);
                    // Update form fields with user details
                    form.setFieldsValue({
                        fullName: userDetails.user.full_name || '',
                        phoneNumber: userDetails.user.phone_number || '',
                        // Set other fields as necessary
                    });
                }
            }
        };
        console.log(reservationDetails);
        fetchUserInfo();
    }, [user, getUserInfo, form, reservationDetails]);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId, fetchOrderDetails]);


    console.log('orderDetails', orderDetails);

    useEffect(() => {
        // Chỉ thực hiện hành động khi orderDetails cho orderId cụ thể đã được tải
        if (orderDetails && orderDetails[orderId]) {
            // Thực hiện các hành động với orderDetails[orderId]
            console.log("Order Details: ", orderDetails[orderId]);
        }
    }, [orderDetails, orderId]);


    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const clearSignatureB = () => {
        sigPadB.current.clear();
        setIsSignatureSaved(false);
    };

    const saveSignatureB = () => {
        setSignatureB(sigPadB.current.getTrimmedCanvas().toDataURL('image/png'));
        setIsSignatureSaved(true);
    };

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        console.log('Signature Data URL B: ', signatureB);
        saveSignatureB();
        const contractData = {
            // Populate this with all necessary contract data
            insert_date: currentDate,
            userId: user.user_id,
            villaId: idVilla,
            url_image: signatureB,
            contract_name: details.villa_name,
            order_id: orderId,
            sign_contract: isSignatureSaved,
            deflag: isChecked,
            // Include other necessary fields from the form
        };

        try {
            const token = localStorage.getItem('token');
            const contractResponse = await fetch('http://localhost:5000/api/v1/users/create-contract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(contractData),
            });

            if (!contractResponse.ok) {
                throw new Error(`HTTP error! status: ${contractResponse.status}`);
            }

            const contractResult = await contractResponse.json();
            const contractId = contractResult._id;

            if (contractData.deflag) {
                const updateResponse = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: "CONFIRMED" }),
                });

                if (!updateResponse.ok) {
                    throw new Error(`HTTP error! status: ${updateResponse.status}`);
                }
            }

            navigate(`/orders/${orderId}/payment`, { state: { orderId } });

        } catch (error) {
            console.error('Error processing contract or updating order:', error);
        }

    };

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


    const currentDate = moment().format('DD/MM/YYYY');
    const breadcrumbs = [
        { title: 'Home', href: HOME_PAGE },
        { title: 'Villa', href: LISTING_POSTS_PAGE },
        { title: 'Order', href: BOOK_TIME_SHARE },
        { title: 'Contract', href: CONTRACT_TIME_SHARE },
        // Thêm các breadcrumb khác nếu cần
    ];
    return (
        <div>
            <Container className='mb-10'>
                <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
                    <Col span={24} className='flex'>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        <BackButton />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 50 }}>
                    <Col span={24}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <div className="mb-4">
                                <h2 className="text-center"> CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM <br />
                                    Độc lập - Tự do - Hạnh Phúc</h2>
                                <p className='text-right'>TP.Hồ Chí Minh, {currentDate}</p>
                                <br />
                                <h1 className="text-xl font-bold text-center text-cyan-700">HỢP ĐỒNG MUA TIMESHARE KHU VILLA </h1>
                                <br />
                                <p>- Căn cứ: Bộ luật dân sự số: 91/2015/QH13 được quốc hội ban hành ngày 24/11/2015;<br />
                                    - Căn cứ: Luật thương mại 2005<br />
                                    - Căn cứ nhu cầu và khả năng của các bên</p>
                            </div>
                            <div className="mb-4">
                                <p>Hôm nay,  {currentDate}s., chúng tôi bao gồm:</p>
                                <br />
                                <div>
                                    <h2 className=" font-bold text-lg">Bên A (bên bán):</h2>
                                    <p>Tên công ty: The Oasis Luxury Company <br />
                                        Địa chỉ trụ sở: Khu dân cư và công viên Phước Thiện, Phường Long Bình và Phường Long Thạch Mỹ, Quận 9, TP.Hồ Chí Minh.<br />
                                        Mã số thuế: 012856421-689.<br /> </p>
                                    <p className='flex'>
                                        <span className='mr-10'>Hotline:19003542 </span>
                                        <span>Số Fax : +84 (8) 3623 3818</span>
                                    </p>
                                    <p>Người đại diện theo pháp luật:</p>
                                    <p className='flex'>
                                        <span className='mr-10'>Ông/Bà: Nguyễn Văn Anh </span>
                                        <span className='mr-10'>Chức vụ: CEO</span>
                                        <span>Số điện thoại liên hệ: 0945 678 234 </span>
                                    </p>
                                    <p className='flex'>
                                        <span className='mr-10'>Số CCCD: 231420308 </span>
                                        <span className='mr-10'>Ngày cấp: 18/09/2021</span>
                                        <span>Nơi cấp: TP. Hồ Chí Minh</span>
                                    </p>
                                </div>
                                <br />
                                <div>
                                    <h2 className=" font-bold text-lg">Bên B( bên mua):</h2>
                                    <p>Người đại diện theo pháp luật:</p>
                                    <p className='mr-10'><strong>Họ và tên: </strong> {userInfo.full_name}</p>
                                    <p className='mr-10'><strong>Số điện thoại liên hệ: </strong> {userInfo.phone_number}</p>
                                    <p className='mr-10'><strong>Mã số thuế: </strong> {userInfo.tax_code}</p>

                                    <p className='flex'>
                                        <span className='mr-10'><strong>Số CCCD: </strong> {userInfo.CCCD} </span>
                                        <span className='mr-10'><strong>Ngày cấp: </strong>  {userInfo.date_provide_CCCD} </span>
                                        <span className='mr-10'><strong>Nơi cấp:  </strong>  {userInfo.place_provide_CCCD} </span>
                                    </p>
                                </div>
                                <br />
                                <p>Cùng bàn bạc thống nhất những thỏa thuận sau đây:</p>
                            </div>

                            <div className="mb-4">
                                <h1 className='text-cyan-700 text-lg font-bold'>Điều 1. Đối tượng hợp đồng</h1>
                                <p>Bên A đồng ý cho bên B mua Time share khu nghỉ dưỡng từ ngày đến ngày. Thông tin Time share khu nghỉ dưỡng cụ thể như sau:</p>
                                <p className='mr-10'>Tên Villa: {details.villa_name}</p>
                                <p>Mã Villa: {details._id} </p>
                                <p>Địa chỉ villa: {details.address} </p>
                                <p className='flex'>
                                    <p className='mr-10'>Thời gian bắt đầu: {'start_date'} </p>
                                    <p className='mr-10'>Thời gian kết thúc: {'end_date'} </p>
                                </p>
                                <p className='flex'>
                                    <span className='mr-10'>Tổng số tuần: {'total_week'} </span>
                                    <span className='mr-10'>Tiện ích: {'utilities'} </span>
                                </p>
                                <br />
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 2. Giá bán và phương thức thanh toán</h2>
                                <p>1. Giá bán Time share Villa là {'price'} đồng Việt Nam/ {'total_week'} tuần.</p>
                                <p>- Giá bán này đã bao gồm chi phí bảo trì, quản lý vận hành villa và các Khoản thuế mà Bên bán phải nộp cho villa nước theo quy định.</p>
                                <p>2.2. Các chi phí sử dụng điện, nước, điện thoại và các dịch vụ khác do Bên mua thanh toán cho bên cung cấp điện, nước, điện thoại và các cơ quan cung cấp dịch vụ khác.</p>
                                <p>2.3. Phương thức thanh toán: thanh toán bằng tiền Việt Nam thông qua hình thức {'dropdown'} (trả bằng tiền mặt hoặc chuyển Khoản qua ngân hàng)</p>
                                <p>2.4. Thời hạn thanh toán: Bên mua trả tiền mua Time share villa vào ngày  {currentDate}.</p>
                                <br />

                                {/* Điều 3. Thời điểm giao nhận và thời hạn bán Time share khu nghỉ dưỡng */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 3. Thời điểm giao nhận và thời hạn bán Time share khu nghỉ dưỡng</h2>
                                <p>3.1. Thời điểm giao nhận Time share khu nghỉ dưỡng là {'start_date'}.</p>
                                <p>3.2. Thời hạn kết thúc Time share khu nghỉ dưỡng là {'end_date'}.</p>
                                <br />

                                {/* Điều 4. Quyền và nghĩa vụ của Bên mua */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 4. Quyền và nghĩa vụ của Bên mua</h2>
                                {/* Nội dung cụ thể của Điều 4 về quyền và nghĩa vụ */}
                                <p>-  Yêu cầu Bên mua trả đủ tiền mua Time share villa theo đúng thỏa thuận đã cam kết;</p>
                                <p>-  Yêu cầu Bên mua có trách nhiệm sửa chữa các hư hỏng và bồi thường thiệt hại do lỗi của Bên mua gây ra (nếu có); <br />

                                    -  Yêu cầu Bên mua thanh toán đủ số tiền mua Timeshare villa (đối với thời gian đã mua) và giao lại villa ở trong các trường hợp các bên thỏa thuận chấm dứt hợp đồng mua Time share villa ở trước thời hạn;<br />

                                    -  Bảo trì, cải tạo villa ở;<br />

                                    -  Giao villa ở và trang thiết bị gắn liền với villa ở (nếu có) cho Bên mua đúng thời gian quy định tại Khoản 1 Điều 3 của hợp đồng này;<br />

                                    -  Thông báo cho Bên mua biết các quy định về quản lý sử dụng villa ở;<br />

                                    -  Bảo đảm cho Bên mua sử dụng ổn định villa ở trong thời hạn mua Time share villa;<br />

                                    -  Trả lại số tiền mua Time share villa mà Bên mua đã trả trước trong trường hợp các bên thỏa thuận chấm dứt hợp đồng mua Time share villa ở trước thời hạn;<br />

                                    -  Bảo trì, quản lý villa ở bán Time share theo quy định của pháp luật về quản lý sử dụng villa ở;</p>
                                <br />

                                {/* Điều 5. Quyền và nghĩa vụ của Bên bán */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 5. Quyền và nghĩa vụ của Bên bán</h2>
                                {/* Nội dung cụ thể của Điều 5 về quyền và nghĩa vụ */}
                                <p>- Nhận villa ở và trang thiết bị gắn liền với villa ở (nếu có) theo đúng thỏa thuận tại Khoản 1 Điều 3 của hợp đồng này;</p>
                                <p>- Yêu cầu Bên bán Time share sửa chữa kịp thời các hư hỏng về villa ở;<br />

                                    - Yêu cầu Bên bán Time share villa  trả lại số tiền mua Time share villa mà Bên mua đã nộp trước trong trường hợp chấm dứt hợp đồng mua Time share villa trước thời hạn;<br />

                                    - Được đổi villa ở đang mua với người khác hoặc bán Time share lại (nếu có thỏa thuận);<br />

                                    - Được tiếp tục mua theo các điều kiện thỏa thuận với Bên bán Time share trong trường hợp có thay đổi về chủ sở hữu villa ở;<br />

                                    - Trả đủ tiền mua Time share villa theo đúng thời hạn đã cam kết trong hợp đồng;<br />

                                    - Sử dụng villa ở đúng mục đích; có trách nhiệm sửa chữa phần hư hỏng do mình gây ra;<br />
                                    - Chấp hành đầy đủ các quy định về quản lý sử dụng villa ở;<br />

                                    - Không được chuyển nhượng hợp đồng mua Time share villa hoặc cho người khác mua lại, trừ trường hợp được Bên bán Time share đồng ý;<br />

                                    - Chấp hành các quy định về giữ gìn vệ sinh môi trường và an ninh trật tự trong khu vực cư trú;</p>
                                <br />

                                {/* Điều 6. Cam kết của các bên */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 6. Cam kết của các bên</h2>
                                <p>6.1. Bên bán Time share cam kết villa ở bán Time share thuộc quyền sở hữu hợp pháp của mình, không có tranh chấp về quyền sở hữu, không bị kê biên để thi hành án hoặc để chấp hành quyết định hành chính của cơ quan villa nước có thẩm quyền (không thuộc diện bị thu hồi hoặc không bị giải tỏa); cam kết villa ở đảm bảo chất lượng, an toàn cho bên mua Time share villa.</p>
                                <p>6.2. Bên mua Time share villa đã tìm hiểu kỹ các thông tin về villa ở mua.<br />

                                    6.3. Việc ký kết hợp đồng này giữa các bên là hoàn toàn tự nguyện, không bị ép buộc, lừa dối. Trong quá trình thực hiện hợp đồng, nếu cần thay đổi hoặc bổ sung nội dung của hợp đồng này thì các bên thỏa thuận lập thêm phụ lục hợp đồng có chữ ký của hai bên, phụ lục hợp đồng có giá trị pháp lý như hợp đồng này.<br />

                                    6.4. Các bên cùng cam kết thực hiện đúng và đầy đủ các nội dung đã thỏa thuận trong hợp đồng.</p>
                                <br />

                                {/* Điều 7. Trường Hợp Bất Khả Kháng */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 7. Trường Hợp Bất Khả Kháng</h2>
                                <p>Trong trường hợp một bên không thể thực hiện được nghĩa vụ hợp đồng do các hiện tượng thiên nhiên, lũ lụt, động đất, chiến tranh, khởi nghĩa, nổi loạn và các sự kiện khách quan không nằm trong sự kiểm soát hợp lý của Bên bị ảnh hưởng, và nếu Bên này đã nỗ lực hợp lý giảm thiểu hậu quả, và đã báo cáo bằng văn bản cho bên còn lại một cách nhanh chóng thì đó sẽ là lý do để biện minh và thời gian thi công sẽ được gia hạn thêm thời gian bị đình trệ bởi sự kiện này. Bất kể nguyên do bất khả khác, nếu Bên bị ảnh hưởng không thực hiện nghĩa vụ trong vòng 3 ngày sau ngày sự kiện bất khả kháng xảy ra thì bên kia có quyền chấm dứt hợp đồng.</p>
                                <br />

                                {/* Điều 8: Vi phạm và chế tài */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 8: Vi phạm và chế tài</h2>
                                <p>8.1. Trừ trường hợp bất khả kháng, nếu một trong hai bên không thực hiện đúng theo thỏa thuận của hợp đồng hoặc đơn phương chấm dứt hợp đồng không có sự thỏa thuận của hai bên, thì sẽ bị phạt 15% giá trị hợp đồng.</p>
                                <p>8.2. Bên vi phạm hợp đồng , ngoài việc chịu phạt vi phạm theo thỏa thuận tại Khoản 9.1. Điều này, còn phải chịu bồi thường thiệt hại cho bên bị vi phạm theo quy định của pháp luật, bao gồm nhưng không giới hạn những Khoản thiệt hại: thiệt hại thực tế, trực tiếp mà một bên phải gánh chịu do bên còn lại vi phạm hợp đồng gây ra; thiệt hại là Khoản lợi nhuận mà bên bị vi phạm lẽ ra được hưởng nếu không có hành vi vi phạm hợp đồng của bên còn lại, các Khoản chi phí mà bên bị vi phạm bỏ ra để hạn chế khắc, phục thiệt hại, để thực hiện công việc cần thiết nhằm đòi bồi thường thiệt hại, bảo vệ quyền lợi của bên bị vi phạm trong trường hợp bên vi phạm không ngay lập tức khắc phục, bồi thường thiệt hại khi nhận được yêu cầu của bên bị vi phạm.</p>
                                <br />

                                {/* Điều 9: Hiệu lực hợp đồng */}
                                <h2 className='text-cyan-700 text-lg font-bold'>Điều 9: Hiệu lực hợp đồng</h2>
                                <p>- Hợp Đồng này có hiệu lực kể từ ngày ký và sẽ chấm dứt khi hết hạn bảo trì và biên bản thanh lý hợp đồng được hai Bên ký kết.</p>
                                <p>- Mọi sự thay đổi hay bổ sung vào bản hợp đồng này phải được sự thống nhất của cả hai Bên và được lập thành văn bản mới có giá trị hiệu lực.</p>
                                <p>- Hai Bên cam kết thực hiện nghiêm túc các điều Khoản đã thỏa thuận trong hợp đồng.</p>
                                <p>- Hợp đồng làm thành 02 bản có giá trị pháp lý như nhau, mỗi Bên giữ 01 bản.</p>
                                <br />

                            </div>
                            <div className='flex justify-around'>
                                <div className="my-4 text-center">
                                    <label className='font-bold'>Chữ ký Bên A:</label>
                                    <p>(ký và ghi rõ họ tên)</p>
                                    <br />
                                    <p> ANH</p>
                                    <br />
                                    <h1 className='font-bold'>Nguyễn Văn Anh</h1>
                                </div>
                                {/* Chữ ký Bên B */}
                                <div className='my-4 text-center'>
                                    <label className='font-bold'>Chữ ký Bên B:</label>
                                    <SignatureCanvas
                                        penColor="black"
                                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                                        ref={sigPadB}
                                    />
                                    <Button onClick={clearSignatureB}>Xóa Chữ Ký</Button>
                                    <Button onClick={saveSignatureB}>Lưu Chữ Ký</Button>
                                </div>
                            </div>
                            <Form.Item>
                                <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
                                    Tôi đã đọc điều khoản chính sách và Hợp đồng. Tôi xác nhận ký hợp đồng.
                                </Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <FormActionArea >
                                    <Button type="primary" htmlType="submit" disabled={!isSignatureSaved || !isChecked}>
                                        Đặt Order và Lưu Hợp Đồng
                                    </Button>
                                </FormActionArea>
                                <FormActionArea>
                                    <Button type="default" onClick={showConfirmDialog}>
                                        HUỶ
                                    </Button>
                                </FormActionArea>

                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Container >
        </div>

    );
};

export default ContractPage;
