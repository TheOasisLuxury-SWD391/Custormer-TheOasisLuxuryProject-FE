import React, { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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


  const handleLogin = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        // Set token in local storage or state
        // children.setIsLoggedIn(true);
        setIsLoggedIn(true);
        const accessToken = data.result.access_token; // Trích xuất access_token
        const userId = data.result.user_id;
        localStorage.setItem('token', accessToken); // Lưu token vào localStorage
        setUser({ user_id: userId });
        console.log('Login successful');
        if (rememberMe) {
          // Save credentials to local storage
          localStorage.setItem('savedUserName', loginData.user_name);
          localStorage.setItem('savedPassword', loginData.password);
        } else {
          // Clear saved credentials if "Remember Me" is not checked
          localStorage.removeItem('savedUserName');
          localStorage.removeItem('savedPassword');
        }

      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
        setIsLoggedIn(true);
        // Lưu trữ token vào localStorage
        localStorage.setItem('token', data.result.access_token);
        localStorage.setItem('refresh_token', data.result.refresh_token);
        navigate('/');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
        setIsLoggedIn, // Provide setIsLoggedIn to update login state
        setLoginData, // Optional: If you want to allow updating loginData from consumer components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
