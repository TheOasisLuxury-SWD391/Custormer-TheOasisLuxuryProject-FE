
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SubdivisionContext = createContext();

export const SubdivisionProvider = ({ children }) => {
    const [subdivisions, setSubdivisions] = useState([]);

    useEffect(() => {
      const fetchSubdivisions = async () => {
        try {
          const response = await axios.get('/subdivisions');
          setSubdivisions(response.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchSubdivisions();
    }, []);

    return (
      <SubdivisionContext.Provider value={{ subdivisions }}>
        {children}
      </SubdivisionContext.Provider>
    );
};
