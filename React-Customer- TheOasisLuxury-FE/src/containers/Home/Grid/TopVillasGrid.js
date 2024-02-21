import React, { useEffect, useState } from 'react';
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


const TopVillasGrid = () => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    fetchVillas();
  }, []);

  
  const fetchVillas = async () => {
    setLoading(true);
    try {
      // debugger
      const token = localStorage.getItem('token'); // Assuming you're using token-based authentication
      const response = await fetch("http://localhost:5000/api/v1/villas/", {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
          // 'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setVillas(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch villas with status: " + response.status);
      }
    } catch (error) {
      console.error("Error fetching villas:", error);
    } finally {
      setLoading(false);
    }
  };

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
      {loading ? (
        <div>Loading...</div>
      ) : (
        villas.map((villa) => (
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
