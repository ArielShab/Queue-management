import { Typography } from "@mui/material";
import React from "react";

function MainTitle({ title }) {
  return (
    <Typography component="h1" variant="h1" marginBlock="20px">
      {title}
    </Typography>
  );
}

export default MainTitle;
