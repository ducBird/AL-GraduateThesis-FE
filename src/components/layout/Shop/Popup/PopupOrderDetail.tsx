import ReactModal from "react-modal";
import { ProductReviewMenu } from "../../../../meta/ProductReviewMenu";
import numeral from "numeral";
import { MdOutlineClose } from "react-icons/md";
import { useEffect } from "react";
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
    maxWidth: "700px",
    width: "100%",
    height: "660px",
    padding: "20px",
  },
};
interface IModalProps {
  showPopup: boolean;
  closePopupView: () => void;
  users: any;
  selectedOrder: any;
}
const PopupOrderDetail: React.FC<IModalProps> = ({
  closePopupView,
  showPopup,
  users,
  selectedOrder,
}) => {
  const findStatusLabel = (statusValue) => {
    const statusObject = ProductReviewMenu.find(
      (item) => item.value === statusValue
    );
    return statusObject ? statusObject.label : "Không xác định";
  };
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);
  return (
    <div className="">
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopupView}
        style={customStyles}
        contentLabel="Modal"
      >
        <div className="mt-10 mb-20 lg:my-0">
          <h3 className="text-center text-2xl font-bold">Thông tin đơn hàng</h3>
          <div className="border my-10 h-auto p-5">
            <div>
              <span className="font-bold">Tên khách hàng: </span>
              <span>
                {users.user?.first_name} {users.user?.last_name}
              </span>
            </div>
            <div>
              <span className="font-bold">Địa chỉ: </span>
              <span>{users.user.address}</span>
            </div>
            <div>
              <span className="font-bold">Số điện thoại: </span>
              <span>{users.user.phone_number}</span>
            </div>
            <div>
              <span className="font-bold">Hình thức thanh toán: </span>
              <span>{selectedOrder.payment_information}</span>
            </div>
            <div>
              <span className="font-bold">Trạng thái vận chuyển: </span>
              <span>{findStatusLabel(selectedOrder.status)}</span>
            </div>
          </div>
          {showPopup &&
            selectedOrder !== undefined &&
            selectedOrder.order_details.map((order, index) => {
              return (
                <div key={index} className="border my-3 h-auto p-5 flex gap-10">
                  <div>
                    <img
                      src={order.product?.product_image}
                      alt="image"
                      className="w-[100px] h-[100px] object-contain"
                    />
                  </div>
                  <div className="">
                    <p className="">{order.product?.name}</p>
                    <span>Số lượng: {order.quantity}</span>
                  </div>
                </div>
              );
            })}
          <div className="text-end font-bold text-lg">
            <span>Thành tiền: </span>
            <span className="text-red-500">
              {numeral(selectedOrder.total_money_order)
                .format("0,0")
                .replace(/,/g, ".")}{" "}
              vnđ
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={closePopupView}
            className="absolute text-3xl top-14 lg:top-4 right-4 text-red-500"
          >
            <MdOutlineClose />
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default PopupOrderDetail;
