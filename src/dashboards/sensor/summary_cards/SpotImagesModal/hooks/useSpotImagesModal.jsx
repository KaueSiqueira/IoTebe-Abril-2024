import { useContext, useEffect, useState } from "react";
import { WhichRenderContext } from "../../../../../contexts";
import getSpotImage from "../apis/getSpotImage";
import { deleteSpotImage } from "../apis/deleteSpotImage";
import FeedbackToast from "../../../../../components/FeedbackToast/FeedbackToast";

const useSpotImagesModal = (
  data,
  imagesModal,
  setImagesModal,
  setUploadImagesModal,
  loadData
) => {
  const { selectedNode } = useContext(WhichRenderContext);

  const [images, setImages] = useState([]);
  const [activeCarouselItem, setActiveCarouselItem] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      data.spot_images
        .sort((a, b) => b.is_favorite - a.is_favorite)
        .forEach(async (image, index) => {
          const spotImage = await getSpotImage(selectedNode.id, image.image_id);
          setImages((prev) => {
            let tempImages = [...prev];
            tempImages[index] = {
              image: spotImage.data.image,
              imageId: image.image_id,
            };
            return [...tempImages];
          });
        });
    };

    if (data?.spot_images && imagesModal) {
      setImages(() => {
        let tempImages = [];
        data.spot_images.forEach(() => {
          tempImages = [...tempImages, false];
        });
        return [...tempImages];
      });

      loadImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, imagesModal]);

  useEffect(() => {
    if (imagesModal) {
      setActiveCarouselItem(0);
    } else {
      if (hasDeleted) {
        loadData(selectedNode.id);
        setHasDeleted(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesModal]);

  useEffect(() => {
    setImages([]);
  }, [selectedNode.id]);

  const handleCarouselItem = (item = 0) => {
    setActiveCarouselItem(item);
  };

  const handleNextItem = () => {
    setActiveCarouselItem((prev) => {
      if (prev + 1 === images.length) {
        return 0;
      }
      return prev + 1;
    });
  };

  const handlePreviousItem = () => {
    setActiveCarouselItem((prev) => {
      if (prev === 0) {
        return images.length - 1;
      }
      return prev - 1;
    });
  };

  const handleDeleteModal = () => {
    setDeleteModal((prev) => {
      return !prev;
    });
  };

  const addImage = () => {
    setImagesModal(false);
    setUploadImagesModal(true);
  };

  const deleteImage = async (index, id) => {
    setDeletingImage(true);
    try {
      await deleteSpotImage(selectedNode.id, id);
      setDeletingImage(false);
      handleDeleteModal();
      setHasDeleted(true);
      if (images.length === 1) {
        setImagesModal(false);
      }
      setImages((prev) => {
        const currentImages = [...prev];
        currentImages.splice(index, 1);
        return currentImages;
      });
      setActiveCarouselItem(0);
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      setDeletingImage(false);
    }
  };

  return {
    selectedNode,
    imagesModal,
    images,
    activeCarouselItem,
    deleteModal,
    handleCarouselItem,
    handleNextItem,
    handlePreviousItem,
    handleDeleteModal,
    addImage,
    deleteImage,
    deletingImage,
  };
};

export default useSpotImagesModal;
