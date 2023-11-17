import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import ReactModal from "react-modal";
import { axiosClient } from "../../libraries/axiosClient";
import { IVouchers } from "../../interfaces/IVouchers";
import numeral from "numeral";
import { Radio } from "antd";
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
    height: "650px",
    padding: "20px",
  },
};

interface IModalProps {
  showPopup: boolean;
  closePopupVoucher: () => void;
  totalOrder: number;
  onSelectedVoucherChange: any;
}

const Vouchers: React.FC<IModalProps> = ({
  closePopupVoucher,
  showPopup,
  totalOrder,
  onSelectedVoucherChange,
}) => {
  const [selectedVoucher, setSelectedVoucher] = useState<IVouchers | null>(
    null
  );
  const [selectedVoucherIndex, setSelectedVoucherIndex] = useState<
    number | null
  >(null);
  const [vouchers, setVouchers] = useState<IVouchers[]>([]);
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);
  useEffect(() => {
    axiosClient.get("/vouchers").then((response) => {
      setVouchers(response.data);
    });
  }, []);
  const handleVoucherChange = (e: RadioChangeEvent) => {
    const voucher = vouchers[e.target.value];
    setSelectedVoucherIndex(e.target.value);
    setSelectedVoucher(voucher);
    onSelectedVoucherChange(voucher);
  };
  return (
    <div>
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopupVoucher}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="mt-10 mb-4 lg:mt-0 lg:mb-0">
          <p className="text-2xl font-bold  text-primary_green">Voucher</p>
          <button
            onClick={closePopupVoucher}
            className="absolute text-3xl top-12 lg:top-4 right-4 text-red-500"
          >
            <MdOutlineClose />
          </button>
        </div>
        <div className="lg:mt-10 mb-10 border">
          <Radio.Group
            onChange={handleVoucherChange}
            value={selectedVoucherIndex}
            className="w-full "
          >
            {vouchers &&
              vouchers.map((voucher, index) => {
                return (
                  <div key={index}>
                    <div>
                      <Radio
                        key={index}
                        value={index}
                        disabled={totalOrder < voucher.minimumOrderAmount}
                        className={`${
                          totalOrder < voucher.minimumOrderAmount
                            ? "opacity-50"
                            : ""
                        } my-5 mx-5 border rounded-lg p-5 text-black font-bold flex shadow-lg`}
                      >
                        <div className="flex-1 pl-10">
                          <p>{voucher.name}</p>
                          <p>
                            Đơn tối thiểu{" "}
                            {numeral(voucher.minimumOrderAmount)
                              .format("0,0")
                              .replace(/,/g, ".")}{" "}
                            vnđ
                          </p>
                          <p>
                            Giảm tối đa{" "}
                            {numeral(voucher.maxDiscountAmount)
                              .format("0,0")
                              .replace(/,/g, ".")}{" "}
                            vnđ
                          </p>
                          <p>HSD {voucher.expirationDate.toLocaleString()}</p>
                        </div>
                      </Radio>
                    </div>
                  </div>
                );
              })}
          </Radio.Group>
        </div>
        <div className="text-right mt-5 font-bold">
          <button
            className="border mr-5 px-7 py-2 rounded-lg"
            onClick={closePopupVoucher}
          >
            Trở lại
          </button>
          <button
            className="border bg-red-500 text-white px-7 py-2 rounded-lg"
            onClick={closePopupVoucher}
          >
            OK
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default Vouchers;
