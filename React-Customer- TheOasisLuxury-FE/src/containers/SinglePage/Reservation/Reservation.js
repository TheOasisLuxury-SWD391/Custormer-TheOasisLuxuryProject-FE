import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/UI/Card/Card';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import TextLink from 'components/UI/TextLink/TextLink';
import RenderReservationForm from './RenderReservationForm';
import { TimeSharesProvider } from 'context/TimeShareContext';

const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const CardHeader = ({ price, priceStyle, pricePeriodStyle, linkStyle, value }) => {
  return (
    <Fragment>
      <Heading
        content={
          <Fragment>
            {formatter(price)} <Text as="span" content="/ Tuần" {...pricePeriodStyle} />
          </Fragment>
        }
        {...priceStyle}
      />
      <TextLink link="/#1" content="Liên hệ" {...linkStyle} />
    </Fragment>
  );
};

export default function Reservation({ price }) {
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader price={price} />} // Pass the price prop to CardHeader
      content={<TimeSharesProvider><RenderReservationForm pricePerWeek={price} /></TimeSharesProvider>}
      footer={
        <p>
          Hãy lựa chọn thời gian bạn muốn mua kỳ nghỉ trong khoảng thời gian cho phép!
        </p>
      }
    />
  );
}

CardHeader.propTypes = {
  priceStyle: PropTypes.object,
  pricePeriodStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

CardHeader.defaultProps = {
  priceStyle: {
    color: '#2C2C2C',
    fontSize: '25px',
    fontWeight: '700',
  },
  pricePeriodStyle: {
    fontSize: '15px',
    fontWeight: '400',
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};
