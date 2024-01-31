import React, { useContext } from 'react';
import { TopHotelsGrid, LuxaryHotelsGrid } from './Grid';
import SearchArea from './Search/Search';
import LocationGrid from './Location/Location';
import { LayoutContext } from 'context/LayoutProvider';
import { Waypoint } from 'react-waypoint';
// import useUser from 'hooks/use-users';
import { useAuth } from 'context/AuthContext';

const Home = () => {
  const [, dispatch] = useContext(LayoutContext);


const { login, user, logout } = useAuth();
console.log(user)
login("Huy", "B@kurapt009")
  return (
    <>
      <SearchArea />
      <Waypoint
        onEnter={() => dispatch({ type: 'HIDE_TOP_SEARCHBAR' })}
        onLeave={() => dispatch({ type: 'SHOW_TOP_SEARCHBAR' })}
      />
      <LocationGrid />
      <TopHotelsGrid />
      <LuxaryHotelsGrid />
    </>
  );
};

export default Home;