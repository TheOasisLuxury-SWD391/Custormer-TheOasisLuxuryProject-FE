import { Table } from 'antd';
import React, { Component } from 'react';

const  BodyInvoice = ({ customerData }) => {
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
        return (
            <body>
                <div className="mb-8">
                    <div className="mb-2">
                        <h3 className="text-lg font-bold">Thông Tin Người Đặt</h3>
                    </div>
                    <div className="bg-white p-4 shadow rounded">
                        <div className="mb-2"><strong>Họ tên người mua hàng:</strong> Phương</div>
                        <div className="mb-2"><strong>Địa chỉ:</strong> TP Hồ Chí Minh</div>
                        <div className="mb-2"><strong>Email:</strong> Phuong@gmail.com</div>
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
              <dt className="text-sm font-medium text-gray-500">Tên Khách Sạn</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Tên VIlla </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Thời Gian</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">12/03/2024</dd>
            </div>
            {/* Thêm các hàng khác tương tự với thông tin cần thiết */}
          </dl>
        </div>
        <div className="mt-4">
          <div className="flex float-right m-4">
            <div className=" mr-32">
              <h3 className="text-sm leading-6 font-medium text-gray-900">VAT (10%)</h3>
              <h3 className="text-lg leading-6 font-bold text-cyan-700">Tổng Cộng Tiền Thanh Toán</h3>
            </div>
            <div className="ml-4 ">
              <div className="text-sm leading-6 font-medium text-gray-90 text-right">VND: 0</div>
              <div className="text-lg leading-6 font-medium text-cyan-700 text-right">VND: 1,300,000 (USD 60)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
                </div>
            </body>
        );
    }
export default BodyInvoice;