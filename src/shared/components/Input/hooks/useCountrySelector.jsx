import { useEffect, useRef, useState } from "react";

const useCountrySelector = () => {
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  const countryButtonRef = useRef(null);
  const countrySelectorRef = useRef(null);

  const toggleCountrySelector = (action) => {
    setIsCountrySelectorOpen((prev) =>
      action === true || action === false ? action : !prev
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryButtonRef.current &&
        !isClickInsideDiv(countryButtonRef, event.clientX, event.clientY) &&
        countrySelectorRef.current &&
        !isClickInsideDiv(countrySelectorRef, event.clientX, event.clientY)
      ) {
        toggleCountrySelector(false);
      }
    };

    const isClickInsideDiv = (ref, x, y) => {
      const rect = ref.current.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isCountrySelectorOpen,
    toggleCountrySelector,
    countryButtonRef,
    countrySelectorRef,
  };
};

export default useCountrySelector;
