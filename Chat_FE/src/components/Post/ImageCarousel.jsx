import React from 'react';
import { Carousel } from 'react-bootstrap';
import PostService from '../../services/postService';
import '../../css/Post/ImageCarousel.scss'; // Import file SCSS
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageCarousel = ({ images }) => {
  return (
    <div className="image-carousel-container">
      <Carousel>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;