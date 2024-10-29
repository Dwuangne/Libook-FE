import React from "react";
import Carousel from "react-material-ui-carousel";
import { Card, CardMedia } from "@mui/material";

const ImageSlider = ({ images }) => {
  return (
    <div>
      <Carousel
        autoPlay={true}
        interval={3000}
        animation="slide"
        indicators={true}
        navButtonsAlwaysVisible={true}
        indicatorIconButtonProps={{
          style: {
            width: "8px", // Chấm tròn khi không được chọn
            height: "8px",
            borderRadius: "50%", // Để chấm là hình tròn
            color: "white", // Màu xám khi không được chọn
            margin: "0 6px", // Tăng khoảng cách giữa các chấm
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            width: "24px", // Khi được chọn chấm sẽ dài hơn
            height: "12px",
            borderRadius: "7px", // Bo góc nhẹ cho chấm đang chọn
            color: "black", // Màu đỏ khi được chọn
            backgroundColor: "black", // Màu đồ khi là chấm đang chọn
            margin: "0 6px", // Khoảng cách giữa các chấm
          },
        }}
        indicatorContainerProps={{
          style: {
            textAlign: "center",
            // marginTop: "0",
            position: "absolute", // Đặt Indicators ở vị trí tuyệt đối
            bottom: "0px", // Cách đáy ảnh 10px
            left: "50%", // Canh giữa màn hình
            transform: "translateX(-50%)", // Đảm bảo canh giữa hoàn toàn
            zIndex: 1, // Đảm bảo Indicators nằm trên ảnh
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
