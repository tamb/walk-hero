import React from "react";
import PropsTypes from "prop-types";
import { Badge } from "reactstrap";

const Badges = (props) => {
  function determineBadge(_amount) {
    // divisble by 100 and >= 1?
    // divisible by 75 and >= 1?
    // divisible by 50 and >= 1?
    // divisible by 25 and >= 1?
    // 1000000 -> go based 10 (1 zero over --- 1000 == 100 * 10)
  }

  return <div></div>;
};

Badges.propTypes = {
  // data
};

export default Badges;
