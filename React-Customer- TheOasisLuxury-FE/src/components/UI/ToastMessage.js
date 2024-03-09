import { useEffect } from 'react';
import { message } from 'antd';

const ToastMessage = ({ type, content }) => {

    const messageMap = {
        'Validation error': 'Lỗi xác thực',
        'Name is required': 'Tên là bắt buộc',
        'Name must be a string': 'Tên phải là một chuỗi',
        'Name length must be from 1 to 100': 'Độ dài tên phải từ 1 đến 100',
        'Email is required': 'Email là bắt buộc',
        'Email is invalid': 'Email không hợp lệ',
        'Email already exists': 'Email đã tồn tại',
        'Password is required': 'Mật khẩu là bắt buộc',
        'Password must be a string': 'Mật khẩu phải là một chuỗi',
        'Password length must be from 8 to 100': 'Độ dài mật khẩu phải từ 8 đến 100',
        'Confirm password is required': 'Xác nhận mật khẩu là bắt buộc',
        'Confirm password must be a string': 'Xác nhận mật khẩu phải là một chuỗi',
        'Confirm password length must be from 8 to 100': 'Độ dài xác nhận mật khẩu phải từ 8 đến 100',
        'Confirm password is incorrect': 'Xác nhận mật khẩu không chính xác',
        'Date of birth is required': 'Ngày sinh là bắt buộc',
        'Date of birth is invalid': 'Ngày sinh không hợp lệ',
        'Password length must be from 8 to 50': 'Độ dài mật khẩu phải từ 8 đến 50',
        'Password must be strong': 'Mật khẩu phải đủ mạnh',
        'Confirm password length must be from 8 to 50': 'Độ dài xác nhận mật khẩu phải từ 8 đến 50',
        'Confirm password must be strong': 'Xác nhận mật khẩu phải đủ mạnh',
        'Confirm password must be the same as password': 'Xác nhận mật khẩu phải giống với mật khẩu',
        'Date of birth be ISO8601': 'Ngày sinh phải theo định dạng ISO8601',
        'Register success': 'Đăng ký thành công',
        'Get user by id success': 'Lấy thông tin người dùng bằng ID thành công',
        'User name or password is incorrect': 'Tên người dùng hoặc mật khẩu không chính xác',
        'Login success': 'Đăng nhập thành công',
        'User name is required': 'Tên người dùng là bắt buộc',
        'Update user success': 'Cập nhật người dùng thành công',
        'Access token is required': 'Token truy cập là bắt buộc',
        'Used refresh token or not exist': 'Token làm mới đã được sử dụng hoặc không tồn tại',
        'Logout success': 'Đăng xuất thành công',
        'Create account success': 'Tạo tài khoản thành công',
        'Update account success': 'Cập nhật tài khoản thành công',
        'Get account success': 'Lấy thông tin tài khoản thành công',
        'Delete account success': 'Xóa tài khoản thành công',
        'Delete account fail': 'Xóa tài khoản thất bại',
        'Phone number is required': 'Số điện thoại là bắt buộc',
        'Phone number is invalid': 'Số điện thoại không hợp lệ',
        'User not found': 'Không tìm thấy người dùng',
        'User not access': 'Người dùng không có quyền truy cập',
        'Email verify token is required': 'Token xác minh email là bắt buộc',
        'User banned': 'Người dùng đã bị cấm',
        'Email verify token is not match': 'Token xác minh email không khớp',
        'Email already verified before': 'Email đã được xác minh trước đó',
        'Email verify success': 'Xác minh email thành công',
        'Resend email verify success': 'Gửi lại email xác minh thành công',
        'Check email to reset password': 'Kiểm tra email để đặt lại mật khẩu',
        'Verify forgot password token success': 'Xác minh token quên mật khẩu thành công',
        'Forgot password token is required': 'Token quên mật khẩu là bắt buộc',
        'Invalid forgot password token': 'Token quên mật khẩu không hợp lệ',
        'Reset password success': 'Đặt lại mật khẩu thành công',
        'Refresh token success': 'Làm mới token thành công',
        'Order success': 'Đặt hàng thành công',
        'Confirm payment success': 'Xác nhận thanh toán thành công',
        'Create blog success': 'Tạo blog thành công',
        'User id is required': 'ID người dùng là bắt buộc',
        'User id must be a string': 'ID người dùng phải là một chuỗi',
        'Villa time share id is required': 'ID chia sẻ thời gian biệt thự là bắt buộc',
        'Villa time share id must be a string': 'ID chia sẻ thời gian biệt thự phải là một chuỗi',
        'Price is required': 'Giá là bắt buộc',
        'Price must be a number': 'Giá phải là một số',
        'Description is required': 'Mô tả là bắt buộc',
        'Payment type is required': 'Loại thanh toán là bắt buộc',
        'Payment type must be a string': 'Loại thanh toán phải là một chuỗi',
        'Payment type is invalid': 'Loại thanh toán không hợp lệ',
        'Order id is required': 'ID đơn hàng là bắt buộc',
        'Order id must be a string': 'ID đơn hàng phải là một chuỗi',
        'Currency is required': 'Tiền tệ là bắt buộc',
        'Currency must be a string': 'Tiền tệ phải là một chuỗi',
        'Amount is required': 'Số tiền là bắt buộc',
        'Amount must be a number': 'Số tiền phải là một số',
        'Payment id is required': 'ID thanh toán là bắt buộc',
        'Payment id must be a string': 'ID thanh toán phải là một chuỗi',
        'Title is required': 'Tiêu đề là bắt buộc',
        'Title must be a string': 'Tiêu đề phải là một chuỗi',
        'Description detail is required': 'Chi tiết mô tả là bắt buộc',
        'Description detail must be a string': 'Chi tiết mô tả phải là một chuỗi',
        'Contract name is required': 'Tên hợp đồng là bắt buộc',
        'Contract name must be a string': 'Tên hợp đồng phải là một chuỗi',
        'Url image is required': 'URL hình ảnh là bắt buộc',
        'Url image must be a string': 'URL hình ảnh phải là một chuỗi',
        'Get all order success': 'Lấy tất cả đơn hàng thành công',
        'Update or+der success': 'Cập nhật đơn hàng thành công',
        'Upload success': 'Tải lên thành công',
        'Cannot delete admin account': 'Không thể xóa tài khoản quản trị',
        'Get all contract success': 'Lấy tất cả hợp đồng thành công',
        'Get all blog post success': 'Lấy tất cả bài viết blog thành công',
        'Status is required': 'Trạng thái là bắt buộc',
        'Status is wrong type and must be in [PENDING, APPROVED, REJECTED]': 'Trạng thái không đúng và phải nằm trong [PENDING, APPROVED, REJECTED]',
        'Status must be a string': 'Trạng thái phải là một chuỗi',
        'Get user own villa success': 'Lấy biệt thự của người dùng thành công',
        // Thêm các dòng dịch tương tự cho các thông điệp trong PROJECTS_MESSAGES, SUBDIVISION_MESSAGES, VILLAS_MESSAGES, và UTILITIES_MESSAGES
      };
      
      
  useEffect(() => {
    if (type && content) {
      const displayContent = messageMap[content] || content; // Nếu không tìm thấy ánh xạ, hiển thị content gốc

      if (type === 'success') {
        message.success(displayContent);
      } else if (type === 'error') {
        message.error(displayContent);
      }
    }
  }, [type, content]);

  return null;
};

export default ToastMessage;
