 import React, { useEffect, useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedPage = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
   
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      // If token is not found, redirect to login page
      navigate('/');
    } else {
      // Verify the token by making an authenticated request to a protected route
      axios
        .get('http://localhost:5000/schools', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authentication
          },
        })
        .then((response) => {
          setData(response.data); // Successfully fetched protected data
          
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            // If token is invalid or expired, redirect to login
            localStorage.removeItem('token'); // Clear invalid token
            navigate('/login');
          } else {
            console.error(err);
          }
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Protected Page</h1>
      {data ? (
        <div>
          <h2>Welcome to the protected content</h2>
          {
            data.map((school)=>{
                return (
                    <p>{school.nomecole}</p>
                )
            })
          }
          <p>{data.content}</p>
</div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProtectedPage;