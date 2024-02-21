import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Box from 'components/UI/Box/Box';
import Text from 'components/UI/Text/Text';
import ProductCard from '../ProductCard/ProductCard';

// LoadMore component for showing a "Load More" button or custom component
const LoadMore = ({
  handleLoadMore,
  showButton,
  buttonText,
  loading,
  loadMoreComponent,
  loadMoreStyle,
}) => (
  showButton && (
    <Box className="loadmore_wrapper" {...loadMoreStyle}>
      {loadMoreComponent || (
        <Button loading={loading} onClick={handleLoadMore}>
          {buttonText || 'Load More'}
        </Button>
      )}
    </Box>
  )
);

// PropTypes for LoadMore component
LoadMore.propTypes = {
  handleLoadMore: PropTypes.func,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  loading: PropTypes.bool,
  loadMoreComponent: PropTypes.element,
  loadMoreStyle: PropTypes.object,
};

// Default props for LoadMore component
LoadMore.defaultProps = {
  showButton: false,
  loading: false,
};

// SectionGrid component to display items in a grid with an optional Load More button
export default function SectionGrid({
  data,
  totalItem,
  limit,
  columnWidth,
  paginationComponent,
  handleLoadMore,
  loadMoreComponent,
  placeholder,
  loading,
  buttonText,
  rowStyle,
  columnStyle,
  loadMoreStyle,
  link,
}) {
  const n = limit ? Number(limit) : 1;
  const limits = Array(n).fill(0);
  let showButton = data.length < totalItem;

  return (
    <>
      <Box className="grid_wrapper" {...rowStyle}>
        {data.length > 0 ? data.map((item, index) => (
          <Box
            className="grid_column"
            width={columnWidth}
            key={item.id || index} // Using item.id or index as a fallback key
            {...columnStyle}
          >
            <ProductCard link={link} {...item} />
          </Box>
        )) : null}

        {loading && limits.map((_, index) => (
          <Box
            className="grid_column"
            width={columnWidth}
            key={`placeholder-${index}`} // Unique key for placeholders
            {...columnStyle}
          >
            {placeholder || <Text content="Loading ..." />}
          </Box>
        ))}
      </Box>

      <LoadMore
        showButton={showButton}
        handleLoadMore={handleLoadMore}
        loading={loading}
        buttonText={buttonText}
        loadMoreComponent={loadMoreComponent}
        loadMoreStyle={loadMoreStyle}
      />

      {paginationComponent && (
        <Box className="pagination_wrapper">{paginationComponent}</Box>
      )}
    </>
  );
}

// PropTypes for SectionGrid component to ensure correct prop usage
SectionGrid.propTypes = {
  data: PropTypes.array.isRequired,
  totalItem: PropTypes.number,
  columnWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]).isRequired,
  paginationComponent: PropTypes.element,
  handleLoadMore: PropTypes.func,
  loadMoreComponent: PropTypes.element,
  placeholder: PropTypes.element,
  loading: PropTypes.bool,
  limit: PropTypes.number,
  buttonText: PropTypes.string,
  rowStyle: PropTypes.object,
  columnStyle: PropTypes.object,
  loadMoreStyle: PropTypes.object,
};

// Default props for SectionGrid to define default behavior and styling
SectionGrid.defaultProps = {
  data: [],
  loading: false,
  rowStyle: {
    flexBox: true,
    flexWrap: 'wrap',
    mr: ['-10px', '-10px', '-10px', '-10px', '-10px', '-15px'],
    ml: ['-10px', '-10px', '-10px', '-10px', '-10px', '-15px'],
  },
  columnStyle: {
    pr: ['10px', '10px', '10px', '10px', '10px', '15px'],
    pl: ['10px', '10px', '10px', '10px', '10px', '15px'],
  },
  loadMoreStyle: {
    flexBox: true,
    justifyContent: 'center',
    mt: '1rem',
  },
};

