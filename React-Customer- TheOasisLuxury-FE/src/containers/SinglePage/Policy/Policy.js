import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const Policy = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chính Sách Mua Timeshare Villa tại The Oasis Luxury</h1>
      <Collapse accordion>
        <Panel header="1. Điều Kiện Mua Bán" key="1">
          <p><strong>Đối Tượng Áp Dụng:</strong> Chính sách này áp dụng cho tất cả khách hàng (cá nhân hoặc tổ chức) có nhu cầu mua Timeshare Villa tại The Oasis Luxury</p>
          <p><strong>Thời Hạn Sở Hữu:</strong> Thời hạn sở hữu timeshare có thể dao động từ 1 đến 52 tuần, tùy vào gói dịch vụ mà khách hàng lựa chọn.</p>
          <p><strong>Pháp Lý:</strong> Khách hàng phải đáp ứng đầy đủ các yêu cầu pháp lý và điều kiện sở hữu bất động sản tại địa phương.</p>
        </Panel>
        <Panel header="2. Quy Trình Thanh Toán" key="2">
          <p><strong>Thanh Toán Trong Ngày:</strong> Tất cả giao dịch mua Timeshare Villa phải được thanh toán đầy đủ trong vòng 24 giờ kể từ thời điểm đặt cọc hoặc xác nhận đơn hàng.</p>
          {/* Các mục tiếp theo tương tự */}
        </Panel>
        {/* Thêm các Panel khác tương tự cho mỗi phần của chính sách */}
      </Collapse>
    </div>
  );
};

export default Policy;
