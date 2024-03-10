import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import TextLink from 'components/UI/TextLink/TextLink';
import Rating from 'components/UI/Rating/Rating';
import Favourite from 'components/UI/Favorite/Favorite';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import GridCard from '../GridCard/GridCard';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,  // Chỉ hiển thị 1 item cho mỗi lượt xem
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const PostGrid = ({
  title,
  rating,
  location,
  price,
  ratingCount,
  gallery,
  slug,
  link,
}) => {
  return (
    <GridCard
      className='flex-auto p-1 m-2 max-w-64 '
      isCarousel={gallery.length > 1}
      favorite={<Favourite onClick={(event) => console.log(event)} />}
      location={location.formattedAddress}
      title={<TextLink link={`${link}/${slug}`} content={title} />}
      price={`$${price}/Night - Free Cancellation`}
      rating={<Rating rating={rating} ratingCount={ratingCount} type="bulk" />}
      viewDetailsBtn={<TextLink link={`${link}/${slug}`} icon={<FiExternalLink />} content="View Details" />}
    >
       <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true} // Server-side rendering
        infinite={true}
        autoPlay={false} // Disable autoPlay
        arrows={true} // Show navigation arrows
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {Array.isArray(gallery) && gallery.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Image ${index}`} draggable={false} style={{
              width: '100%', // Ensure the image takes full width
              height: 'auto', // Maintain aspect ratio
              objectFit: 'cover',
            }} />
          </div>
        ))}
      </Carousel>
    </GridCard>
  );
};

export default PostGrid;
