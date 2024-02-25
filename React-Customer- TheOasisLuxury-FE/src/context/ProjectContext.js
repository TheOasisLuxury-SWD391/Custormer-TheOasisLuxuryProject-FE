import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token-based authentication
        const response = await fetch("http://localhost:5000/api/v1/projects/", {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data); // Logging the data for debug purposes
          setProjects(Array.isArray(data.result) ? data.result : []);
        } else {
          console.error("Failed to fetch projects with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchProjectDetails = useCallback(async (slug) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/projects/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setProjectDetails({[slug]: jsonResponse.result});
      } else {
        console.error('Failed to fetch project details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, projectDetails, fetchProjectDetails, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};
