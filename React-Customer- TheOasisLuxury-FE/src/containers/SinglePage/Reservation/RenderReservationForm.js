import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import HtmlLabel from 'components/UI/HtmlLabel/HtmlLabel';
import DatePickerRange from 'components/UI/DatePicker/ReactDates';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import ReservationFormWrapper, {
  FormActionArea,
  FieldWrapper,
  RoomGuestWrapper,
  ItemWrapper,
  InputIncDecWrapper
} from './Reservation.style.js';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import { useNavigate } from 'react-router-dom';

// import InputIncDecWrapper from 'components/UI/InputIncDec/InputIncDec.style.js';

const RenderReservationForm = (pricePerWeek) => {

   // Khởi tạo useNavigate
   const navigate = useNavigate();

  const [formState, setFormState] = useState({
    startDate: null,
    totalWeeks: 1, // Default to 1 week
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [focused, setFocused] = useState(false);

   useEffect(() => {
    const newTotalPrice = calculateTotalPrice(); // Recalculate total price when totalWeeks changes
    setTotalPrice(newTotalPrice);
  }, [formState.totalWeeks, pricePerWeek]);

  const handleWeeksChange = (e) => {
    const weeks = parseInt(e.target.value, 10) || 1; // Ensure the value is a number and defaults to 1 if not
    setFormState({
      ...formState,
      totalWeeks: weeks,
    });
  };

  const calculateEndDate = () => {
    if (!formState.startDate) return '';
    return moment(formState.startDate).add(formState.totalWeeks * 7, 'days').format('YYYY-MM-DD');
  };

  const calculateTotalPrice = () => {
    return formState.totalWeeks * pricePerWeek.pricePerWeek; // Assuming pricePerWeek is an object with a pricePerWeek property
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const endDate = calculateEndDate();
    const totalPrice = calculateTotalPrice(); // Calculate total price
    alert(
      `Start Date: ${formState.startDate && formState.startDate.format('YYYY-MM-DD')}
       End Date: ${endDate}
       Total Weeks: ${formState.totalWeeks}
       Total Price: $${totalPrice}`
    );
    navigate("/booking-time-share-form", { 
      state: { 
        startDate: formState.startDate.format('YYYY-MM-DD'),
        endDate: endDate,
        totalWeeks: formState.totalWeeks,
        totalPrice: totalPrice 
      }
    });
  };

  return (
    <ReservationFormWrapper onSubmit={handleSubmit}>
      <FieldWrapper>
        <HtmlLabel htmlFor="startDate" content="Start Date" />
        <SingleDatePicker
          date={formState.startDate} // momentPropTypes.momentObj or null
          onDateChange={(date) => setFormState({ ...formState, startDate: date })} // PropTypes.func.isRequired
          focused={focused} // boolean
          onFocusChange={({ focused }) => setFocused(focused)} // function
          id="startDate" // PropTypes.string.isRequired,
          numberOfMonths={1}
        />
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="totalWeeks" content="Total Time to Book: " />
        <InputIncDecWrapper>
          <input
            type="number"
            value={formState.totalWeeks}
            onChange={handleWeeksChange}
            min="1"
            max="52" // Assuming a maximum of 52 weeks
          />
          <span> / weeks</span>
        </InputIncDecWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="endDate" content="End Date: " />
        <strong>{calculateEndDate()}</strong>
      </FieldWrapper>

      <FieldWrapper>
        <HtmlLabel htmlFor="totalPrice" content="Total Price: " />
        <strong>${totalPrice}</strong> {/* Use the totalPrice state to display the value */}
      </FieldWrapper>

      <FormActionArea>
        <Button htmlType="submit" type="primary">
          Book Villa
        </Button>
      </FormActionArea>
    </ReservationFormWrapper>
  );
};

export default RenderReservationForm;
