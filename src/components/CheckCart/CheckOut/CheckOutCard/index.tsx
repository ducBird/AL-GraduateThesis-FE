import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import Vouchers from "../../../Vouchers";
import { IVouchers } from "../../../../interfaces/IVouchers";
import { ICustomer } from "../../../../interfaces/ICustomers";

type Props = {
  totalOrder: number;
  paymentMethod: string;
  sdkReady: boolean;
  onSuccessPaypal: (details: any, data: any) => void;
  orderPoints: number;
  points: number;
  customer: ICustomer[];
  onPointStatusChange: any;
  onTotalChange: any;
};

function CheckOutCard({
  totalOrder,
  paymentMethod,
  sdkReady,
  onSuccessPaypal,
  orderPoints,
  points,
  customer,
  onPointStatusChange, // Hàm callback để thông báo thay đổi pointStatus
  onTotalChange, // Nhận hàm callback từ component cha
}: Props) {
  console.log("paymentFunction", paymentFunction);
  const [pointStatus, setPointStatus] = useState(false);
  const [showPopupVoucher, setShowPopupVoucher] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<IVouchers | null>(
    null
  );
  const handleCheckboxClick = () => {
    setPointStatus(!pointStatus); // Đảo ngược giá trị của pointStatus
    onPointStatusChange(!pointStatus); // Gọi hàm callback và truyền giá trị mới
  };
  const closePopupVoucher = () => {
    setShowPopupVoucher(false);
  };

  // hàm callback để truyền tới component con
  const handleSelectedVoucherChange = (voucher: IVouchers | null) => {
    setSelectedVoucher(voucher);
  };
  let voucherDiscountPrice = 0;
  if (selectedVoucher?.discountPercentage !== undefined) {
    voucherDiscountPrice =
      totalOrder * (selectedVoucher?.discountPercentage / 100);
  }

  let total = 0;
  if (selectedVoucher === null && pointStatus === true) {
    total = totalOrder - points;
  } else {
    total = totalOrder;
  }

  if (selectedVoucher !== null) {
    if (selectedVoucher.isFreeShipping === true) {
      if (pointStatus === true) {
        total = totalOrder - points - selectedVoucher.price;
      } else {
        total = totalOrder - selectedVoucher.price;
      }
    } else if (selectedVoucher.maxDiscountAmount !== undefined) {
      if (pointStatus === true) {
        if (voucherDiscountPrice > selectedVoucher.maxDiscountAmount) {
          total = totalOrder - points - selectedVoucher.maxDiscountAmount;
        } else {
          total = totalOrder - points - voucherDiscountPrice;
        }
      } else {
        if (voucherDiscountPrice > selectedVoucher.maxDiscountAmount) {
          total = totalOrder - selectedVoucher.maxDiscountAmount;
        } else {
          total = totalOrder - voucherDiscountPrice;
        }
      }
    }
  }
  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  return (
    <>
      <h1 className="text-center py-4 text-[22px] font-bold">
        ĐƠN HÀNG CỦA BẠN
      </h1>
      <div className="">
        <table className="w-[100%] bg-white p-3">
          <thead>
            <tr className="flex justify-between p-3">
              <th>Sản phẩm</th>
              <th>Tổng phụ</th>
            </tr>
          </thead>
          <tbody>
            {customer.customer_cart && customer.customer_cart.length > 0 ? (
              customer.customer_cart.map((item: any, index) => {
                const priceDiscount =
                  (item.variants?.price * (100 - item.product?.discount)) / 100;
                return (
                  <tr
                    className="flex justify-between p-2 border-t-2"
                    key={index}
                  >
                    <td className="flex w-full p-3">
                      <div className="flex-none w-[100px]">
                        <img
                          className="w-[90%] bg-cover"
                          src={item.product?.product_image}
                          alt=""
                        />
                      </div>
                      <div className="ml-2 flex flex-col gap-2">
                        <h2 className="font-medium leading-[20px]">
                          {item.product?.name}
                          {" - "}
                          {item?.product?.variants &&
                          item?.product?.variants.length > 0
                            ? item?.variants?.title
                            : ""}
                        </h2>
                        <div className="leading-[15px] flex flex-col gap-2">
                          <p className="text-primary_green text-[13px] ">
                            4 trong kho
                          </p>
                          <span className="text-[12px] flex items-center">
                            <AiOutlineClose />
                            <span className="text-[15px]">{item.quantity}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="">
                      <span>
                        {item.product?.variants &&
                        item.product?.variants.length > 0
                          ? `${numeral(priceDiscount)
                              .format("0,0")
                              .replace(/,/g, ".")} vnđ`
                          : `${numeral(
                              (item.product?.price *
                                (100 - item.product?.discount)) /
                                100
                            )
                              .format("0,0")
                              .replace(/,/g, ".")} vnđ`}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <Link to="/shop">
                <div className="p-3 text-center cursor-pointer">
                  <p className="py-1 px-4 border bg-primary_green text-white rounded-full">
                    QUAY VỀ CỬA HÀNG
                  </p>
                </div>
              </Link>
            )}
          </tbody>
          <tfoot>
            <tr className="flex justify-between p-3  border-t-2">
              <th>Tổng phụ</th>
              <td>
                {numeral(totalOrder).format("0,0").replace(/,/g, ".")} vnđ
              </td>
            </tr>
            <tr className="flex justify-between p-3  border-t-2">
              <th>Tiền tích lũy</th>
              <td>
                + {numeral(orderPoints).format("0,0").replace(/,/g, ".")} vnđ
              </td>
            </tr>
            <tr className="flex justify-between p-3  border-t-2">
              <th>Vận chuyển</th>
              <td className="">
                {/* <p className="justify-end">
                  {numeral(20000).format("0,0").replace(/,/g, ".")} vnđ
                </p> */}
              </td>
            </tr>
            <div className="voucher flex justify-between p-3 border-t-2 font-bold">
              <p>Voucher</p>
              <p
                className="text-red-500 cursor-pointer"
                onClick={() => setShowPopupVoucher(true)}
              >
                Chọn voucher
              </p>
            </div>
            {points >= 10000 ? (
              <tr className="flex justify-between p-3 border-t-2">
                <th>Dùng tiền tích lũy</th>
                <td className="">
                  <div className="flex justify-end gap-1">
                    <span>-</span>
                    <span>
                      {numeral(points).format("0,0").replace(/,/g, ".")} vnđ
                    </span>
                    <input
                      type="checkbox"
                      name="name"
                      onClick={handleCheckboxClick}
                      checked={pointStatus}
                    />
                  </div>
                </td>
              </tr>
            ) : (
              ""
            )}
            {selectedVoucher !== null && (
              <tr className="flex justify-between p-3  border-t-2">
                <th>Voucher giảm giá</th>
                <td className="">
                  <div className="flex justify-end gap-1">
                    <span>-</span>
                    <span>
                      {numeral(
                        selectedVoucher?.isFreeShipping
                          ? selectedVoucher?.price
                          : voucherDiscountPrice >
                            selectedVoucher?.maxDiscountAmount
                          ? selectedVoucher?.maxDiscountAmount
                          : voucherDiscountPrice
                      )
                        .format("0,0")
                        .replace(/,/g, ".")}{" "}
                      vnđ
                    </span>
                  </div>
                </td>
              </tr>
            )}

            <tr className="flex justify-between p-3  border-t-2">
              <th>Tổng</th>
              <td className="text-primary_green font-bold">
                {numeral(total).format("0,0").replace(/,/g, ".")} vnđ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-col gap-3 mt-10">
        {paymentMethod === "paypal" && sdkReady ? (
          <div className="z-0">
            <PayPalButton
              amount={parseFloat((total / 20000).toFixed(2))}
              // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
              onSuccess={(details, data) => {
                onSuccessPaypal(details, data);
                onTotalChange(total);
              }}
              onError={(error) => {
                alert("Error");
                console.log("error", error);
              }}
            />
          </div>
        ) : (
          <button
            type={paymentMethod === "CASH" ? "submit" : "button"}
            className="w-[100%] rounded-[20px] py-3 text-white font-bold hover:bg-opacity-[0.8] bg-primary_green"
            onClick={() => {
              onTotalChange(total), paymentFunction();
            }}
          >
            ĐẶT HÀNG
          </button>
        )}
      </div>
      <Vouchers
        showPopup={showPopupVoucher}
        closePopupVoucher={closePopupVoucher}
        totalOrder={totalOrder}
        onSelectedVoucherChange={handleSelectedVoucherChange}
      />
    </>
  );
}

export default CheckOutCard;
