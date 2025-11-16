import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Toast.css";

export default function Toast(message, type = "info") {
  switch(type) {
    case "success":
      toast.success(message, { className: "customToast" });
      break;
    case "error":
      toast.error(message, { className: "customToast" });
      break;
    case "warn":
      toast.warn(message, { className: "customToast" });
      break;
    default:
      toast.info(message, { className: "customToast" });
  }
}
