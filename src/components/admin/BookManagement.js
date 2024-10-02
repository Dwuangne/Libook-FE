import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

export default function BookManagement() {
    const navigator = useNavigate();
    return (
        <Box
            sx={{
                flexGrow: 1,
                transition: 'margin-left 0.3s',
                minHeight: "100vh",
                backgroundColor: "#FFFFFF", // Subtle background color
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 30px',
                    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
                }}
            >
                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: "#3F51B5", // Matching color with primary theme
                    }}
                >
                    Book List
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#3F51B5", // Consistent primary color
                        color: "white",
                        borderRadius: "20px",
                        fontSize: 12,
                        fontWeight: "bold",
                        padding: "4px 10px", // Adjust padding to fit the text better
                        whiteSpace: "nowrap", // Prevent text from wrapping
                        width: "80px", // Adjust width to ensure "Add New Book" fits
                        transition: "all 0.4s ease-in-out",
                        border: "2px solid #3F51B5",
                        "&:hover": {
                            backgroundColor: "white",
                            color: "#3F51B5",
                            border: "2px solid #3F51B5",
                        }
                    }}
                    onClick={() => navigator("/admin/bookdetails")} // Di chuyển onClick ra ngoài sx
                >
                    Add
                </Button>

            </Box>

            {/* Additional content for book management would go here */}
        </Box>
    );
}
