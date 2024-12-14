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
  Button,
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
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Fetch categories and books by category
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryRes = await GetCategoryApi();
        const categories = categoryRes?.data?.data || [];
        const validCategories = [];
        const booksByCategory = {};

        for (const category of categories) {
          const bookRes = await GetAllBooksApi({
            categoryID: category.id,
            pageIndex: 0,
            pageSize: 6, // Limit number of books per category
          });
          const books = bookRes?.data?.data?.bookResponseDTOs || [];
          if (books.length > 0) {
            booksByCategory[category.id] = books;
            validCategories.push(category); // Only keep categories with books
          }
        }
        setCategories(validCategories);
        setBooksByCategory(booksByCategory);
        //console.log(booksByCategory);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/${bookId}`);
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
      <Box
        backgroundColor="#f0f0f0"
        paddingTop={10}
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }} // Added flexbox and gap
      >
        <ImageSlider images={images} />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          categories.map((category) => (
            <Box
              key={category.id}
              margin="0 100px"
              sx={{
                border: "2px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h3"
                textAlign="left"
                fontWeight="bold"
                paddingTop={2}
                paddingLeft={2}
              >
                {category.name}
              </Typography>
              <Divider variant="middle" />
              <Grid container spacing={2} marginTop={2} paddingLeft={2}>
                {booksByCategory[category.id]?.map((book) => (
                  <Grid
                    item={true.toString()}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    key={book.id}
                  >
                    <Card
                      sx={{
                        boxShadow: "none",
                        height: "300px",
                        width: "200px",
                        flex: "0 0 auto",
                        "&:hover": {
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                          transform: "translateY(-5px)",
                          transition: "all 0.3s ease",
                        },
                      }}
                      onClick={() => handleBookClick(book.id)}
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
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="h7"
                          sx={{
                            textAlign: "left",
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
                  </Grid>
                ))}
              </Grid>

              {/* Add the View More button below the book grid */}
              <Box textAlign="center" marginTop={3} paddingBottom="20px">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "red",
                    borderRadius: "30px",
                    fontSize: 16,
                    fontWeight: "bold",
                    width: "10vw",
                    marginBottom: "1rem",
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "2px solid red ",
                  }}
                  onClick={() => navigate(`/booklist/${category.id}`)}
                >
                  View More
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default HomePage;
