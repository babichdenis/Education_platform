import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
        try {
          const csrfResponse = await axios.get('http://localhost:8000/api/csrf/', {
            withCredentials: true,
          });
          const csrfToken = csrfResponse.data.csrfToken;
      
          const response = await axios.post(
            'http://localhost:8000/api/logout/',
            {},
            {
              withCredentials: true,
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
      
          if (response.data.status === 'success') {
            setIsAuthenticated(false);
            navigate('/');
          } else {
            console.error('Ошибка при выходе:', response.data);
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    performLogout();
  }, [setIsAuthenticated, navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
