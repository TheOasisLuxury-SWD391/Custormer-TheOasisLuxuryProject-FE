import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MdLockOpen } from 'react-icons/md';
import { Input, Switch, Button, DatePicker } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { AuthContext } from 'context/AuthProvider';
import { FieldWrapper, SwitchWrapper, Label } from '../Auth.style';

const SignUpForm = () => {
  // const { signUp, isLoggedIn } = useContext(AuthContext);
  // const {
  //   control,
  //   watch,
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm({
  //   mode: 'onChange',
  // });
  const { handleRegister, isLoggedIn } = useContext(AuthContext); // Assuming handleRegister is your registration function
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
    };

    console.log('registerData',registerData);

    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return; // Prevent form submission
    }


    handleRegister(registerData); // Pass the adjusted data for registration
  };

  // if (isLoggedIn) {
  //   return <Navigate to="/" replace={true} />;
  // }




  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        label="Full Name"
        htmlFor="full_name"
      >
        <Controller
          name="full_name"
          control={control}
          defaultValue=""
          rules={{ required: true }} // Add validation rules as needed
          render={({ field }) => <Input {...field} />}
        />
      </FormControl>

      <FormControl
        label="Birthday"
        htmlFor="birthday"
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
      >
        <Controller
          name="phone_number"
          control={control}
          defaultValue=""
          rules={{ required: true }} // Add validation rules as needed
          render={({ field }) => <Input {...field} />}
        />
      </FormControl>

      {/* Username Field */}
      <FormControl label="Username" htmlFor="username">
        <Controller
          name="username"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <Input {...field} />}
        />
      </FormControl>

      {/* Email Field */}
      <FormControl label="Email" htmlFor="email">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          }}
          render={({ field }) => <Input type="email" {...field} />}
        />
      </FormControl>

      {/* Password Field */}
      <FormControl label="Password" htmlFor="password">
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 6, maxLength: 20 }}
          render={({ field }) => <Input.Password {...field} />}
        />
      </FormControl>

      {/* Confirm Password Field */}
      <FormControl label="Confirm password" htmlFor="confirmPassword">
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
      <FieldWrapper>
        <SwitchWrapper>
          <Controller
            name="rememberMe"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Switch {...field} />
            )}
          />
          <Label>Remember Me</Label>
        </SwitchWrapper>
        <SwitchWrapper>
          <Controller
            name="termsAndConditions"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Switch {...field} />
            )}
          />
          <Label>I agree with terms and conditions</Label>
        </SwitchWrapper>
      </FieldWrapper>
      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: '100%' }}
      >
        <MdLockOpen />
        Register
      </Button>
    </form>
  );
};

export default SignUpForm;
