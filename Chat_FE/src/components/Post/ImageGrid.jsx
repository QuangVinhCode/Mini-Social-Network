import React from "react";

const ImageGrid = ({ images }) => {
  const renderImages = () => {
    if (images.length === 1) {
      return <img src={images[0]} className="w-full h-auto rounded-lg" alt="" />;
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 bg-gray-300">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-full h-60 object-cover rounded-lg"
              alt=""
            />
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-2 bg-gray-300">
          <img
            src={images[0]}
            className="col-span-1 row-span-2 w-full h-full object-cover rounded-lg"
            alt=""
          />
          <img
            src={images[1]}
            className="w-full h-32 object-cover rounded-lg"
            alt=""
          />
          <img
            src={images[2]}
            className="w-full h-32 object-cover rounded-lg"
            alt=""
          />
        </div>
      );
    }

    if (images.length === 4) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 bg-gray-300">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-full h-32 object-cover rounded-lg"
              alt=""
            />
          ))}
        </div>
      );
    }

    // Khi có >= 5 ảnh
    return (
      <div className="grid grid-cols-3 gap-2 bg-gray-300">
        <img
          src={images[0]}
          className="col-span-2 row-span-2 w-full h-full object-cover rounded-lg"
          alt=""
        />
        {images.slice(1, 3).map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-full h-32 object-cover rounded-lg"
            alt=""
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto relative">
      {/* Grid ảnh */}
      {renderImages()}

      {/* Lớp mờ phủ TẤT CẢ ảnh khi số ảnh >= 5 */}
      {images.length >= 5 && (
        <div className="absolute inset-y-0 right-0 w-[30%] bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
          +{images.length - 4}
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
