import { useState, useEffect, useRef } from "react";

export default function useScroll() {
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollSubIndex, setScrollSubIndex] = useState(0);
  const [scrollDelayInput, setScrollDelayInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [timeoutId, setTimeoutId] = useState(undefined);
  const scrollRef = useRef(null);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const distance = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - distance;
  };

  const verifyScrollReachedTheEnd = () => {
    const scrollContext =
      document.getElementsByClassName("spotViewColumnsDiv")[0];
    const totalScrollWidth =
      scrollContext.scrollWidth - document.body.scrollWidth;
    const scrollPosition = scrollContext.scrollLeft;
    return scrollPosition >= totalScrollWidth - 30;
  };

  const createCallbackAutoScroll = () => {
    return setTimeout(() => {
      try {
        const columns = document.getElementsByClassName("spotViewColumn");
        if (columns.length < 1) return;

        const cardWidth = columns[scrollIndex].offsetWidth;
        const spotArray = columns[scrollIndex].children[1].children;

        if (spotArray.length > 0) {
          const spotWidth = spotArray[0].offsetWidth;
          const columnsNumber = parseInt(cardWidth / spotWidth);
          const columnIndex =
            Math.round(spotArray.length / columnsNumber) * scrollSubIndex;

          spotArray[columnIndex].scrollIntoView({
            inline: "start",
            behavior: "smooth",
          });

          const scrollReachedTheEnd = verifyScrollReachedTheEnd();

          if (scrollSubIndex < columnsNumber - 1) {
            if (scrollReachedTheEnd === true) {
              setScrollIndex(0);
              setScrollSubIndex(0);
            } else {
              setScrollSubIndex(scrollSubIndex + 1);
            }
          } else {
            setScrollSubIndex(0);
            if (
              scrollIndex < columns.length - 1 &&
              scrollReachedTheEnd === false
            ) {
              setScrollIndex(scrollIndex + 1);
            } else {
              setScrollIndex(0);
            }
          }
        } else {
          columns[scrollIndex].scrollIntoView({
            inline: "start",
            behavior: "smooth",
          });

          const scrollReachedTheEnd = verifyScrollReachedTheEnd();

          if (scrollIndex < columns.length - 1) {
            if (scrollReachedTheEnd === true) {
              setScrollIndex(0);
            } else {
              setScrollIndex(scrollIndex + 1);
            }
          } else {
            setScrollIndex(0);
          }
        }
        setAutoScroll(true);
      } catch (error) {
        console.error(error);
        console.error("Error while scrolling");
        setScrollIndex(0);
        setScrollSubIndex(0);
      }
    }, 1000 * 5);
  };

  const handleAutomaticScroll = () => {
    setScrollDelayInput(true);
    if (!scrollDelayInput) {
      setTimeout(() => {
        try {
          if (!!timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(undefined);
          }
          const newId = createCallbackAutoScroll();
          setTimeoutId(newId);
          setScrollDelayInput(false);
        } catch {
          console.error("Error while activating automatic scroll");
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      try {
        if (!!timeoutId) {
          clearTimeout(timeoutId);
          setTimeoutId(undefined);
        }
        const newId = createCallbackAutoScroll();
        setTimeoutId(newId);
        setAutoScroll(false);
      } catch {
        console.error("Error while activating automatic scroll");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll]);

  useEffect(() => {
    handleAutomaticScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    setIsDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleAutomaticScroll,
    scrollRef,
    isDragging,
  };
}
