import React, { useContext } from 'react';
import { TopVillasGrid, LuxaryHotelsGrid } from './Grid';
import SearchArea from './Search/Search';
import LocationGrid from './Location/Location';
import { LayoutContext } from 'context/LayoutProvider';
import { Waypoint } from 'react-waypoint';
import { SubdivisionProvider } from 'context/SubdivisionContext';
import Blog from './Blog/Blog';

const Home = () => {
  const [, dispatch] = useContext(LayoutContext);
  return (
    <>
      <SearchArea />
      <Waypoint
        onEnter={() => dispatch({ type: 'HIDE_TOP_SEARCHBAR' })}
        onLeave={() => dispatch({ type: 'SHOW_TOP_SEARCHBAR' })}
      />
      <SubdivisionProvider>
        <LocationGrid />
      </SubdivisionProvider>
      <TopVillasGrid />
      <Blog />
      {/* <LuxaryHotelsGrid /> */}
    </>
  );
};

export default Home;
