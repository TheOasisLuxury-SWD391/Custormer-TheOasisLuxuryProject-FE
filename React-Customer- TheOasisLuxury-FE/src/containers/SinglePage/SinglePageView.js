import React, { Fragment, useEffect, useState } from 'react';
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

const SinglePage = () => {
  let { slug } = useParams(); // Assuming slug is the villa ID
  const { href } = useLocation();
  const [villaDetails, setVillaDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalShowing, setIsModalShowing] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    const fetchVillaDetails = async () => {
      setLoading(true);
      try {
        // debugger
        const token = localStorage.getItem('token'); // Assuming you're using token-based authentication
        const response = await fetch(`http://localhost:5000/api/v1/villas/${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
            // 'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          setVillaDetails(jsonResponse.result);
        } else {
          console.error('Failed to fetch villa details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching villa details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVillaDetails();
    }
  }, [slug]);

  if (loading || !villaDetails) return <Loader />;

  const {
    villa_name,
    address,
    area, // Assuming you want to display this somewhere
    url_image,
    fluctuates_price,
    stiff_price,
    // Add other villa details you need
  } = villaDetails;

  // let url = '/data/hotel-single.json';
  // if (!slug) {
  //   url += slug;
  // }
  // const { data, loading } = useDataApi(url);
  // if (isEmpty(data) || loading) return <Loader />;
  // const {
  //   reviews,
  //   rating,
  //   ratingCount,
  //   price,
  //   title,
  //   gallery,
  //   location,
  //   content,
  //   amenities,
  //   author,
  // } = data[0];

  // Transform data to fit existing component structure if necessary
  const gallery = url_image.map(url => ({ url }));

  return (
    <SinglePageWrapper>
      <PostImage>
        <img
          className="absolute"
          src="/images/single-post-bg.jpg"
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
            <PostImageGallery />
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

      {/* <TopBar title={title} shareURL={href} author={author} media={gallery} />

      <Container>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              content={content}
              title={title}
              location={location}
              rating={rating}
              ratingCount={ratingCount}
            />
            <Amenities amenities={amenities} />
            <Location location={data[0]} />
          </Col>
          <Col xl={8}>
            {width > 1200 ? (
              <Sticky
                innerZ={999}
                activeClass="isSticky"
                top={202}
                bottomBoundary="#reviewSection"
              >
                <Reservation />
              </Sticky>
            ) : (
              <BottomReservation
                title={title}
                price={price}
                rating={rating}
                ratingCount={ratingCount}
              />
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col xl={16}>
            <Review
              reviews={reviews}
              ratingCount={ratingCount}
              rating={rating}
            />
          </Col>
          <Col xl={8} />
        </Row>
      </Container> */}

      <TopBar
        title={villa_name}
        shareURL={href}
        // author={author} // Assuming `author` comes from elsewhere or is static
        media={gallery}
      />

      <Container>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              // content={content} // You might need to adjust this based on your API structure
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
