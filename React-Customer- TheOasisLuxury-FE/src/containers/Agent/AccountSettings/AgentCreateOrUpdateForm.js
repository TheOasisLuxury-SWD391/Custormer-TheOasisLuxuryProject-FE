import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Input, Select, Button, DatePicker } from 'antd';
import FormControl from 'components/UI/FormControl/FormControl';
// import DatePicker from 'components/UI/AntdDatePicker/AntdDatePicker';
import { FormTitle } from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';
import moment from 'moment';


const AgentCreateOrUpdateForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  console.log('userInfo', userInfo);
  
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const { user, getUserInfo, updateUserInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserInfo(user.user_id);
      console.log('userData', userData);
      if (userData) {
        setUserInfo(userData); // Cập nhật state với thông tin người dùng
        reset(userData); // Cập nhật form với thông tin người dùng
      }
    };

    if (user.user_id) {
      fetchUserData();
    }
  }, [user.user_id, reset, getUserInfo]);


  const onSubmit = async (data) => {
    console.log(data);
    // Thực hiện PATCH request để cập nhật thông tin người dùng tại đây
    await updateUserInfo(user.user_id, data).then(() => {
      // Giả sử updateUserInfo trả về dữ liệu người dùng đã cập nhật
      // Điều này phụ thuộc vào cách bạn cài đặt API và hàm updateUserInfo
      setUserInfo({ ...userInfo, user: { ...userInfo.user, ...data } });
      reset({ ...userInfo.user, ...data });
      setIsEditing(false);
    }).catch(error => {
      console.error('Failed to update user info', error);
      // Xử lý lỗi ở đây
    });
  };

  const onEditClick = () => {
    setIsEditing(true);
  };

  const onCancelClick = () => {
    setIsEditing(false);
    reset(userInfo);
  };

  return (
    <Fragment>
      <FormTitle>Basic Information</FormTitle>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        {/* Các trường của form */}
        {isEditing ? (
          // {/* // Hiển thị các trường input để chỉnh sửa */}
          <div>
            <Row gutter={30}>
              <Col lg={12} xs={24}>
                <FormControl
                  label="Full name"
                  htmlFor="full_name"
                  error={errors.full_name && <span>This field is required!</span>}
                >
                  <Controller
                    name="full_name"
                    defaultValue={userInfo.user?.full_name || ''}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input {...field} />
                    )}
                  />
                </FormControl>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col lg={12} xs={24}>
                <FormControl
                  label="Email"
                  htmlFor="email"
                  error={errors.email && <span>This field is required!</span>}
                >
                  <Controller
                    name="email"
                    defaultValue={userInfo.user?.email || ''}
                    control={control}
                    rules={{ required: true, pattern: /^\S+@\S+$/i }}
                    render={({ field }) => (
                      <Input {...field} />
                    )}
                  />
                </FormControl>
              </Col>
              <Col lg={12} xs={24}>
                <FormControl
                  label="Phone Number"
                  htmlFor="phone_number"
                  error={errors.phone_number && <span>This field is required!</span>}
                >
                  <Controller
                    name="phone_number"
                    defaultValue={userInfo.user?.phone_number || ''}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input {...field} />
                    )}
                  />
                </FormControl>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col lg={12} xs={24}>
                <FormControl
                  label="Birthday"
                  htmlFor="birthday"
                  error={errors.birthday && <span>This field is required!</span>}
                >
                  <Controller
                    name="birthday"
                    defaultValue={userInfo.user?.birthday || ''}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker onChange={(date, dateString) => field.onChange(dateString)} onBlur={field.onBlur} value={field.value ? moment(field.value) : null} />
                    )}
                  />
                </FormControl>
              </Col>
              <Col lg={12} xs={24}>
                <FormControl
                  label="Gender"
                  htmlFor="gender"
                  error={errors.gender && <span>This field is required!</span>}
                >
                  <Controller
                    name="gender"
                    defaultValue={userInfo.user?.gender || ''}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} onChange={value => field.onChange(value)}>
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                      </Select>
                    )}
                  />
                </FormControl>
              </Col>
            </Row>

          </div>
        ) : (
          // Hiển thị thông tin người dùng mà không có input, chỉ có text
          <Fragment>
            <Row gutter={30}>
              <Col span={24}>
                <p>Full Name: {userInfo.user?.full_name}</p>
                <p>User Name: {userInfo.user?.user_name}</p>
                <p>Email: {userInfo.user?.email}</p>
                <p>Phone Number: {userInfo.user?.phone_number}</p>
                <p>Birthday: {userInfo.user?.birthday}</p>
                <p>Gender: {userInfo.user?.gender}</p>
                {/* Hiển thị thêm các thông tin khác tương tự */}
              </Col>
            </Row>
          </Fragment>
        )}
        <div className="submit-container">
          {isEditing ? (
            <div className="submit-container">
              <Button htmlType="submit" type="primary">Save Changes</Button>
              <Button htmlType="submit" type="primary" onClick={onCancelClick} style={{ marginLeft: '10px' }}>Cancel</Button>
            </div>
          ) : (
            <Button htmlType="submit" type="primary" onClick={onEditClick}>Edit Profile</Button>
          )}
        </div>
      </form>


    </Fragment>
  );
};

export default AgentCreateOrUpdateForm;
