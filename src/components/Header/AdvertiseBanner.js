import React from "react";
import Carousel from "react-material-ui-carousel";
import { Card, CardMedia } from "@mui/material";

const ImageSlider = ({ images }) => {
  return (
    <div>
      {/* <Carousel
        autoPlay={true}
        interval={3000}
        animation="slide"
        indicators={true}
        navButtonsAlwaysVisible={true}
        indicatorContainerProps={{
          style: {
            textAlign: "center",
            marginTop: "0",
          },
        }}
        indicatorIconButtonProps={{
          style: {
            width: "10px", // Chấm tròn khi không được chọn
            height: "10px",
            borderRadius: "50%", // Để chấm là hình tròn
            backgroundColor: "grey", // Màu xám khi không được chọn
            margin: "0 6px", // Tăng khoảng cách giữa các chấm
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            width: "24px", // Khi được chọn chấm sẽ dài hơn
            height: "10px",
            borderRadius: "5px", // Bo góc nhẹ cho chấm đang chọn
            backgroundColor: "red", // Màu đỏ khi được chọn
            margin: "0 6px", // Khoảng cách giữa các chấm
          },
        }}
      > */}
      <Carousel
        autoPlay={true}
        interval={3000}
        animation="slide"
        indicators={true}
        navButtonsAlwaysVisible={true}
        indicatorContainerProps={{
          style: {
            textAlign: "center",
            marginTop: "0",
          },
        }}
        indicatorIconButtonProps={{
          style: {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "grey", // Màu khi không được chọn
            margin: "0 6px",
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            width: "24px", // Tăng chiều rộng khi được chọn
            height: "10px",
            borderRadius: "5px", // Bo góc nhẹ hơn khi được chọn
            backgroundColor: "red", // Màu đỏ khi được chọn
            margin: "0 6px",
          },
        }}
      >
        {images.map((image, index) => (
          <Card
            key={index}
            sx={{
              maxWidth: "100%",
              margin: "auto",
              boxShadow: "none",
            }}
          >
            <CardMedia
              component="img"
              image={image.url}
              alt={image.alt || `Slide ${index + 1}`}
              sx={{
                height: 320,
                width: 840, // Chiều rộng khung hình với padding 83px mỗi bên
                objectFit: "contain",
                margin: "0 auto",
              }}
            />
          </Card>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageSlider;
