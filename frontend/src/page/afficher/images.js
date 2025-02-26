import React, { useEffect, useState } from 'react';

const SchoolImages = ({ idecole }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch images for the given school
        fetch(`http://localhost:3000/ecole/19/images`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setImages(data);
                } else {
                    console.error('Error: Invalid response format', data);
                }
            })
            .catch(error => console.error('Error fetching images:', error));
    }, [idecole]);

    return (
        <div>
            {images.length > 0 ? (
                images.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`School ${idecole} Image ${index + 1}`}
                        style={{ width: '200px', margin: '10px' }}
                    />
                ))
            ) : (
                <p>No images found for this school.</p>
            )}
        </div>
    );
};

export default SchoolImages;
