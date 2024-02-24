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


const TopVillasGrid = () => {
  // const [villas, setVillas] = useState([]);
  const { width } = useWindowSize();
  const { villas } = useContext(VillaContext); 

  // Adjusting the limit based on screen width, similar to your existing logic
  let limit = 10;
  if (width <= 767) {
    limit = 4;
  } else if (width >= 768 && width < 992) {
    limit = 6;
  } else if (width >= 992 && width < 1200) {
    limit = 8;
  } else if (width >= 1200) {
    limit = 10;
  }

  const displayedVillas = villas.slice(0, limit);

  return (
    <Container fluid={true}>
     <SectionTitle title={<Heading content="Top Villas" />} />
     {villas.length === 0 ? (
        <div>Loading...</div> // Show loading only if villas are empty
      ) : (
        displayedVillas.map((villa) => (
          <PostGrid
            key={villa._id}
            title={villa.villa_name}
            rating={4.5} // Assuming rating is not part of the villa data; adjust as necessary
            location={{ formattedAddress: villa.address }} // Adjust according to your data structure
            price={villa.stiff_price}
            ratingCount={10} // Assuming rating count is not part of the villa data; adjust as necessary
            gallery={villa.url_image.map((img) => ({
              url: img, // Adjust according to your data structure
              title: villa.villa_name, // Optional: adjust as necessary
            }))}
            slug={villa._id} // Assuming you want to use the ID as a slug; adjust as necessary
            link="/villas" // Adjust the base path as necessary
          />
        ))
      )}
    </Container>
  );
};

export default TopVillasGrid;
