import React, { useState, useEffect } from "react";
import { GetAllBooksApi } from "../../api/BookApi";
import { GetCategoryApi } from "../../api/CategoryApi";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../Header/AdvertiseBanner";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import image1 from "../../assets/banner1.png";
import image2 from "../../assets/banner2.png";
import image3 from "../../assets/banner3.png";
import replaceImg from "../../assets/Blue_Book.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  window.document.title = "Books";
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState({});

  useEffect(() => {
    // Lấy danh sách danh mục và sách theo danh mục
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryRes = await GetCategoryApi();
        const categories = categoryRes?.data?.data || [];
        setCategories(categories);

        const booksByCategory = {};
        for (const category of categories) {
          const bookRes = await GetAllBooksApi({
            categoryID: category.id,
            pageIndex: 0,
            pageSize: 8, // Giới hạn số sách mỗi danh mục
          });
          booksByCategory[category.id] = bookRes?.data?.data || [];
        }
        setBooksByCategory(booksByCategory);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookClick = (bookName) => {
    navigate(`/bookdetail/${bookName}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const images = [
    {
      url: image1,
      alt: "First Slide",
    },
    {
      url: image2,
      alt: "Second Slide",
    },
    {
      url: image3,
      alt: "Third Slide",
    },
  ];

  return (
    <div>
      <ImageSlider images={images} />
      <Box mt={4} paddingTop={10} backgroundColor="#f0f0f0">
        {loading ? (
          <CircularProgress />
        ) : (
          categories.map((category) => (
            // <Box key={category.id} mb={4} padding="0 110px">
            //   <Typography variant="h5" gutterBottom>
            //     {category.name}
            //   </Typography>
            //   <Divider />
            //   <Grid container spacing={2} mt={2}>
            //     {booksByCategory[category.id]?.map((book) => (
            //       <Grid item xs={12} sm={6} md={3} key={book.id}>
            //         <Card onClick={() => handleBookClick(book.name)}>
            //           <CardMedia
            //             component="img"
            //             height="140"
            //             image={
            //               book.imageUrl || "https://via.placeholder.com/150"
            //             }
            //             alt={book.name}
            //           />
            //           <CardContent>
            //             <Typography variant="subtitle1" noWrap>
            //               {book.name}
            //             </Typography>
            //             <Typography variant="body2" color="text.secondary">
            //               {book.authorName}
            //             </Typography>
            //             <Typography variant="body2" color="text.secondary">
            //               {book.rating} ★
            //             </Typography>
            //             <Typography variant="body2" color="text.primary">
            //               {formatCurrency(book.price)}
            //             </Typography>
            //           </CardContent>
            //         </Card>
            //       </Grid>
            //     ))}
            //   </Grid>
            // </Box>
            <Box key={category.id} mb={4} padding="0 150px">
              <Typography
                variant="h3"
                gutterBottom
                textAlign="left"
                fontWeight="bold"
              >
                {category.name}
              </Typography>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  overflowX: "auto", // Allow horizontal scrolling
                  paddingBottom: "10px", // Add some padding at the bottom
                }}
              >
                {booksByCategory[category.id]?.map((book) => (
                  <Card
                    key={book.id}
                    sx={{
                      boxShadow: "none",
                      height: "300px",
                      width: "200px",
                      flex: "0 0 auto", // Prevent items from shrinking
                      "&:hover": {
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // Shadow effect on hover
                        transform: "translateY(-5px)", // Slight upward motion on hover
                        transition: "all 0.3s ease", // Smooth transition effect
                      },
                    }}
                    onClick={() => handleBookClick(book.name)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: "180px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={book.imageUrl ? book.imageUrl : replaceImg}
                        alt={book.name}
                        sx={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <CardContent
                      sx={{
                        paddingLeft: 1.5,
                        paddingRight: 1,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h7"
                        sx={{
                          textAlign: "left",
                          width: "100%",
                          height: "3rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.5rem",
                          whiteSpace: "normal",
                        }}
                      >
                        {book.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                          marginTop: 1,
                        }}
                      >
                        <Typography
                          variant="h7"
                          color="error"
                          sx={{ fontWeight: "bold" }}
                        >
                          {formatCurrency(
                            book.price -
                              (book.price * book.precentDiscount) / 100
                          )}
                        </Typography>

                        {book.precentDiscount > 0 && (
                          <Box
                            sx={{
                              backgroundColor: "red",
                              color: "white",
                              marginLeft: "10px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: 500,
                            }}
                          >
                            -{book.precentDiscount}%
                          </Box>
                        )}
                      </Box>

                      {book.precentDiscount > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            color: "gray",
                            textAlign: "left",
                          }}
                        >
                          {formatCurrency(book.price)}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default HomePage;
