import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

ProductSkeletonList.propTypes = {
  length: PropTypes.number,
};
ProductSkeletonList.defaultProps = {
  length: 6,
};

function ProductSkeletonList({ length }) {
  return (
    <Box>
      <Grid container spacing={5}>
        {Array.from(new Array(length)).map((x, index) => (
          <Grid item key={index} xs={12} sm={3} md={4} lg={3}>
            <Box padding="10px 30px 10px 30px ">
              <Skeleton variant="rectangular" width="200px" height={118} />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductSkeletonList;
