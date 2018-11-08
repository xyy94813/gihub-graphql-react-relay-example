import React from "react";
import styles from "./index.less";

const LinkButton = props => (
  <button type="button" {...props} className={styles["link-button"]} />
);

export default LinkButton;
