import React, { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd';
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

  useEffect(() => {
    const savedUserName = localStorage.getItem('savedUserName');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUserName && savedPassword) {
      setLoginData({ user_name: savedUserName, password: savedPassword });
      setRememberMe(true);
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
        const errorMessage = errorData.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
        message.error('Đăng nhập thất bại');
        console.error('Đăng nhập thất bại');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau!');
      console.error('Lỗi trong quá trình đăng nhập:', error);
    }
  };
  

  const handleRegister = async (registerData) => {
    try {
      // Bạn có thể cần điều chỉnh dữ liệu gửi đi cho phù hợp
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
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful');
        message.success('Registration successful');
        setIsLoggedIn(true);
        // Lưu trữ token vào localStorage
        localStorage.setItem('token', data.result.access_token);
        localStorage.setItem('refresh_token', data.result.refresh_token);
        navigate('/');
      } else {
        console.error('Registration failed');
        message.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      message.error('Registration failed');
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser({});
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
        setIsLoggedIn, // Provide setIsLoggedIn to update login state
        setLoginData, // Optional: If you want to allow updating loginData from consumer components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
