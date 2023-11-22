import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import ReactModal from "react-modal";
import numeral from "numeral";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import success from "../../../assets/Success.png";
import failed from "../../../assets/failed.png";
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
    height: "700px",
    padding: "20px",
  },
};

interface IModalProps {
  showPopup: boolean;
  closePopup: () => void;
  vnpTransactionStatus: any;
  vnpResponseCode: any;
  storedTotal: string | null;
  vnp_Amount: any;
  vnp_TransactionNo: any;
  vnp_PayDate: any;
  vnp_OrderInfo: any;
  vnp_BankCode: any;
}

const PopupVnpayReturnUrl: React.FC<IModalProps> = ({
  closePopup,
  showPopup,
  vnpTransactionStatus,
  vnpResponseCode,
  storedTotal,
  vnp_Amount,
  vnp_TransactionNo,
  vnp_PayDate,
  vnp_BankCode,
  vnp_OrderInfo,
}) => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);

  useEffect(() => {
    let intervalId: number;

    if (countdown > 0) {
      // Khởi tạo interval để giảm giá trị countdown mỗi giây
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    // Hủy bỏ interval khi component unmount
    return () => clearInterval(intervalId);
  }, [countdown]);

  return (
    <div>
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopup}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="mt-10 mb-4 lg:mt-0 lg:mb-0">
          <p className="text-3xl font-bold  text-primary_green">
            Thông tin thanh toán
          </p>
          <button
            onClick={() => {
              closePopup(), navigate("/shop");
            }}
            className="absolute text-3xl top-12 lg:top-4 right-4 text-red-500"
          >
            <MdOutlineClose />
          </button>
        </div>
        {vnpResponseCode === "00" &&
          vnpTransactionStatus === "00" &&
          vnp_Amount === vnp_Amount && (
            <div className="lg:mt-10 mb-10 text-xl">
              <p>
                Thành tiền:{" "}
                {numeral(storedTotal).format("0,0").replace(/,/g, ".")} vnđ
              </p>
              <p>
                Nội dung thanh toán: <span>{vnp_OrderInfo}</span>
              </p>
              <p>
                Ngân hàng giao dịch: <span>{vnp_BankCode}</span>
              </p>
              <p>
                Mã giao dịch: <span>{vnp_TransactionNo}</span>
              </p>
              <p>
                Ngày giao dịch:{" "}
                <span>
                  {moment(vnp_PayDate, "YYYY-MM-DDTHH:mm:ssZ").format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
                </span>
              </p>
            </div>
          )}

        <div className="flex items-center justify-center mt-10">
          <img
            className="w-[200px] h-[200px]"
            src={
              vnpResponseCode === "00" &&
              vnpTransactionStatus === "00" &&
              vnp_Amount === vnp_Amount
                ? success
                : failed
            }
            alt=""
          />
        </div>
        <div
          className={`${
            vnpResponseCode === "00" &&
            vnpTransactionStatus === "00" &&
            vnp_Amount === vnp_Amount
              ? "text-primary_green"
              : "text-red-500"
          } mt-10 flex items-center justify-center text-2xl font-bold`}
        >
          <p>
            {vnpResponseCode === "00" &&
            vnpTransactionStatus === "00" &&
            vnp_Amount === vnp_Amount
              ? "Thanh toán thành công"
              : "Thanh toán thất bại"}
          </p>
        </div>
        <div className="mt-10 text-2xl flex items-center justify-center text-blue-500 font-bold">
          <p>{countdown}</p>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <button
            className="border px-4 py-2 text-xl bg-primary_green rounded-lg text-white font-bold"
            onClick={() => navigate("/shop")}
          >
            Trở về
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default PopupVnpayReturnUrl;
