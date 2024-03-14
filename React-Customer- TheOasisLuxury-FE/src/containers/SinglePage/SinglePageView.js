import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'library/hooks/useLocation';
import Sticky from 'react-stickynode';
import { Row, Col, Modal, Button } from 'antd';
import Container from 'components/UI/Container/Container';
import Loader from 'components/Loader/Loader';
import useWindowSize from 'library/hooks/useWindowSize';
import Description from './Description/Description';
import Amenities from './Amenities/Amenities';
import Location from './Location/Location';
import Review from './Review/Review';
import Reservation from './Reservation/Reservation';
import BottomReservation from './Reservation/BottomReservation';
import TopBar from './TopBar/TopBar';
import SinglePageWrapper, { PostImage } from './SinglePageView.style';
import PostImageGallery from './ImageGallery/ImageGallery';
import useDataApi from 'library/hooks/useDataApi';
import isEmpty from 'lodash/isEmpty';
import { VillaContext } from 'context/VillaContext';

const SinglePage = () => {
  let { slug } = useParams(); // Assuming slug is the villa ID

  const { href } = useLocation();
  // const [villaDetails, setVillaDetails] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [isModalShowing, setIsModalShowing] = useState(false);
  const { width } = useWindowSize();
  const { villaDetails, fetchVillaDetails, loading } = useContext(VillaContext);

 // Fetch villa details nếu chưa có
    useEffect(() => {
        if (slug && !villaDetails[slug]) {
            fetchVillaDetails(slug);
        }
    }, [slug, fetchVillaDetails, villaDetails]);

  const details = villaDetails ? villaDetails[slug] : null;

  if (loading) return <Loader />;
  if (!details) return <div>No villa details found</div>;

  const {
    _id,
    villa_name,
    status,
    address,
    area, // Assuming you want to display this somewhere
    url_image,
    fluctuates_price,
    stiff_price,
    // Add other villa details you need
  } = details;

  // Transform data to fit existing component structure if necessary
  const gallery = (url_image && Array.isArray(url_image) ? url_image : []).map((img) => ({
    url: img, // Adjust according to your data structure
    title: villa_name, // Optional: adjust as necessary
  }))

  const galleryItems = gallery.map((item) => ({
    original: item.url,
    thumbnail: item.url, // hoặc một đường dẫn thumbnail phù hợp nếu có
  }));


  return (
    <SinglePageWrapper>
       <TopBar
        title={villa_name}
        shareURL={href}
        // author={author} // Assuming `author` comes from elsewhere or is static
        media={gallery}
      />
      
      <PostImage>
        <img
          className="absolute"
          src={url_image[0]}
          alt="Listing details page banner"
        />
        <Button
          type="primary"
          onClick={() => setIsModalShowing(true)}
          className="image_gallery_button"
        >
          View Photos
        </Button>
        <Modal
          open={isModalShowing}
          onCancel={() => setIsModalShowing(false)}
          footer={null}
          width="100%"
          maskStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
          wrapClassName="image_gallery_modal"
          closable={false}
        >
          <Fragment>
          <PostImageGallery items={galleryItems} />
            <Button
              onClick={() => setIsModalShowing(false)}
              className="image_gallery_close"
            >
              <svg width="16.004" height="16" viewBox="0 0 16.004 16">
                <path
                  id="_ionicons_svg_ios-close_2_"
                  d="M170.4,168.55l5.716-5.716a1.339,1.339,0,1,0-1.894-1.894l-5.716,5.716-5.716-5.716a1.339,1.339,0,1,0-1.894,1.894l5.716,5.716-5.716,5.716a1.339,1.339,0,0,0,1.894,1.894l5.716-5.716,5.716,5.716a1.339,1.339,0,0,0,1.894-1.894Z"
                  transform="translate(-160.5 -160.55)"
                  fill="#909090"
                />
              </svg>
            </Button>
          </Fragment>
        </Modal>
      </PostImage>

 
      <Container>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              content={area} // You might need to adjust this based on your API structure
              title={villa_name}
              location={{ formattedAddress: address }} // Adjust if your data structure is different
            // rating={rating} // Assuming you have a rating value; otherwise, you might need to calculate or adjust
            // ratingCount={ratingCount} // Same as above, adjust as necessary
            />
            {/* <Amenities amenities={amenities} /> // Adjust if your data structure is different */}
            {/* <Location location={location} /> // Adjust according to your API structure */}
          </Col>
          {/* <Col xl={8}>
            <Reservation
              price={stiff_price}
            // rating={rating} // Assuming these are part of your data or need adjustment
            // ratingCount={ratingCount}
            />
          </Col> */}

          <Col xl={8}>
            {width > 1200 ? (
              <Sticky
                innerZ={999}
                activeClass="isSticky"
                top={202}
                bottomBoundary="#reviewSection"
              >
                <Reservation 
                price={stiff_price}
                />
              </Sticky>
            ) : (
              <BottomReservation
                title={villa_name}
                price={stiff_price}
                // rating={rating}
                // ratingCount={ratingCount}
              />
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col xl={16}>
            {/* <Review
            reviews={reviews} // Make sure `reviews` data structure matches your API or adjust as necessary
            ratingCount={ratingCount}
            rating={rating}
            /> */}
          </Col>
        </Row>
      </Container>
    </SinglePageWrapper>
  );
};

export default SinglePage;
