import React, { useContext, useEffect, useState } from 'react';
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


const ListingFilterPage = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const { villas } = useContext(VillaContext);
  const { searchQuery } = useSearch();

  // Lấy ra ID villas từ query string
  const queryParameters = new URLSearchParams(location.search);
  const villaIds = queryParameters.getAll('villas'); // 'villas' là tên tham số trong query string

  // Lọc villas dựa trên searchQuery và chỉ hiển thị những villas có trạng thái là "ACTIVE"
  // const filteredVillas = villas.filter(villa => {
  //   if(villaIds){
  //     villaIds.includes(villa._id)
  //   }
  //   const isActive = villa.status === "ACTIVE";
  //   const queryLower = searchQuery.toLowerCase();
  //   const matchesName = villa.villa_name.toLowerCase().includes(queryLower);
  //   const matchesAddress = villa.address.toLowerCase().includes(queryLower);

  //   return isActive && (matchesName || matchesAddress);
  // });
  const filteredVillas = villas.filter(villa => villaIds.includes(villa._id));
console.log('villaIds',villaIds);
  // Khi không tìm thấy villa nào khớp với ID, hiển thị tất cả villas
  const displayVillas = villaIds.length > 0 ? filteredVillas : villas;

  return (
    <Container fluid={true}>
      <SectionTitle title={<Heading content="Listing By Filter Villas" />} />
      <div className='flex flex-wrap justify-start'>
        {filteredVillas.length === 0 ? (
          <div>Không tìm thấy địa điểm hay tên Villa mà bạn muốn.</div>
        ) : (
          displayVillas.slice(0).map((villa) => (
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

export default ListingFilterPage;
