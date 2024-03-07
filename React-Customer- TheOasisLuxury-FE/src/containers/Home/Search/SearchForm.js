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
import { LISTING_POSTS_PAGE } from 'settings/constant';
import { ProjectContext } from 'context/ProjectContext';
import { SubdivisionContext } from 'context/SubdivisionContext';
import {
  FormWrapper,
  ComponentWrapper,
  RoomGuestWrapper,
  ItemWrapper,
} from './Search.style';

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
    setSelectedSubdivision(value);
  };



  // navigate to the search page
  const goToSearchPage = () => {
    let tempLocation = [];
    const mapData = mapValue ? mapDataHelper(mapValue) : [];
    mapData &&
      mapData.map((singleMapData, i) => {
        return tempLocation.push({
          formattedAddress: singleMapData ? singleMapData.formattedAddress : '',
          lat: singleMapData ? singleMapData.lat.toFixed(3) : null,
          lng: singleMapData ? singleMapData.lng.toFixed(3) : null,
        });
      });
    const location = tempLocation ? tempLocation[0] : {};
    const query = {
      date_range: searchDate,
      location,
    };
    const search = setStateToUrl(query);
    navigate({
      pathname: LISTING_POSTS_PAGE,
      search: `?${createSearchParams(search)}`,
    });
  };

  return (
    <FormWrapper>

      <ComponentWrapper>
        <Select
          showSearch
          className='w-full m-3'
          placeholder="Select a project"
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
          placeholder="Select a subdivision"
          loading={loadingSubdivisions}
          onChange={onSubdivisionChange}
          disabled={!selectedProject || loadingSubdivisions}
        >
          {subdivisions.map(subdivision => (
            <Option key={subdivision.subdivision_name} value={subdivision.subdivision_name}>{subdivision.subdivision_name}</Option>
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
