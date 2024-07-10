import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useCheckConnection = (url) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + '/api/connect');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/notfound');
      }
    };

    fetchData();
  }, [navigate, url]);
};

export default useCheckConnection;
