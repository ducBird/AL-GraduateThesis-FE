import React, { useState } from "react";
import { IProduct } from "../../../../interfaces/IProducts";
import { AiOutlineClose } from "react-icons/ai";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
type Props = {
  items: IProduct[];
  totalOrder: number;
  paymentMethod: string;
  checkInput: number;
  sdkReady: boolean;
  onSuccessPaypal: (details: any, data: any) => void;
  orderPoints: number;
  points: number;
  onPointStatusChange: any;
};

function CheckOutCard({
  items,
  totalOrder,
  paymentMethod,
  checkInput,
  sdkReady,
  onSuccessPaypal,
  orderPoints,
  points,
  onPointStatusChange, // Hàm callback để thông báo thay đổi pointStatus
}: Props) {
  const [pointStatus, setPointStatus] = useState(false);
  const handleCheckboxClick = () => {
    setPointStatus(!pointStatus); // Đảo ngược giá trị của pointStatus
    onPointStatusChange(!pointStatus); // Gọi hàm callback và truyền giá trị mới
  };

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
            {items.length > 0 ? (
              items.map((item: any, index) => {
                return (
                  <tr
                    className="flex justify-between p-3 border-t-2"
                    key={index}
                  >
                    <td className="flex w-full p-3">
                      <div className="flex-none w-[100px]">
                        <img
                          className="w-[90%] bg-cover"
                          src={item.product.product_image}
                          alt=""
                        />
                      </div>
                      <div className="ml-2 flex flex-col gap-2">
                        <h2 className="font-medium leading-[20px]">
                          {item.product.name}
                        </h2>
                        <div className="leading-[15px] flex flex-col gap-2">
                          <p className="text-primary_green text-[13px] ">
                            only 4 left
                          </p>
                          <span className="text-[12px] flex items-center">
                            <AiOutlineClose />
                            <span className="text-[15px]">{item.quantity}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span>
                        {" "}
                        {numeral(item.quantity * item.product?.total)
                          .format("0,0")
                          .replace(/,/g, ".")}{" "}
                        vnđ
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
              <td className="flex flex-col ">
                <div className="flex justify-end gap-1">
                  <span>Flat rate (May Vary): R150</span>
                  <input type="checkbox" name="name" id="" />
                </div>
                <div className="flex justify-end gap-1">
                  <span>Collect at Easy Scape</span>
                  <input type="checkbox" name="name" />
                </div>
              </td>
            </tr>
            <tr className="flex justify-between p-3  border-t-2">
              <th>Dùng tiền tích lũy</th>
              <td className="flex flex-col ">
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
            <tr className="flex justify-between p-3  border-t-2">
              <th>Tổng</th>
              <td className="text-primary_green font-bold">
                {pointStatus === true
                  ? `${numeral(totalOrder - points)
                      .format("0,0")
                      .replace(/,/g, ".")} vnđ`
                  : `${numeral(totalOrder)
                      .format("0,0")
                      .replace(/,/g, ".")} vnđ`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <h1 className="mt-4 text-[20px] font-bold text-center">PayFast</h1>
      <div className="flex flex-col gap-3">
        <p>
          <strong>Please note: </strong>
          We only ship living products Monday - Thursday (Gauteng) Mon -
          Wednesday (out of Gauteng) because we do not want your plants sitting
          in warehouses over the weekend.
        </p>
        {paymentMethod === "paypal" && sdkReady && checkInput === 0 ? (
          <div className="z-0">
            <PayPalButton
              amount={parseFloat((totalOrder / 20000).toFixed(2))}
              // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
              onSuccess={onSuccessPaypal}
              onError={(error) => {
                alert("Error");
                console.log("error", error);
              }}
            />
          </div>
        ) : (
          <button
            type="submit"
            className={` w-[100%] rounded-[20px] py-3 text-white font-bold hover:bg-opacity-[0.8] ${
              items.length !== 0
                ? "bg-primary_green"
                : " bg-primary_green opacity-50"
            }`}
            disabled={items.length === 0}
          >
            ĐẶT HÀNG
          </button>
        )}
      </div>
    </>
  );
}

export default CheckOutCard;
