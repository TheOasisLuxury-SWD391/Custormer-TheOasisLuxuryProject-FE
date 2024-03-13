import React, { useCallback, useContext, useEffect, useState } from 'react';
import Heading from 'components/UI/Heading/Heading';
import TextLink from 'components/UI/TextLink/TextLink';
import Container from 'components/UI/Container/Container';
import { PostPlaceholder } from 'components/UI/ContentLoader/ContentLoader';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import SectionTitle from 'components/SectionTitle/SectionTitle';
import useWindowSize from 'library/hooks/useWindowSize';
import useDataApi from 'library/hooks/useDataApi';
import { LISTING_POSTS_PAGE, SINGLE_POST_PAGE } from 'settings/constant';
import PostGrid from 'components/ProductCard/ProductCard';
import { VillaContext } from 'context/VillaContext';
import { useSearch } from 'context/SearchContext';
import { useLocation } from 'react-router-dom';
import { NavbarSearchWrapper } from 'containers/Layout/Header/Header.style';
import { FiSearch } from 'react-icons/fi';


const ListingPage = ({subdivisions }) => {
  const location = useLocation();
  const { width } = useWindowSize();
  const { villas } = useContext(VillaContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVillas, setFilteredVillas] = useState([]);
 
  // Lấy ra ID villas từ query string
  const queryParameters = new URLSearchParams(location.search);
  const villaIds = queryParameters.getAll('villas'); // 'villas' là tên tham số trong query string

  // Lọc villas dựa trên searchQuery và chỉ hiển thị những villas có trạng thái là "ACTIVE"
  useEffect(() => {
    // Lọc villas dựa trên thông tin tìm kiếm
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = subdivisions
      .flatMap(subdivision => subdivision.villas) // Lấy tất cả các villa từ các subdivisions
      .filter(villa => {
        const isActive = villa.status === "ACTIVE";
        const matchesName = villa.villa_name.toLowerCase().includes(lowerCaseQuery);
        const matchesAddress = villa.address.toLowerCase().includes(lowerCaseQuery);
        return isActive && (matchesName || matchesAddress);
      });
    setFilteredVillas(filtered);
  }, [searchQuery, subdivisions]);

 

  const handleSearch = () => {
    alert('Thực hiện tìm kiếm: ' + searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

 

  return (
    <Container fluid={true}>
      <SectionTitle title={<Heading content="Listing Villas" />} />
      <NavbarSearchWrapper className="navbar_search">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Tìm kiếm tên villa hoặc địa điểm"
      />
      <button onClick={handleSearch} className='p-4'>
      <FiSearch />
      </button>
    </NavbarSearchWrapper>


      <div className='flex flex-wrap justify-start'>
        {filteredVillas.length === 0 ? (
          <div>Không tìm thấy địa điểm hay tên Villa mà bạn muốn.</div>
        ) : (
          filteredVillas.slice(0).map((villa) => (
            <PostGrid
              key={villa._id}
              title={villa.villa_name}
              rating={4.5}
              location={{ formattedAddress: villa.address }}
              price={villa.stiff_price}
              ratingCount={10}
              gallery={villa.url_image}
              slug={villa._id}
              link="/villas"
            />
          ))
        )}
      </div>
    </Container>
  );
};

export default ListingPage;
