import { Table } from 'antd';
import React, { Component, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');


const BodyInvoice = ({ value }) => {
  const location = useLocation();
  const { orderId, idVilla } = location.state || {};
  console.log('orderId', orderId)
  console.log('idVilla', idVilla)
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


  return (
    <body>
      {orderDetail ? (
        <div>

          <div className="mb-8">
            <div className="mb-2">
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
                <hr/>
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
      ) : (
        <div>Loading...</div>
      )}
    </body>
  );
}
export default BodyInvoice;