import ReactModal from "react-modal";
import { useEffect, useState } from "react";
import { Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { axiosClient } from "../../../../libraries/axiosClient";
// Thiết lập các style cho modal
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "54%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "700px",
    width: "100%",
    height: "300px",
    padding: "20px",
  },
};
interface IModalProps {
  showPopup: boolean;
  closePopupCancel: () => void;
  users: any;
  selectedOrder: any;
}
const PopupCancelOrder: React.FC<IModalProps> = ({
  closePopupCancel,
  showPopup,
  users,
  selectedOrder,
}) => {
  const [cancelReason, setCancelReason] = useState<string>("");
  const handleTextAreaChange = (e) => {
    setCancelReason(e.target.value);
  };
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);
  console.log(selectedOrder);
  const CancelOrderClick = () => {
    const updatedData = {
      status: "CANCELLED",
      cancel_reason: cancelReason,
    };
    axiosClient
      .patch("/orders/" + selectedOrder?._id, updatedData)
      .then(() => {
        alert("Hủy đơn hàng thành công");
        closePopupCancel();
      })
      .catch((err) => {
        alert("Hủy đơn hàng thất bại");
      });
  };
  return (
    <div className="">
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopupCancel}
        style={customStyles}
        contentLabel="Modal"
      >
        <div className="mt-10 mb-20 lg:my-0">
          <h3 className="text-center text-2xl font-bold">
            Bạn có chắc chắn hủy đơn hàng này không?
          </h3>
          <div className="my-10">
            <TextArea
              placeholder="Hãy nhập lý do tại sao bạn muốn hủy đơn hàng này!"
              onChange={handleTextAreaChange}
            />
          </div>
          <div className="absolute bottom-3 w-[95%] mt-12 h-auto p-5 flex gap-10">
            <button
              className="flex-1 border py-3 rounded-md text-white bg-red-500 text-xl"
              onClick={() => {
                CancelOrderClick();
              }}
            >
              Có
            </button>
            <button
              className="flex-1 border py-3 rounded-md text-xl"
              onClick={closePopupCancel}
            >
              Không
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default PopupCancelOrder;
