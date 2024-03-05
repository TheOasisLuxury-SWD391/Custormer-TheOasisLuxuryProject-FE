import React, { Component } from 'react';

export default class HeaderInvoice extends Component {
  render() {
    return (
        <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex items-center">
          {/* Assuming you have the logo saved in your project directory */}
          <div>
            <h2 className="text-lg font-bold">Công ty Agoda Company Pte. Ltd.</h2>
            <p className="text-sm">Số 30 Đường Cecil</p>
            <p className="text-sm">Prudential Tower #19-08</p>
            <p className="text-sm">Singapore 049712</p>
            <p className="text-sm">Mã số thuế/GST: 200506877R</p>
          </div>
        </div>
        {/* Contact information on the right */}
        <div>
          <img src="/path-to-your-logo.png" alt="Company Logo" className="h-12 mr-4" />
          <p className="text-lg">Điện thoại: +44 (0)20 3027 7900</p>
        </div>
      </div>
    );
  }
}
