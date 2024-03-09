import React, { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import ToastMessage from 'components/UI/ToastMessage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  let navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user_name: '', password: '' });
  const [registerData, setRegisterData] = useState({
    user_name: '',
    role_name: '',
    birthday: '',
    phone_number: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [user, setUser] = useState({});
  const [toast, setToast] = useState({ type: null, message: null });


  useEffect(() => {
    const savedUserName = localStorage.getItem('savedUserName');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUserName && savedPassword) {
      setLoginData({ user_name: savedUserName, password: savedPassword });
      setRememberMe(true);
    }
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
    console.log("Remember Me state:", event.target.checked); // Debugging
  };


 const handleLogin = async (data, rememberMe) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const { access_token: accessToken, user_id: userId } = responseData.result;
  
        // Lưu token vào localStorage
        localStorage.setItem('token', accessToken);
        setUser({ user_id: userId });
        setIsLoggedIn(true);
  
        if (rememberMe) {
          // Lưu tên đăng nhập và mật khẩu vào localStorage nếu người dùng chọn "Nhớ mật khẩu"
          localStorage.setItem('savedUserName', data.user_name);
          localStorage.setItem('savedPassword', data.password);
        } else {
          // Xóa tên đăng nhập và mật khẩu khỏi localStorage nếu người dùng không chọn "Nhớ mật khẩu"
          localStorage.removeItem('savedUserName');
          localStorage.removeItem('savedPassword');
        }
  
        console.log('Đăng nhập thành công');
        message.success('Đăng nhập thành công');
      } else {
      
        const errorData = await response.json(); // Lấy thông tin lỗi từ phản hồi
        message.error('Username hoặc Password không đúng. Vui lòng thử lại!');
        console.error('Đăng nhập thất bại');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau!');
      console.error('Lỗi trong quá trình đăng nhập:', error);
    }
  };
  

  const handleRegister = async (registerData) => {
    try {
      const registerPayload = {
        full_name: registerData.full_name,
        birthday: registerData.birthday,
        phone_number: registerData.phone_number,
        user_name: registerData.user_name,
        email: registerData.email,
        password: registerData.password,
        confirm_password: registerData.confirm_password,
      };
  
      const response = await fetch('http://localhost:5000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPayload),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful');
        setToast({ type: 'success', message: 'Register success' });
        setIsLoggedIn(true);
        localStorage.setItem('token', data.result.access_token);
        localStorage.setItem('refresh_token', data.result.refresh_token);
        navigate('/');
      } else {
        console.error('Registration failed');
        // Xử lý và hiển thị lỗi chi tiết từ API
        const errorMessages = Object.values(data.errors).join(', ');
          setToast({ type: 'error', message: errorMessages });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Error during registration' });
      console.error('Error during registration:', error);
    }
  };
  

  const getUserInfo = async (userId) => {
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Sử dụng token cho việc xác thực
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User info:', data);
        return data;
        // Cập nhật thông tin người dùng vào state nếu cần
      } else {
        console.error('Failed to fetch user info');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const updateUserInfo = async (userId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User info updated:', data);
        // Cập nhật state hoặc thực hiện hành động tiếp theo nếu cần
      } else {
        console.error('Failed to update user info:', data.message);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };
  
  
  const changePassWord = async (userId, oldPassword, newPassword, confirmPassword) => {
    try {
      const token = localStorage.getItem('token');
      
      const reqBody = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      };
  
      const response = await fetch(`http://localhost:5000/api/v1/users/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Password changed successfully:', data);
        return data;
        // You may want to update the user information in your state if needed.
      } else {
        console.error('Failed to change password');
        return null;
      }
    } catch (error) {
      console.error('Error changing password:', error);
      return null;
    }
  };
  

  const logOut = () => {
    localStorage.removeItem('token');  // Make sure this matches the key you use when setting the token
    setIsLoggedIn(false);
    navigate('/login');
  };


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logOut,
        handleLogin,
        handleRegister,
        user,
        updateUserInfo,
        getUserInfo,
        changePassWord,
        setIsLoggedIn,
        setLoginData,
      }}
    >
      {toast.message && <ToastMessage type={toast.type} content={toast.message} />}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
