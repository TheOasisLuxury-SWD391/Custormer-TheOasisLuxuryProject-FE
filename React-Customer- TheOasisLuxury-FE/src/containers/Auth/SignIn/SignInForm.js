import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FORGET_PASSWORD_PAGE } from 'settings/constant';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';

export default function SignInForm() {
  const { handleLogin, isLoggedIn } = useContext(AuthContext);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    handleLogin(data); 
  };
  if (isLoggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        label="Tên đăng nhập" // Đã được thay đổi từ Email sang Tên đăng nhập
        htmlFor="user_name" // Đã thay đổi htmlFor và name
        error={
          errors.user_name && ( // Đã thay đổi từ errors.email sang errors.user_name
            <>
              {errors.user_name?.type === 'required' && (
                <span>Trường này là bắt buộc!</span>
              )}
            </>
          )
        }
      >
         <Controller
          name="user_name" // Đã thay đổi từ email sang user_name
          defaultValue=""
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              type="text"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </FormControl>
      <FormControl
        label="Password"
        htmlFor="password"
        error={
          errors.password && (
            <>
              {errors.password?.type === 'required' && (
                <span>Trường này là bắt buộc!</span>
              )}
              {errors.password?.type === 'minLength' && (
                <span>Mật khẩu phải có ít nhất 6 ký tự!</span>
              )}
              {errors.password?.type === 'maxLength' && (
                <span>Mật khẩu không được dài quá 20 ký tự!</span>
              )}
            </>
          )
        }
      >
        <Controller
          name="password"
          defaultValue=""
          control={control}
          rules={{ required: true, minLength: 6, maxLength: 20 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input.Password onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />
      </FormControl>
      <FieldWrapper>
        <SwitchWrapper>
          <Controller
            control={control}
            name="rememberMe"
            valueName="checked"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch onChange={onChange} checked={value} />
            )}
          />
          <Label>Nhớ mật khẩu</Label>
        </SwitchWrapper>
        <Link to={FORGET_PASSWORD_PAGE}>Quên mật khẩu ?</Link>
      </FieldWrapper>
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
      >
        <MdLockOpen />
        Đăng nhập
      </Button>
    </form>
  );
}
