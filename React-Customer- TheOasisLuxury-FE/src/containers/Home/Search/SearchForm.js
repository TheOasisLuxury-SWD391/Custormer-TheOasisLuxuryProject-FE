import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { FaMapMarkerAlt, FaRegCalendar, FaUserFriends } from 'react-icons/fa';
import { Button, Select } from 'antd';
import DateRangePickerBox from 'components/UI/DatePicker/ReactDates';
import MapAutoComplete from 'components/Map/MapAutoComplete';
import { mapDataHelper } from 'components/Map/mapDataHelper';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import { setStateToUrl } from 'library/helpers/url_handler';
import { LISTING_FILTER_PAGE} from 'settings/constant';
import { ProjectContext } from 'context/ProjectContext';
import { SubdivisionContext } from 'context/SubdivisionContext';
import {
  FormWrapper,
  ComponentWrapper,
  RoomGuestWrapper,
  ItemWrapper,
} from './Search.style';
import { VillaContext } from 'context/VillaContext';
import { TimeSharesContext } from 'context/TimeShareContext';

const calendarItem = {
  separator: '-',
  format: 'MM-DD-YYYY',
  locale: 'en',
};

const { Option } = Select;

export default function SearchForm() {
  let navigate = useNavigate();
  const [searchDate, setSearchDate] = useState({
    setStartDate: null,
    setEndDate: null,
  });
  const { villas } = useContext(VillaContext);
  console.log('villas', villas);
  const { fetchTimeShareDetails, timeShareDetails, loading } = useContext(TimeSharesContext);

  const filterVillasBySubdivision = (villas, selectedSubdivisionId) => {
    return villas.filter(villa => villa.subdivision_id === selectedSubdivisionId);
  };

  const filterVillasByDateRange = (villas, startDate, endDate) => {
    // Chuyển đối tượng Date thành chuỗi có định dạng ngày tháng năm
    const startOfDayUTCStr = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString().split('T')[0];
    const endOfDayUTCStr = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).toISOString().split('T')[0];
    
    return villas.filter(villa => {
      if(villa?.timeShareDetails?.result){
        const timeShareStartDate = new Date(villa.timeShareDetails.result.start_date).toISOString().split('T')[0];
        const timeShareEndDate = new Date(villa.timeShareDetails.result.end_date).toISOString().split('T')[0];
        return startOfDayUTCStr >= timeShareStartDate && endOfDayUTCStr <= timeShareEndDate;
      }
      return false;
    });
  };

  
  

  // // Usage example:
  // let filteredVillas = filterVillasBySubdivision(villas, selectedSubdivisionId);
  // filteredVillas = filterVillasByDateRange(filteredVillas, selectedStartDate, selectedEndDate);
  // Assume these are fetched from the backend or defined statically
  const [selectedProject, setSelectedProject] = useState(undefined);
  const [selectedSubdivision, setSelectedSubdivision] = useState(undefined);

  const { projects = [], loading: loadingProjects = false } = useContext(ProjectContext) || {};
  const { subdivisions, fetchSubdivisions, loading: loadingSubdivisions } = useContext(SubdivisionContext);

  // place data
  const [mapValue, setMapValue] = useState([]);
  const updateValueFunc = (event) => {
    const { searchedPlaceAPIData } = event;
    if (!isEmpty(searchedPlaceAPIData)) {
      setMapValue(searchedPlaceAPIData);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchSubdivisions(selectedProject);
    }
  }, [selectedProject, fetchSubdivisions]);

  const onProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedSubdivision(undefined); // Reset subdivision when project changes
  };

  const onSubdivisionChange = (value) => {
    setSelectedSubdivision(value); // Giả sử giá trị value chính là ID của subdivision
  };

  // Lấy ra các subdivisions của project được chọn
  const getSubdivisionsOfSelectedProject = () => {
    if (!selectedProject || !projects.length) return [];
    const project = projects.find(p => p.project_name === selectedProject);
    return project ? project.subdivisions : [];
  };

  const fetchTimeShareDetailsForVillas = async (villas) => {
    try {
      const token = localStorage.getItem('token');
      const timeShareDetailsPromises = villas.map(async (villa) => {
        if (villa?.time_share_id) {
          try {
            const timeShareResponse = await fetch(`http://localhost:5000/api/v1/timeshares/${villa.time_share_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (timeShareResponse.ok) {
              const timeShareData = await timeShareResponse.json();
              villa.timeShareDetails = timeShareData;
            } else {
              console.error(`Failed to fetch timeshare for villa ${villa._id}`);
            }
          } catch (error) {
            console.error(`Error fetching timeshare for villa ${villa._id}:`, error);
          }
        }
      });
  
      await Promise.all(timeShareDetailsPromises);
    } catch (error) {
      console.error("Error fetching timeshare details for villas:", error);
    }
  };
  
  // Sau đó gọi hàm fetchTimeShareDetailsForVillas từ useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTimeShareDetailsForVillas(villas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [villas]);
  




  const goToSearchPage = () => {
    // Convert the date range from the state to Date objects
    const startDate = searchDate.setStartDate ? new Date(searchDate.setStartDate) : null;
    const endDate = searchDate.setEndDate ? new Date(searchDate.setEndDate) : null;
    // Ensure both start and end dates are selected
    if (!startDate || !endDate || !selectedSubdivision) {
      alert("Please select a subdivision and a valid date range.");
      return;
    }

    // Apply the filtering
    let filteredVillas = filterVillasBySubdivision(villas, selectedSubdivision);
    console.log('filteredVillas',filteredVillas);
    filteredVillas = filterVillasByDateRange(filteredVillas, startDate, endDate);
    

    // Prepare the query with the filtered villa IDs
    const query = {
      date_range: `${searchDate.setStartDate},${searchDate.setEndDate}`,
      villas: filteredVillas.map(villa => villa._id),
    };

    // Generate the search string from the query object
    const searchString = createSearchParams(query).toString();
    console.log('searchString',searchString);

    navigate({
      pathname: LISTING_FILTER_PAGE,
      search: `?${searchString}`,
    });
  };



  return (
    <FormWrapper>

      <ComponentWrapper>
        <Select
          showSearch
          className='w-full m-3'
          placeholder="Chọn Dự Án"
          loading={loadingProjects}
          onChange={onProjectChange}
        >
          {projects.map(project => (
            <Option key={project.project_name} value={project.project_name}>{project.project_name}</Option>
          ))}
        </Select>
      </ComponentWrapper>

      <ComponentWrapper>
        <Select
          showSearch
          className='w-full m-3'
          placeholder="Chọn Phân Khu"
          loading={loadingSubdivisions}
          onChange={onSubdivisionChange}
          disabled={!selectedProject || loadingSubdivisions}
        >
          {getSubdivisionsOfSelectedProject().map(subdivision => (
            <Option key={subdivision._id} value={subdivision._id}>{subdivision.subdivision_name}</Option>
          ))}
        </Select>

      </ComponentWrapper>

      <ComponentWrapper>
        <FaRegCalendar className="calendar" />
        <DateRangePickerBox
          item={calendarItem}
          startDateId="startDateId-id-home"
          endDateId="endDateId-id-home"
          updateSearchData={(setDateValue) => setSearchDate(setDateValue)}
          showClearDates={true}
          small={true}
          numberOfMonths={1}
        />
      </ComponentWrapper>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        onClick={goToSearchPage}
      >
        Tìm Timeshare
      </Button>
    </FormWrapper>
  );
}
