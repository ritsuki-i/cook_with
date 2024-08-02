import { useEffect } from 'react';

const PreloadImages = ({ imageUrls }) => {
  useEffect(() => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);

  return null; 
};

export default PreloadImages;
