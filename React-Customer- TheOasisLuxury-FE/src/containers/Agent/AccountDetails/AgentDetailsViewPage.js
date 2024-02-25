import React, { useContext, Fragment , useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoIosAdd,
} from 'react-icons/io';
import { Menu, Popover } from 'antd';
import Container from 'components/UI/Container/Container';
import Image from 'components/UI/Image/Image';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import { ProfilePicLoader } from 'components/UI/ContentLoader/ContentLoader';
import Loader from 'components/Loader/Loader';
import AuthProvider, { AuthContext } from 'context/AuthProvider';
import useDataApi from 'library/hooks/useDataApi';
import {
  ADD_HOTEL_PAGE,
  AGENT_PROFILE_PAGE,
  AGENT_PROFILE_FAVORITE,
  AGENT_PROFILE_CONTACT,
} from 'settings/constant';
import AgentDetailsPage, {
  BannerSection,
  UserInfoArea,
  ProfileImage,
  ProfileInformationArea,
  ProfileInformation,
  SocialAccount,
  NavigationArea,
} from './AgentDetails.style';

const ProfileNavigation = (props) => {
  const { path, className } = props;
  const { loggedIn } = useContext(AuthContext);

  // const navigations = [
  //   { label: <NavLink to={path}>Listing</NavLink>, key: 'listing' },
  //   {
  //     label: <NavLink to={AGENT_PROFILE_FAVORITE}>Favorite</NavLink>,
  //     key: 'favorite',
  //   },
  //   {
  //     label: <NavLink to={AGENT_PROFILE_CONTACT}>Contact</NavLink>,
  //     key: 'contact',
  //   },
  // ];

  return (
    <NavigationArea>
      <Container fluid={true}>
        {/* <Menu className={className} items={navigations} /> */}
        {loggedIn && (
          <Link className="add_card" to={ADD_HOTEL_PAGE}>
            <IoIosAdd /> Add Hotel
          </Link>
        )}
      </Container>
    </NavigationArea>
  );
};

const AgentProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(AuthContext); 

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Lấy user_id từ localStorage

      if (!userId) {
        console.error("User ID is not available in localStorage.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data:', data);
        setUser(data.result); // Lưu thông tin người dùng vào state
        setLoading(false);
      } else {
        console.error("Failed to fetch user data:", response.status);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
  const ProfileInformation = () => {
    return (
      <Fragment>
        <div className="profile-info mt-40">
          <table>
            <tbody>
              <tr>
                <td><strong>Fullname:</strong></td>
                <td>{user ? user.full_name : 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{user ? user.email : 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Birthday:</strong></td>
                <td>{user ? user.birthday : 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Phone Number:</strong></td>
                <td>{user ? user.phone_number : 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Gender:</strong></td>
                <td>{user ? user.gender : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  };
  

  

  return (
    <Fragment>
      {loading ? (
        <Loader /> 
      ) : (
        <UserInfoArea>
          <Container fluid={true}>
            <AuthContext.Provider value={{ isLoggedIn }}>
              <ProfileInformationArea>
                <ProfileInformation user={user} />
              </ProfileInformationArea>
            </AuthContext.Provider>
          </Container>
        </UserInfoArea>
      )}
    </Fragment>
  );
};


export default function AgentDetailsViewPage(props) {
  return (
    <AgentDetailsPage>
      <AuthProvider>
        <AgentProfileInfo />
        <ProfileNavigation path={AGENT_PROFILE_PAGE} {...props} />
        <Container fluid={true}>
          {/* <Outlet /> */}
        </Container>
      </AuthProvider>
    </AgentDetailsPage>
  );
}
