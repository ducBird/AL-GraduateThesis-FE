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
    top: "52%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "1000px",
    width: "100%",
    height: "600px",
    padding: "20px",
  },
};

interface IModalProps {
  productId: string | undefined;
  showPopup: boolean;
  closePopup: () => void;
}

const PopupView: React.FC<IModalProps> = ({
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
        <div className="lg:flex w-full h-full mt-6 lg:mt-0">
          {/* <div className="flex-1 items-center justify-center">
            <img
              src={product?.product_image}
              alt="image"
              className="w-full h-full object-contain p-2"
            />
          </div> */}
          <div className="flex-1 font-semibold cursor-pointer text-sm mt-5">
            {/* <p className="p-2">{product?.name}</p> */}
            <ProductVariantOption product={product} />
          </div>
        </div>
        <button
          onClick={closePopup}
          className="absolute text-3xl top-4 right-4 text-red-500"
        >
          <MdOutlineClose />
        </button>
      </ReactModal>
    </div>
  );
};

export default PopupView;
