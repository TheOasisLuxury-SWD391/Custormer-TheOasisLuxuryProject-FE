import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Row, Col } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
import { FormTitle } from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';
import { ToastContainer, toast } from 'react-toast';
import 'react-toastify/dist/ReactToastify.css';
const usePasswordChange = () => {
  const { user, getUserInfo, changePassWord } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      console.log('Submitting password change request...');
      console.log('User ID:', user.user_id);
      console.log('Data:', data);

      const result = await changePassWord(user.user_id, data.oldPassword, data.newPassword, data.confirmPassword);
      
      console.log('Result:', result);

      if (result) {
        console.log('Password changed successfully!');
        toast.success("Password changed successfully!");
      } else {
        console.error('Failed to change password');
        toast.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      
    }
  };

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserInfo(user.user_id);
        console.log('User Data:', userData);

        if (userData) {
          setUserInfo(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally, you can display an error message to the user
      }
    };

    if (user.user_id) {
      fetchUserData();
    }
  }, [user.user_id, getUserInfo]);

  return { onSubmit, userInfo };
};

export default function ChangePassWord() {
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  
  const { onSubmit, userInfo } = usePasswordChange();

  return (
    <>
      <FormTitle>Change Password</FormTitle>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={30}>
          <Col lg={12} xs={24}>
            <FormControl
              label="Enter old password"
              htmlFor="oldPassword"
              error={errors.oldPassword && <span>This field is required!</span>}
            >
              <Controller
                name="oldPassword"
                defaultValue=""
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={12} xs={24}>
            <FormControl
              label="Enter new password"
              htmlFor="newPassword"
              error={
                errors.newPassword && (
                  <>
                    {errors.newPassword?.type === 'required' && (
                      <span>This field is required!</span>
                    )}
                    {errors.newPassword?.type === 'minLength' && (
                      <span>New password must be at lest 6 characters!</span>
                    )}
                    {errors.newPassword?.type === 'maxLength' && (
                      <span>
                        New password must not be longer than 20 characters!
                      </span>
                    )}
                  </>
                )
              }
            >
              <Controller
                name="newPassword"
                defaultValue=""
                control={control}
                rules={{ required: true, minLength: 6, maxLength: 20 }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={24} xs={24}>
            <FormControl
              label="Confirm new password"
              htmlFor="confirmPassword"
              error={
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <span>Confirm password must be the same!</span>
                )
              }
            >
              <Controller
                name="confirmPassword"
                defaultValue=""
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input.Password
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </FormControl>
          </Col>
          <Col lg={24}>
            <div className="submit-container">
              <Button htmlType="submit" type="primary">
                Save Changes
              </Button>
            </div>
          </Col>
        </Row>
      </form>
      <ToastContainer/>
    </>
  );
}
