import React, { useContext, useEffect, useState } from 'react';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ReservationFormWrapper, {
  FormActionArea,
  FieldWrapper,
} from './Reservation.style.js';
import HtmlLabel from 'components/UI/HtmlLabel/HtmlLabel.js';
import { VillaContext } from 'context/VillaContext.js';
import { TimeSharesContext } from 'context/TimeShareContext.js';

const { RangePicker } = DatePicker;

const RenderReservationForm = ({ pricePerWeek }) => {
  const navigate = useNavigate();
  // Get id API Villa
  const { villaDetails } = useContext(VillaContext);
  const idVilla = villaDetails && Object.keys(villaDetails)[0];
  const details = villaDetails[idVilla];

  // Get id API Timeshare by details.time_share_id
  const { timeShareDetails, fetchTimeShareDetails } = useContext(TimeSharesContext);
  const idTimeShare = timeShareDetails && Object.keys(timeShareDetails)[0];
  const detailsTimeShare = timeShareDetails[idTimeShare];
  console.log('detailsTimeShare', detailsTimeShare); 


  useEffect(() => {
    if (details?.time_share_id) {
      fetchTimeShareDetails(details?.time_share_id);
    }
  }, [details, fetchTimeShareDetails]);
  



  // Khởi tạo state dates với giá trị mặc định từ detailsTimeShare
  const [dates, setDates] = useState([
    detailsTimeShare ? moment(detailsTimeShare.start_date) : null,
    detailsTimeShare ? moment(detailsTimeShare.end_date) : null,
  ]);


  const disabledDate = (current) => {
    // Vô hiệu hóa ngày nếu không nằm trong khoảng cho phép hoặc deflag là true
    return detailsTimeShare.deflag || (current && (current < moment(detailsTimeShare.start_date) || current > moment(detailsTimeShare.end_date)));
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const handleDateChange = (dates) => {
    setDates(dates);
    if (dates[0] && dates[1]) {
      const start = dates[0];
      const end = dates[1];
      const totalDays = end.diff(start, 'days');
      const totalWeeks = Math.ceil(totalDays / 7);
      setTotalPrice(totalWeeks * pricePerWeek);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [startDate, endDate] = dates;
    if (startDate && endDate) {
      const totalDays = endDate.diff(startDate, 'days');
      const totalWeeks = Math.ceil(totalDays / 7);
      const totalPrice = totalWeeks * pricePerWeek;

      // alert(`Start Date: ${startDate.format('YYYY-MM-DD')}
      //        End Date: ${endDate.format('YYYY-MM-DD')}
      //        Total Weeks: ${totalWeeks}
      //        Total Price: $${totalPrice}`);
      navigate("/villas/${slug}/order", {
        state: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          totalWeeks: totalWeeks,
          totalPrice: totalPrice
        }
      });
    }
  };

  return (
    <ReservationFormWrapper onSubmit={handleSubmit}>
     <FieldWrapper>
        <HtmlLabel htmlFor="dateRange" content="Choose your date range: " />
        <RangePicker
          id="dateRange"
          format="YYYY-MM-DD"
          onChange={handleDateChange}
          disabledDate={disabledDate}
          value={dates}
          suffixIcon={null}
        />
        <p style={{ margin: '0 0 10px' }}>Chú ý: Chúng tôi dựa theo số tuần để bạn chọn nếu bạn dư dưới 7 ngày của 1 tuần sẽ tính tiền cả 1 tuần đó.</p>
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="totalPrice" content="Total Price: " />
        <strong>${totalPrice}</strong>
      </FieldWrapper>
      <FormActionArea>
        <Button htmlType="submit" type="primary">
          Book Timeshare Villa
        </Button>
      </FormActionArea>
    </ReservationFormWrapper>
  );
};

export default RenderReservationForm;
