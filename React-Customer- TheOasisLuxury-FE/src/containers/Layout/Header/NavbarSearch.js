import React, { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import MapAutoComplete from 'components/Map/MapAutoComplete';
import { setStateToUrl, getStateFromUrl } from 'library/helpers/url_handler';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import { LISTING_POSTS_PAGE } from 'settings/constant';
import { NavbarSearchWrapper } from './Header.style';
import { useSearch } from 'context/SearchContext';

export default function NavbarSearch() {
  let navigate = useNavigate();
  let location = useLocation();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
  };

  const handleSearch = () => {
    navigate(LISTING_POSTS_PAGE);
  };
 
  return (
    <NavbarSearchWrapper className="navbar_search">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Tìm kiếm tên villa hoặc địa điểm"
      />
      <button onClick={handleSearch} className='p-4'>
      <FiSearch />
      </button>
    </NavbarSearchWrapper>
  );
}
