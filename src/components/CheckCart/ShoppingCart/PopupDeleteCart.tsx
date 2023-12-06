import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useCarts } from "../../../hooks/useCart";
import { IRemoveCartItem } from "../../../interfaces/IRemoveCartItem";
import { IProduct } from "../../../interfaces/IProducts";
import { axiosClient } from "../../../libraries/axiosClient";

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
    width: "35%",
    height: "200px",
    padding: "20px",
  },
};

interface IModalProps {
  showPopup: boolean;
  closePopup: () => void;
  customer: any;
  items: any;
  productDelete: any;
  users: any;
}

const PopupDeleteCart: React.FC<IModalProps> = ({
  closePopup,
  showPopup,
  customer,
  items,
  productDelete,
  users,
}) => {
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);
  const { remove } = useCarts((state) => state) as any;

  const removeCartItem = () => {
    if (users?.user) {
      const customerId = users?.user?._id;

      // Kiểm tra xem có sản phẩm cần xóa trong giỏ hàng không
      const cartItemToDelete = customer.customer_cart.find(
        (item) => item?._id === productDelete?._id
      );

      if (cartItemToDelete) {
        // Gửi request xóa sản phẩm từ giỏ hàng
        axiosClient
          .delete(`/customers/${customerId}/cart/${productDelete?._id}`)
          .then(() => {
            window.alert("Xóa sản phẩm ra khỏi giỏ hàng thành công");
            window.location.reload();
            closePopup();
          })
          .catch((error) => {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng", error);
          });
      } else {
        console.error("Không tìm thấy sản phẩm trong giỏ hàng");
      }
    } else {
      // Nếu không có người dùng, sử dụng hook remove
      const removeCart: IRemoveCartItem = {
        product: productDelete as IProduct,
      };
      remove(removeCart);
      alert("Xóa sản phẩm ra khỏi giỏ hàng thành công");
      closePopup();
    }
  };
  return (
    <div>
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopup}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p className="text-2xl text-red-500 text-center">
          Bạn có chắc chắn muốn bỏ sản phẩm này ?
        </p>
        <div className="flex items-center justify-center mt-16 gap-6">
          <button
            className="flex-1 border py-2 bg-red-500 text-white rounded-md text-lg"
            onClick={removeCartItem}
          >
            Có
          </button>
          <button
            className="flex-1 border py-2 rounded-md text-lg hover:bg-gray-100"
            onClick={closePopup}
          >
            Không
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default PopupDeleteCart;
