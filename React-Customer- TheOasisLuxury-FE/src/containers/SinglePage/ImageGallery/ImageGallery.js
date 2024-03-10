import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGalleryWrapper from './ImageGallery.style';

const PostImageGallery = ({ items }) => {
  return (
    <ImageGalleryWrapper>
      <ImageGallery
        items={items}
        showPlayButton={false}
        showFullscreenButton={false}
        showIndex={true}
        lazyLoad={true}
        slideDuration={550}
      />
    </ImageGalleryWrapper>
  );
};

export default PostImageGallery;
