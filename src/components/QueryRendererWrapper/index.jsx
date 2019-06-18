import React from "react";
import { Skeleton } from "antd";

const QueryRendererWrapper = callback => ({ error, props }) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!props) {
    return <Skeleton />;
  }
  return callback(props);
};

export default QueryRendererWrapper;
