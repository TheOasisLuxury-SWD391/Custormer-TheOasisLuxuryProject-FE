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

const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');


const RenderReservationForm = ({ pricePerWeek, value }) => {
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

  const disabledDates = detailsTimeShare?.time_share_child
  ?.filter(child => child.deflag === true) // Lọc những child có deflag là true
  ?.map(child => ({
    start: child.start_date.split('T')[0], // Format ngày theo YYYY-MM-DD
    end: child.end_date.split('T')[0],
  }));

const disabledDate = (current) => {
  // Format ngày hiện tại để so sánh
  const currentDateStr = current.format('YYYY-MM-DD');

  // Kiểm tra nếu ngày hiện tại không nằm trong khoảng cho phép của parent
  if (currentDateStr < detailsTimeShare?.start_date.split('T')[0] || currentDateStr > detailsTimeShare?.end_date.split('T')[0]) {
    return true;
  }

  // Kiểm tra nếu ngày hiện tại nằm trong bất kỳ khoảng thời gian nào của child có deflag là true
  return disabledDates?.some(({ start, end }) => currentDateStr >= start && currentDateStr <= end);
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
        <HtmlLabel htmlFor="dateRange" content="Chọn Timeshare Villa: " />
        <RangePicker
          id="dateRange"
          format="YYYY-MM-DD"
          onChange={handleDateChange}
          disabledDate={disabledDate}
          value={dates}
          suffixIcon={null}
        />
        <p style={{ margin: '0 0 10px' }}><span className='text-rose-600 font-bold'> * </span> Chú ý: Chúng tôi dựa theo số tuần để bạn chọn nếu bạn dư dưới 7 ngày của 1 tuần sẽ tính tiền cả 1 tuần đó.</p>
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="totalPrice" content="Total Price: " />
        <strong>{formatter(totalPrice)}</strong>
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
