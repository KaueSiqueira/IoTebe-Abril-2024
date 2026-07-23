import React from "react";
import { toast } from "react-toastify";
import { CancelRounded, CheckCircleRounded } from "@mui/icons-material";
import "./styles/FeedbackToast.css";

class FeedbackToast {
  static success(message = "Operação realizada com sucesso!", toastProps = {}) {
    return toast.success(message, {
      icon: <CheckCircleRounded />,
      ...toastProps,
    });
  }

  static error(message = "Falha ao realizar a operação!", toastProps = {}) {
    return toast.error(message, {
      icon: <CancelRounded />,
      ...toastProps,
    });
  }

  static warning(message = "", toastProps = {}) {
    return toast.warning(message, {
      ...toastProps,
    });
  }

  static info(message = "", toastProps = {}) {
    return toast.info(message, {
      ...toastProps,
    });
  }

  static default(message = "", toastProps = {}) {
    return toast(message, { ...toastProps });
  }
}

export default FeedbackToast;
