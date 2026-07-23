import { useEffect, useRef, useState } from "react";

export default function useSearchResultItem() {
  const pRef = useRef(null);
  const [canSlide, setCanSlide] = useState(false);

  const handleHover = () => {
    const pScrollWidth = pRef?.current?.scrollWidth;
    const pWidth = pRef?.current?.clientWidth;

    if (pScrollWidth > pWidth || (pScrollWidth === 0 && pWidth === 0)) {
      setCanSlide(true);
    } else {
      setCanSlide(false);
    }
  };

  useEffect(() => {
    handleHover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pRef?.current?.scrollWidth, pRef?.current?.clientWidth]);

  return { pRef, canSlide, handleHover };
}
