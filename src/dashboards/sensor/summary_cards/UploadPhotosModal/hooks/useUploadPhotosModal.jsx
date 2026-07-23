import { useEffect, useRef, useState } from "react";
import { insertImagePost } from "../apis/insertImagePost";
import FeedbackToast from "../../../../../components/FeedbackToast/FeedbackToast";

const useUploadPhotosModal = (
  dismissFunc,
  loadData,
  setSummaryLoading,
  spotId,
  data
) => {
  const [files, setFiles] = useState([]);
  const [favouriteImage, setFavouriteImage] = useState(null);
  const [inputText, setInputText] = useState("Arraste e solte uma imagem");
  const fileInputRef = useRef(null);
  const disabled = files?.length >= 5 - data.spot_images.length;

  useEffect(() => {
    const verifyScreenSize = () => {
      if (window.innerWidth < 992) {
        setInputText("Adicione suas imagens");
      } else {
        setInputText("Arraste e solte uma imagem");
      }
    };

    verifyScreenSize();

    window.addEventListener("resize", verifyScreenSize);

    return () => {
      window.removeEventListener("resize", verifyScreenSize);
    };
  }, []);

  const deleteImage = (index) => {
    if (favouriteImage === index) {
      if (files.length > 1) {
        setFavouriteImage(0);
      } else {
        setFavouriteImage(null);
      }
    } else {
      if (index < favouriteImage) {
        setFavouriteImage(favouriteImage - 1);
      }
    }
    setFiles((files) => files.filter((item, i) => i !== index));
  };

  const saveHandler = async () => {
    const requisitions = async (spotId) => {
      for (const [index, file] of files.entries()) {
        await insertImagePost(spotId, {
          file: file.substring("data:image/jpeg;base64,".length),
          is_favorite: favouriteImage === index,
        });
      }
    };

    if (files?.length > 0) {
      dismissFunc();
      setSummaryLoading(true);
      setFiles([]);
      setFavouriteImage(null);
      try {
        await requisitions(spotId);
        FeedbackToast.success();
      } catch (error) {
        console.error(error);
        FeedbackToast.error();
      } finally {
        loadData(spotId);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      let fileList = e.target.files;
      for (
        let num = 0;
        num < fileList.length &&
        num + files.length < 5 - data.spot_images.length;
        num++
      ) {
        if (num === 0 && !favouriteImage) {
          setFavouriteImage(0);
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles((prev) =>
            prev ? [...prev, reader.result] : [reader.result]
          );
        };
        reader.readAsDataURL(fileList[num]);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileChange({ target: { files: files } });
  };

  return {
    disabled,
    inputText,
    handleFileChange,
    files,
    favouriteImage,
    setFavouriteImage,
    deleteImage,
    saveHandler,
    fileInputRef,
    handleDrop,
  };
};

export default useUploadPhotosModal;
