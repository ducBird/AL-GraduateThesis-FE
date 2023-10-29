import { axiosClient } from "../../../../libraries/axiosClient";
import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import ReactModal from "react-modal";
import { IProduct } from "../../../../interfaces/IProducts";
import ProductVariantOption from "../ProductVariantOption";
// Thiết lập các style cho modal
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "57%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "850px",
    width: "100%",
    height: "520px",
    padding: "20px",
  },
};

interface IModalProps {
  productId: string | undefined;
  showPopup: boolean;
  closePopup: () => void;
}

const PopupVariantOption: React.FC<IModalProps> = ({
  closePopup,
  showPopup,
  productId,
}) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);

  useEffect(() => {
    if (productId) {
      axiosClient.get("/products/product/" + productId).then((response) => {
        setProduct(response.data);
      });
    }
  }, [productId]);
  return (
    <div>
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopup}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="my-4 w-full flex items-center justify-center">
          <p className="text-3xl text-primary_green font-bold">Chọn biến thể</p>
        </div>
        <div className="text-sm">
          <ProductVariantOption product={product} />
        </div>
        <button
          onClick={closePopup}
          className="absolute text-2xl top-2 right-2 text-red-500"
        >
          <MdOutlineClose />
        </button>
      </ReactModal>
    </div>
  );
};

export default PopupVariantOption;
