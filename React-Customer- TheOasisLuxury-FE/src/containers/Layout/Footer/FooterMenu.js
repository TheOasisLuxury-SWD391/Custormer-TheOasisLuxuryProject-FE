import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';

import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  CONTACT_PAGE,
  POLICY_PAGE,
} from 'settings/constant';

const navigations = [
  {
    label: <NavLink to={`${HOME_PAGE}`}>Hotels</NavLink>,
    key: 'hotels',
  },
  {
    label: <NavLink to={`${LISTING_POSTS_PAGE}`}>Listing</NavLink>,
    key: 'listing',
  },
  {
    label: <NavLink to={`${CONTACT_PAGE}`}>Contact</NavLink>,
    key: 'contact',
  },
  {
    label: <NavLink to={`${POLICY_PAGE}`}>Policy</NavLink>,
    key: 'policy',
  },
  // {
  //   label: <NavLink to={`${AGENT_PROFILE_PAGE}`}>Agent</NavLink>,
  //   key: 'agent',
  // },
];

const FooterMenu = () => {
  return <Menu items={navigations} />;
};

export default FooterMenu;
