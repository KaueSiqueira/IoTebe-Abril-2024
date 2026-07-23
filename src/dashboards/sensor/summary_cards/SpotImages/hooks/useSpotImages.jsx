import { useEffect, useState } from "react";
import getSpotImage from "../../SpotImagesModal/apis/getSpotImage";
import updateFavoriteImage from "../apis/updateFavoriteImage";
import axios from "axios";
import FeedbackToast from "../../../../../components/FeedbackToast/FeedbackToast";

const useSpotImages = (data, spotId, setSummaryLoading, loadData) => {
  const [images, setImages] = useState([]);
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  const [cancelToken, setCancelToken] = useState(null);

  useEffect(() => {
    setImages([]);
    setActiveCarouselItem(0);
    if (data?.spot_images) {
      setImages(() => {
        let tempImages = [];
        data.spot_images.forEach(() => {
          tempImages = [...tempImages, false];
        });
        return [...tempImages];
      });
      loadImage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.spot_images]);

  useEffect(() => {
    setImages([]);
    setActiveCarouselItem(0);
    cancelToken && cancelToken.cancel();
    setCancelToken(axios.CancelToken.source());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotId]);

  const loadImage = async (activeIndex) => {
    data.spot_images
      .sort((a, b) => b.is_favorite - a.is_favorite)
      .forEach(async (image, index) => {
        if (index === activeIndex) {
          try {
            const spotImage = await getSpotImage(
              spotId,
              image.image_id,
              cancelToken
            );
            setImages((prev) => {
              let tempImages = [...prev];
              tempImages[index] = {
                image: spotImage.data.image,
                imageId: image.image_id,
                isFavorite: image.is_favorite,
              };
              return [...tempImages];
            });
          } catch (error) {
            console.error(error);
          }
        }
      });
  };

  const handleNextItem = () => {
    if (activeCarouselItem + 1 === images.length) {
      if (images[0] === false) {
        loadImage(0);
      }
      setActiveCarouselItem(0);
    } else {
      if (images[activeCarouselItem + 1] === false) {
        loadImage(activeCarouselItem + 1);
      }
      setActiveCarouselItem(activeCarouselItem + 1);
    }
  };

  const handlePreviousItem = () => {
    if (activeCarouselItem === 0) {
      if (images[images.length - 1] === false) {
        loadImage(images.length - 1);
      }
      setActiveCarouselItem(images.length - 1);
    } else {
      if (images[activeCarouselItem - 1] === false) {
        loadImage(activeCarouselItem - 1);
      }
      setActiveCarouselItem(activeCarouselItem - 1);
    }
  };

  const handleFavorite = async () => {
    if (!images[activeCarouselItem].isFavorite) {
      setSummaryLoading(true);
      try {
        await updateFavoriteImage(spotId, {
          image_id: images[activeCarouselItem].imageId,
        });
        await loadData(spotId);
        FeedbackToast.success();
      } catch (error) {
        console.error(error);
        setSummaryLoading(false);
        FeedbackToast.error();
      }
    }
  };

  return {
    images,
    activeCarouselItem,
    handleNextItem,
    handlePreviousItem,
    handleFavorite,
  };
};

export default useSpotImages;
