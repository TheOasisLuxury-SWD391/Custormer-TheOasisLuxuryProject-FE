import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button, DatePicker } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';

const SignUpForm = () => {

  const { handleRegister } = useContext(AuthContext); // Assuming handleRegister is your registration function
  const { control, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = data => {
    
    // Adjust data structure if necessary before sending to handleRegister
    const registerData = {
      ...data,
      birthday: data.birthday ? data.birthday.format('YYYY-MM-DD')  : null,
      user_name: data.username, // Assuming the API expects user_name instead of username
      confirm_password: data.confirmPassword,
      phone_number: data.phone_number,
      email: data.email,
    };

    console.log('registerData',registerData);

    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return; // Prevent form submission
    }

    handleRegister(registerData); // Pass the adjusted data for registration
  };





  return (
    <form onSubmit={handleSubmit(onSubmit)}>
       <FormControl
        label="Full Name"
        htmlFor="full_name"
        error={errors.full_name && "Vui lòng nhập họ tên của bạn"}
      >
        <Controller
          name="full_name"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <Input {...field} />}
        />
      </FormControl>

      <FormControl
        label="Birthday"
        htmlFor="birthday"
        error={errors.birthday && "Vui lòng nhập ngày sinh của bạn"}
      >
        <Controller
          name="birthday"
          control={control}
          rules={{ required: true }} // Add validation rules as needed
          render={({ field }) => <DatePicker {...field} />}
        />
      </FormControl>

      <FormControl
        label="Phone Number"
        htmlFor="phone_number"
        error={errors.phone_number && "Vui lòng nhập số điện thoại của bạn"}
      >
        <Controller
          name="phone_number"
          control={control}
          defaultValue=""
          rules={{ 
            required: true,
            pattern: {
              value: /^0\d{9}$/, // Bắt đầu bằng số 0 và có 11 chữ số
              message: "Số điện thoại không hợp lệ",
            }
          }}  // Add validation rules as needed
          render={({ field }) => <Input {...field} />}
        />
      </FormControl>

      {/* Username Field */}
      <FormControl 
        label="Username" 
        htmlFor="username" 
        error={errors.username && "Username phải bao gồm ít nhất 1 chữ và 1 số"}
        >
        <Controller
          name="username"
          control={control}
          defaultValue=""
          rules={{ 
            required: true,
            minLength: {
              value: 8,
              message: "Username phải có ít nhất 8 ký tự",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Ít nhất 8 ký tự bao gồm chữ và số
              message: "Username phải bao gồm ít nhất 1 chữ và 1 số",
            }
          }} 
          render={({ field }) => <Input {...field} />}
        />
      </FormControl>

      {/* Email Field */}
      <FormControl label="Email" htmlFor="email" error={errors.email && "Vui lòng nhập email của bạn"} >
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            message: "Vui lòng nhập đúng email của bạn",
          }}
          render={({ field }) => <Input type="email" {...field} />}
        />
      </FormControl>

      {/* Password Field */}
      <FormControl label="Password" htmlFor="password" error={errors.password && "Vui lòng nhập password của bạn"}>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 6, maxLength: 20 }}
          render={({ field }) => <Input.Password {...field} />}
        />
      </FormControl>

      {/* Confirm Password Field */}
      <FormControl label="Confirm password" htmlFor="confirmPassword" >
        <Controller  
          name="confirmPassword"
          control={control}
          defaultValue=""
          rules={{ required: true,
            validate: value => value === password || "Passwords do not match" }}
          render={({ field }) => <Input.Password {...field} />}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </FormControl>
      

      
      {/* Nút Đăng ký */}
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
        // disabled={!termsAccepted} // Disable nút khi chưa đồng ý điều khoản
      >
        <MdLockOpen />
        Register
      </Button>
    </form>
  );
};

export default SignUpForm;
