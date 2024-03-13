import React, { Component } from 'react';
import { ORDER_HISTORY } from 'settings/constant';

export default class HeaderInvoice extends Component {
  render() {
    return (
      <div>
        <div className='text-center text-lg mb-10'>
          <div className='flex justify-center font-bold'>
            <p className='w-10'><img src="/images/check-circle-s-svgrepo-com.svg"/></p>
            <p className='m-4 '>ĐƠN CỦA BẠN ĐÃ ĐƯỢC ĐẶT ĐƠN THÀNH CÔNG</p>
          </div>
          <p>Hãy kiểm tra đơn hàng của bạn trong <a href={ORDER_HISTORY} className='text-cyan-700'>Lịch sử đơn hàng</a> của bạn.</p>
        </div>
        <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex items-center">
          {/* Assuming you have the logo saved in your project directory */}
          <div>
            <h2 className="text-lg font-bold">Công ty The Oasis Luxury Pte. Ltd.</h2>
            <p className="text-sm">Số 30 Đường Cecil</p>
            <p className="text-sm">Prudential Tower #19-08</p>
            <p className="text-sm">Singapore 049712</p>
            <p className="text-sm">Mã số thuế/GST: 200506877R</p>
          </div>
        </div>
        {/* Contact information on the right */}
        <div>
          <img  src="/images/logo-TOA.svg" title="The Oasis Luxury" className="h-40 mr-4" />
          <p className="text-lg">Điện thoại: +44 (0)20 3027 7900</p>
        </div>
      </div>
      </div>
    );
  }
}
