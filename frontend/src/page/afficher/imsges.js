import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Imageschool = () => {
  const { idecole } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    // جلب الصور الخاصة بالمدرسة
    axios.get(`http://localhost:5000/ecoles/${idecole}/images`)
      .then((response) => {
        setImages(response.data); // تخزين الصور
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, [idecole]);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">School Images</h1>

      {images.length > 0 ? (
        <div id="schoolCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={image.idimage}
              >
                <img
                  src={`http://localhost:5000${image.image_url}`}
                  className="d-block w-100"
                  alt={`Slide ${index + 1}`}
                  style={{ height: "400px", objectFit: "cover" }}
                />
                 <center><button onClick={()=>{alert(image.image_url)}} className="text-center bg-red-500">test</button></center>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#schoolCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#schoolCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        <p className="text-center text-muted">No images available.</p>
      )}
    </div>
  );
};

export default Imageschool;
