import { useState, useEffect } from "react";
import { ProductReviewMenu } from "../../../../meta/ProductReviewMenu";
import { IOrders } from "../../../../interfaces/IOrders";
import { axiosClient } from "../../../../libraries/axiosClient";
import { useUser } from "../../../../hooks/useUser";
import numeral from "numeral";
import PopupOrderDetail from "../Popup/PopupOrderDetail";
import orderEmty from "../../../../assets/orderEmty.png";
import PopupProductViews from "../Popup/PopupProductViews";
import { IProductReviews } from "../../../../interfaces/IProductReviews";
import { Link } from "react-router-dom";
function ProductRewiews() {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("ALL");
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [showPopupView, setShowPopupView] = useState<boolean>(false);
  const [showPopupProductView, setShowPopupProductView] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>([]);
  const { users } = useUser((state) => state) as any;
  const [productReviews, setProductReviews] = useState<IProductReviews[]>([]);
  useEffect(() => {
    axiosClient.get("/orders").then((response) => {
      if (users.user?._id) {
        // Nếu có thông tin người dùng, lọc đơn hàng của người dùng đã đăng nhập
        const userOrders = response.data.filter(
          (order) => order.customer_id === users.user?._id
        );

        if (selectedOrderStatus !== "ALL") {
          const filtered = userOrders.filter(
            (order) => order.status === selectedOrderStatus
          );
          setOrders(filtered);
        } else {
          setOrders(userOrders);
        }
      }
    });
  }, [selectedOrderStatus]);

  useEffect(() => {
    axiosClient.get("/product-review").then((response) => {
      setProductReviews(response.data);
    });
  }, []);
  const closePopupView = () => {
    setShowPopupView(false);
  };
  const closePopupProductView = () => {
    setShowPopupProductView(false);
  };
  const findStatusLabel = (statusValue) => {
    const statusObject = ProductReviewMenu.find(
      (item) => item.value === statusValue
    );
    return statusObject ? statusObject.label : "Không xác định";
  };
  return (
    <>
      <div className="w-full bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 items-center lg:mb-0 mb-3">
        <h3 className="h-full w-full flex items-center justify-center text-3xl lg:text-4xl text-white font-bold">
          ĐƠN HÀNG ĐÃ MUA
        </h3>
      </div>
      <div className="">
        <ul className="bg-gray-100 py-5 px-10 grid grid-cols-3 lg:grid-cols-9 text-sm lg:text-xl lg:gap-0 gap-10">
          {ProductReviewMenu.map((item, index) => {
            return (
              <li
                className={`${
                  item.value === selectedOrderStatus
                    ? "border-b-2 border-red-500 text-red-500"
                    : ""
                } cursor-pointer hover:text-red-500 text-center`}
                key={index}
                onClick={() => setSelectedOrderStatus(item.value)}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
      {orders.length > 0 ? (
        orders &&
        orders.map((order, index) => {
          const existingReview = productReviews.find(
            (review) => review?.order_id === order?._id?.toString()
          );
          return (
            <div key={index} className="w-[80%] mx-auto">
              <div className="mt-10 text-right border p-5 flex justify-end font-bold gap-4">
                <p className="text-red-500 ">
                  {findStatusLabel(order.status).toLocaleUpperCase()}
                </p>
                {existingReview && existingReview.reviewCount > 0 ? (
                  <div className="border-l">
                    <p className="pl-4 text-primary_green">ĐÃ ĐÁNH GIÁ</p>
                  </div>
                ) : (
                  <div className="border-l">
                    <p className="pl-4 text-red-500">CHƯA ĐÁNH GIÁ</p>
                  </div>
                )}
              </div>
              <div className=" border h-autorounded-lg">
                {order.order_details &&
                  order.order_details.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          order.order_details &&
                          order.order_details.length > 1 &&
                          index !== order.order_details.length - 1
                            ? "border-b "
                            : ""
                        } p-5 flex gap-10 mx-5`}
                      >
                        <div>
                          <img
                            src={item.product?.product_image}
                            alt="image"
                            className="w-[100px] h-[100px] object-contain"
                          />
                        </div>
                        <div className="">
                          <p className="">{item.product?.name}</p>
                          <span>Số lượng: {item.quantity}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="border h-auto rounded-lg bg-[#fffefb] font-bold pt-5 pr-5 text-right text-xl">
                <span>Thành tiền: </span>
                <span className="text-red-500 ">
                  {numeral(order.total_money_order)
                    .format("0,0")
                    .replace(/,/g, ".")}{" "}
                  vnđ
                </span>
                <div className="flex text-[15px] justify-end gap-5 mt-10 mb-5">
                  <button
                    className="border rounded-lg py-2 px-5"
                    onClick={() => {
                      setShowPopupView(true), setSelectedOrder(order);
                    }}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="border rounded-lg py-2 px-5"
                    onClick={() => {
                      if (order.status === "DELIVERED") {
                        if (
                          existingReview?.reviewCount &&
                          existingReview?.reviewCount === 2
                        ) {
                          alert("Bạn đã hết lượt đánh giá !!!");
                        } else {
                          setShowPopupProductView(true);
                          setSelectedOrder(order);
                        }
                      } else {
                        alert(
                          "Chỉ được phép đánh giá khi đơn hàng chưa giao thành công !!!"
                        );
                      }
                    }}
                  >
                    Đánh giá
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="mt-10 w-[80%] mx-auto border text-center ">
          <div className="flex items-center justify-center mt-5">
            <img src={orderEmty} alt="image" className="" />
          </div>
          <div className="my-5 text-2xl">Chưa có đơn hàng</div>
        </div>
      )}
      <PopupOrderDetail
        showPopup={showPopupView}
        closePopupView={closePopupView}
        users={users}
        selectedOrder={selectedOrder}
      />
      <PopupProductViews
        showPopup={showPopupProductView}
        closePopupProductView={closePopupProductView}
        selectedOrder={selectedOrder}
        productReviews={productReviews}
      />
    </>
  );
}

export default ProductRewiews;
