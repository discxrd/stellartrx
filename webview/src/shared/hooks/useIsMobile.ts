import { useEffect, useState } from "react";

const isMobile = () => {
  const platform = navigator.userAgent;

  if (
    platform.includes("Android") ||
    platform.includes("iPhone") ||
    platform.includes("iPad")
  ) {
    return true;
  } else {
    return false;
  }
};

export default isMobile;
