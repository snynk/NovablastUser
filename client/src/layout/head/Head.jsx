import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ ...props }) => {
  return (
    <Helmet>
      <title> Novablast</title>
    </Helmet>
  );
};
export default Head;
