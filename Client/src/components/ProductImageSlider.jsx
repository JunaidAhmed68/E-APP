import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Custom Previous Arrow
const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-3xl text-black bg-white p-2 rounded-full shadow-md hidden md:block"
    onClick={onClick}
  >
    ❮
  </div>
);

// Custom Next Arrow
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-3xl text-black bg-white p-2 rounded-full shadow-md hidden md:block"
    onClick={onClick}
  >
    ❯
  </div>
);

const ProductImageSlider = ({ images, startIndex = 0, open, onClose }) => {
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const updateArrowVisibility = () => {
      const isDesktop = window.innerWidth >= 768;
      setShowArrows(isDesktop && images.length > 1);
    };
    updateArrowVisibility();
    window.addEventListener("resize", updateArrowVisibility);
    return () => window.removeEventListener("resize", updateArrowVisibility);
  }, [images]);

  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: showArrows,
    initialSlide: startIndex,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          overflow: "visible",
          position: "relative",
          borderRadius: 2,
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 10,
          backgroundColor: "white",
          "&:hover": { backgroundColor: "#eee" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          padding: 0,
        }}
      >
        <div className="relative h-[450px]">
          <Slider {...settings}>
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`slide-${index}`}
                  className="w-full h-[400px] object-contain"
                />
              </div>
            ))}
          </Slider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageSlider;
