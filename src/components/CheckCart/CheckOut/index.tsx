import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosClient } from "../../../libraries/axiosClient";
import { useUser } from "../../../hooks/useUser";
import CheckOutCard from "./CheckOutCard";
import { IAccumulated } from "../../../interfaces/Accumulated";
import { ICustomer } from "../../../interfaces/ICustomers";
import PopupVnpayReturnUrl from "./PopupVnpayReturnUrl";
interface IOrderDetails {
  product_id: string;
  variants_id: string;
  quantity: number;
}

// YUP VALIDATE
const ordersSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "Họ - Tên đệm phải dài từ 2 - 50 ký tự")
    .max(50, "Họ - Tên đệm phải dài từ 2 - 50 ký tự")
    .required("Họ - Tên đệm không được trống"),
  last_name: Yup.string().required("Tên không được trống"),
  phoneNumber: Yup.string()
    .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại không được trống"),
  shipping_address: Yup.string()
    .min(5, "Địa chỉ phải dài từ 5 - 100 ký tự")
    .max(100, "Địa chỉ phải dài từ 5 - 100 ký tự")
    .required("Địa chỉ không được trống"),
});

const CheckOut = () => {
  // payment paypal
  const { users, updateUser } = useUser((state) => state) as any;
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [sdkReady, setSdkReady] = useState(false);
  const [accumulated, setAccumulated] = useState<IAccumulated[]>([]);
  const [pointStatus, setPointStatus] = useState(false);
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  const [showPopupVnpayUrl, setShowPopupVnpayUrl] = useState(false);
  const [checkInput, setCheckInput] = useState(0);
  const [paymentFunction, setPaymentFunction] = useState();
  // total nhận từ component con checkOutCard
  const [total, setTotal] = useState<number>(0);

  const closePopupVnpayUrl = () => {
    setShowPopupVnpayUrl(false);
  };
  //chứa tên tp vừa chọn
  console.log("paymentMethod", paymentMethod);

  // const [selectedCity, setSelectedCity] = React.useState<typeCity>();

  // hàm để set lại giá trị khi chọn các phương thức thanh toán
  const handlePointStatusChange = (newPointStatus) => {
    setPointStatus(newPointStatus); // Cập nhật giá trị pointStatus ở component cha
  };

  // tính tổng giỏ hàng
  let totalOrder = 0;
  if (customer.customer_cart && customer.customer_cart.length > 0) {
    totalOrder = customer.customer_cart.reduce((total, item) => {
      const variantsPrice = item.variants?.price || item.product?.price || 0;

      const priceDiscount =
        (variantsPrice * (100 - item.product?.discount)) / 100;

      return total + (priceDiscount || 0) * (item.quantity || 0);
    }, 0);
  }

  // Tính toán tổng số điểm mới
  const currentPoints = users.user?.points;
  const percent = accumulated[0]?.percent;
  let orderPoints = 0;
  if (percent !== undefined) {
    orderPoints = (totalOrder * percent) / 100;
    // Sử dụng orderPoints ở đây
  }
  // tổng số tiền tích lũy muốn trừ vào tổng hóa đơn

  // hàm callback gửi tới component con checkOutCard
  const handleTotalChange = (newTotal: number) => {
    setTotal(newTotal);
  };
  const points = users.user?.points;

  const newPoints = currentPoints + orderPoints;

  // Xử lý Form Thanh Toán
  const formik = useFormik({
    initialValues: {
      first_name: users.user?.first_name,
      last_name: users.user?.last_name,
      shipping_address: users.user?.address,
      phoneNumber: users.user?.phone_number,
      order_details: [] as IOrderDetails[],
      total_money_order: total,
      payment_information: paymentMethod,
      customer_id: users?.user ? users.user?._id : "",
      payment_status: false,
      status: "",
    },
    validationSchema: ordersSchema,
    onSubmit: async (values) => {
      // console.log("values", values);
      // Cập nhật trường points của khách hàng
      if (pointStatus === true) {
        await axiosClient.patch(`/customers/${users.user._id}`, {
          points: newPoints - currentPoints,
        });
        updateUser({ points: newPoints - currentPoints });
      } else {
        await axiosClient.patch(`/customers/${users.user._id}`, {
          points: newPoints,
        });
        updateUser({ points: newPoints });
      }
      values.order_details = [];
      values.customer_id = users.user._id;
      values.payment_status = false;
      values.status = "WAIT FOR CONFIRMATION";
      values.total_money_order = total;
      if (
        users.user &&
        customer.customer_cart &&
        customer.customer_cart.length > 0
      ) {
        customer.customer_cart.forEach((item) => {
          const orderDetail: IOrderDetails = {
            product_id: item?.product._id,
            variants_id: item?.variants_id,
            quantity: item?.quantity,
          };
          values.order_details.push(orderDetail);
        });
      }
      await axiosClient
        .post("/orders", values)
        .then((response) => {
          axiosClient.patch(`/orders/${response.data._id}`, {
            payment_status: false,
          });
          window.localStorage.removeItem("cart-storage");
          window.location.replace("/shop");
          window.alert("Đặt hàng thành công");
        })
        .catch(() => {
          window.alert("Đặt hàng thất bại");
        });
    },
  });

  // get customer
  useEffect(() => {
    axiosClient.get("/customers").then((response) => {
      response.data.find((item) => {
        if (item?._id === users.user?._id) {
          setCustomer(item);
        }
      });
    });
  }, [users.user?._id]);

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
    formik.setFieldValue("payment_information", selectedPaymentMethod);

    // Cập nhật hàm thanh toán tương ứng
    if (selectedPaymentMethod === "VNPAY") {
      setPaymentFunction(() => paymentVnpayClick);
    } else if (selectedPaymentMethod === "MOMO") {
      setPaymentFunction(() => paymentMoMoClick);
    }
  };

  const onSuccessPaypal = async (details, data) => {
    // Create an object containing the order data
    const orderData = {
      // Populate the order data based on the formik values
      // Assuming you have access to the formik values here
      first_name: formik.values?.first_name,
      last_name: formik.values?.last_name,
      shipping_address: formik.values.shipping_address,
      phoneNumber: formik.values?.phoneNumber,
      order_details: [] as IOrderDetails[],
      payment_information: paymentMethod,
      payment_status: true,
      total_money_order: total,

      customer_id: users.user?._id,
      status: "WAITING FOR PICKUP",
    };
    orderData.total_money_order = total;
    if (
      users.user &&
      customer.customer_cart &&
      customer.customer_cart.length > 0
    ) {
      customer.customer_cart.forEach((item) => {
        const orderDetail = {
          product_id: item.product._id,
          variants_id: item?.variants_id,
          quantity: item.quantity,
        };
        orderData.order_details.push(orderDetail);
      });
    }
    try {
      // Cập nhật trường accumulated_money của khách hàng
      if (pointStatus === true) {
        await axiosClient.patch(`/customers/${users.user._id}`, {
          points: newPoints - currentPoints,
        });
        updateUser({ points: newPoints - currentPoints });
      } else {
        await axiosClient.patch(`/customers/${users.user._id}`, {
          points: newPoints,
        });
        updateUser({ points: newPoints });
      }
      // Send the order data to the server
      await axiosClient.post("/orders", orderData);
      window.alert("Đặt hàng với thanh toán paypal thành công");
      // Sau một khoảng thời gian, chuyển hướng đến "/shop"
      setTimeout(() => {
        window.localStorage.removeItem("cart-storage");
        window.location.replace("/shop");
      }, 4000);
    } catch (error) {
      console.error(error);
      window.alert("Đặt hàng với thanh toán paypal thất bại");
    }
    // OPTIONAL: Call your server to save the transaction
    return fetch("/paypal-transaction-complete", {
      method: "post",
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    });
  };
  // hàm add Script paypal
  const addPaypalScript = async () => {
    const { data } = await axiosClient.get("/payment-paypal");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data.data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  // payment vnpay

  const queryParams = new URLSearchParams(window.location.search);

  // vnpay
  const vnpResponseCode = queryParams.get("vnp_ResponseCode");
  const vnpTransactionStatus = queryParams.get("vnp_TransactionStatus");
  const storedTotal = window.localStorage.getItem("totalForVnpay");
  const vnp_Amount = queryParams.get("vnp_Amount");
  const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
  const vnp_BankCode = queryParams.get("vnp_BankCode");
  const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
  const vnp_PayDate = queryParams.get("vnp_PayDate");

  // momo
  const resultCode = queryParams.get("resultCode");
  const amount = queryParams.get("amount");
  useEffect(() => {
    if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
      // Nếu query parameters đúng, thiết lập giá trị để mở popup
      setShowPopupVnpayUrl(true);
    }
  }, []); // useEffect chỉ chạy một lần sau khi component mount

  // const checkInputData = async () => {
  //   let isLogShown = false;
  //   const requiredFields: {
  //     [key in keyof typeof formik.values]: string;
  //   } = {
  //     first_name: "Họ",
  //     last_name: "Tên",
  //     shipping_address: "Địa chỉ",
  //     phoneNumber: "Số điện thoại",
  //   };

  //   const missingFields: string[] = [];
  //   for (const field in requiredFields) {
  //     if (!formik.values[field]) {
  //       missingFields.push(requiredFields[field]);
  //     }
  //   }
  //   setCheckInput(missingFields.length);
  //   if (missingFields.length > 0) {
  //     if (!isLogShown) {
  //       alert(`Vui lòng nhập đầy đủ thông tin ${missingFields.join(", ")}`);
  //       isLogShown = true;
  //     }

  //     return false;
  //   }
  //   return true;
  // };

  // onclick vnpay
  const paymentVnpayClick = async () => {
    // Lưu giá trị total vào localStorage
    localStorage.setItem("formValues", JSON.stringify(formik.values));
    window.localStorage.setItem("totalForVnpay", `${total}`);
    // Chuyển đối tượng thành chuỗi JSON và lưu vào localStorage
    window.localStorage.setItem("customerdata", JSON.stringify(customer));
    const paymentUrl = await axiosClient.post(
      "/payment/create_paymentVnpay_url",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        amount: total,
        bankCode: "NCB",
        orderDescription: "Thanh toan don hang",
        orderType: "other",
        language: "vn",
      }
    );
    window.location.replace(paymentUrl.data);
  };

  // onclick momo

  const paymentMoMoClick = async () => {
    // Lưu giá trị total vào localStorage
    localStorage.setItem("formValues", JSON.stringify(formik.values));
    // Chuyển đối tượng thành chuỗi JSON và lưu vào localStorage
    window.localStorage.setItem("customerdata", JSON.stringify(customer));
    try {
      const response = await axiosClient.post(
        "/payment/create_paymentMoMo_url",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          amount: total,
        }
      );

      // Lấy payUrl từ phản hồi của server
      const payUrl = response.data.payUrl;
      // Chuyển hướng đến URL thanh toán Momo
      window.location.replace(payUrl);
    } catch (error) {
      console.error("Lỗi tạo URL thanh toán Momo: ", error);
    }
  };

  // thanh toán vnpay
  const onSuccessVnpay = async () => {
    // Kiểm tra xem đã chuyển hướng trở lại từ VNPay hay chưa
    if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
      const storedTotal = window.localStorage.getItem("totalForVnpay");
      const storedFormValues = window.localStorage.getItem("formValues");
      const formValues = storedFormValues ? JSON.parse(storedFormValues) : {};
      // Lấy dữ liệu từ localStorage
      const storedCustomerData = window.localStorage.getItem("customerdata");

      // Chuyển chuỗi JSON thành đối tượng
      const storedCustomer: ICustomer[] = storedCustomerData
        ? JSON.parse(storedCustomerData)
        : [];
      const orderData = {
        first_name: formValues?.first_name,
        last_name: formValues?.last_name,
        shipping_address: formValues?.shipping_address,
        phoneNumber: formValues?.phoneNumber,
        order_details: [] as IOrderDetails[],
        payment_information: paymentMethod,
        payment_status: true,
        total_money_order: storedTotal,
        customer_id: users.user?._id,
        status: "WAITING FOR PICKUP",
      };
      orderData.total_money_order = storedTotal;
      orderData.payment_information = "VNPAY";
      if (users.user) {
        storedCustomer.customer_cart.forEach((item) => {
          const orderDetail = {
            product_id: item?.product._id,
            variants_id: item?.variants_id,
            quantity: item?.quantity,
          };
          orderData.order_details.push(orderDetail);
        });
      }
      try {
        // Cập nhật trường accumulated_money của khách hàng
        if (pointStatus === true) {
          await axiosClient.patch(`/customers/${users.user._id}`, {
            points: newPoints - currentPoints,
          });
          updateUser({ points: newPoints - currentPoints });
        } else {
          await axiosClient.patch(`/customers/${users.user._id}`, {
            points: newPoints,
          });
          updateUser({ points: newPoints });
        }
        await axiosClient.post("/orders", orderData);
        window.alert("Đặt hàng với thanh toán vnpay thành công");
        // Sau một khoảng thời gian, chuyển hướng đến "/shop"
        setTimeout(() => {
          window.location.replace("/shop");
          window.localStorage.removeItem("totalForVnpay");
          window.localStorage.removeItem("customerdata");
          window.localStorage.removeItem("formValues");
        }, 10000);
      } catch (error) {
        console.error(error);
        window.alert("Đặt hàng với thanh toán vnpay thất bại");
      }
    } else {
      alert("Thanh toán thất bại, hủy thanh toán !!!");
      setTimeout(() => {
        window.location.replace("/shop");
        window.localStorage.removeItem("totalForVnpay");
        window.localStorage.removeItem("customerdata");
        window.localStorage.removeItem("formValues");
      }, 2000);
    }
  };
  useEffect(() => {
    if (vnpResponseCode && vnpTransactionStatus) {
      onSuccessVnpay();
    }
  }, [vnpResponseCode, vnpTransactionStatus]);

  // thanh toán momo
  const onSuccessMoMo = async () => {
    // Kiểm tra xem đã chuyển hướng trở lại từ MoMo hay chưa
    if (resultCode === "0") {
      const storedFormValues = window.localStorage.getItem("formValues");
      const formValues = storedFormValues ? JSON.parse(storedFormValues) : {};
      // Lấy dữ liệu từ localStorage
      const storedCustomerData = window.localStorage.getItem("customerdata");

      // Chuyển chuỗi JSON thành đối tượng
      const storedCustomer: ICustomer[] = storedCustomerData
        ? JSON.parse(storedCustomerData)
        : [];
      const orderData = {
        first_name: formValues?.first_name,
        last_name: formValues?.last_name,
        shipping_address: formValues?.shipping_address,
        phoneNumber: formValues?.phoneNumber,
        order_details: [] as IOrderDetails[],
        payment_information: paymentMethod,
        payment_status: true,
        total_money_order: amount,
        customer_id: users.user?._id,
        status: "WAITING FOR PICKUP",
      };
      orderData.total_money_order = amount;
      orderData.payment_information = "MOMO";
      if (users.user) {
        if (storedCustomer?.customer_cart !== undefined) {
          storedCustomer?.customer_cart.forEach((item) => {
            const orderDetail = {
              product_id: item?.product._id,
              variants_id: item?.variants_id,
              quantity: item?.quantity,
            };
            orderData.order_details.push(orderDetail);
          });
        }
      }
      try {
        // Cập nhật trường accumulated_money của khách hàng
        if (pointStatus === true) {
          await axiosClient.patch(`/customers/${users.user._id}`, {
            points: newPoints - currentPoints,
          });
          updateUser({ points: newPoints - currentPoints });
        } else {
          await axiosClient.patch(`/customers/${users.user._id}`, {
            points: newPoints,
          });
          updateUser({ points: newPoints });
        }
        await axiosClient.post("/orders", orderData);
        window.alert("Đặt hàng với thanh toán momo thành công");
        // Sau một khoảng thời gian, chuyển hướng đến "/shop"
        setTimeout(() => {
          window.location.replace("/shop");
          window.localStorage.removeItem("customerdata");
          window.localStorage.removeItem("formValues");
        }, 1000);
      } catch (error) {
        console.error(error);
        window.alert("Đặt hàng với thanh toán momo thất bại");
      }
    } else {
      alert("Thanh toán thất bại, hủy thanh toán !!!");
      setTimeout(() => {
        window.location.replace("/shop");
        window.localStorage.removeItem("customerdata");
        window.localStorage.removeItem("formValues");
      }, 2000);
    }
  };
  useEffect(() => {
    // Kiểm tra xem resultCode có giá trị không
    if (resultCode) {
      onSuccessMoMo();
    }
  }, [resultCode]);

  useEffect(() => {
    axiosClient
      .get("/accumulateds")
      .then((response) => {
        setAccumulated(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="w-full bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center">
        <h1 className="h-full w-full flex items-center justify-center text-2xl lg:text-4xl text-white font-bold">
          THANH TOÁN
        </h1>
      </div>
      <form action="" onSubmit={formik.handleSubmit}>
        <div className="container lg:px-0 px-10">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-7 md:mr-4">
              <div className="flex mt-8 gap-2">
                <h1 className="text-black font-bold">Bạn có tài khoản chưa?</h1>
                <a
                  href="/component/auth/register"
                  className="text-primary_green underline font-semibold"
                >
                  Đi tới đăng nhập
                </a>
              </div>

              <div className="mt-8">
                <h1 className="text-[22px] font-semibold">
                  THANH TOÁN & VẬN CHUYỂN
                </h1>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="md:flex md:gap-4">
                    <div className="w-full">
                      <div className="mb-1">
                        <span className="text-[18px] font-medium">Họ đệm </span>
                        <span className="ml-1 text-red-600 text-[20px]">*</span>
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                      />
                      <p className="text-red-500">
                        {formik.touched.first_name
                          ? formik.errors.first_name
                          : null}
                      </p>
                    </div>
                    <div className="w-full">
                      <div className="mb-1">
                        <span className="text-[18px] font-medium">Tên</span>
                        <span className="ml-1 text-red-600 text-[20px]">*</span>
                      </div>
                      <input
                        type="text"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                      />
                      <p className="text-red-500">
                        {formik.touched.last_name
                          ? formik.errors.last_name
                          : null}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col mt-3">
                    <div className="flex">
                      <h2 className="font-semibold">Địa chỉ</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      name="shipping_address"
                      value={formik.values.shipping_address}
                      onChange={formik.handleChange}
                      // value={isLocation}
                      // onChange={handleLocation}
                      onBlur={formik.handleBlur}
                      placeholder="House number and street name"
                      className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                    />
                    <p className="text-red-500">
                      {formik.touched.shipping_address
                        ? formik.errors.shipping_address
                        : null}
                    </p>
                  </div>

                  <div className="flex flex-col mt-3">
                    <div className="flex">
                      <h2 className="font-semibold">Số điện thoại</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                    />
                    <p className="text-red-500">
                      {formik.touched.phoneNumber
                        ? formik.errors.phoneNumber
                        : null}
                    </p>
                  </div>
                  <div className="flex flex-col mt-3">
                    <div className="lg:flex gap-8 mt-3">
                      <h1 className="font-semibold mb-3">
                        Phương thức thanh toán
                      </h1>
                      <div className="flex flex-col ">
                        <div className="flex gap-1 ">
                          <input
                            type="radio"
                            id="CASH"
                            name="payment_information"
                            value="CASH"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "CASH"}
                          />
                          <label htmlFor="CASH" className="cursor-pointer">
                            Thanh toán bằng tiền mặt
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <input
                            type="radio"
                            id="paypal_payment"
                            name="payment_information"
                            value="PAYPAL"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "PAYPAL"}
                          />
                          <label
                            htmlFor="paypal_payment"
                            className="cursor-pointer"
                          >
                            Thanh toán bằng paypal
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <input
                            type="radio"
                            id="VNPAY"
                            name="payment_information"
                            value="VNPAY"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "VNPAY"}
                          />
                          <label htmlFor="VNPAY" className="cursor-pointer">
                            Thanh toán bằng vnpay
                          </label>
                        </div>
                        <div className="flex gap-1">
                          <input
                            type="radio"
                            id="MOMO"
                            name="payment_information"
                            value="MOMO"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "MOMO"}
                          />
                          <label htmlFor="MOMO" className="cursor-pointer">
                            Thanh toán bằng momo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 md:mt-8">
              <div className="mt-4 bg-[#f7f7f7] p-3">
                <CheckOutCard
                  totalOrder={totalOrder}
                  paymentMethod={paymentMethod}
                  sdkReady={sdkReady}
                  onSuccessPaypal={onSuccessPaypal}
                  orderPoints={orderPoints}
                  points={points}
                  customer={customer}
                  onPointStatusChange={handlePointStatusChange} // Truyền hàm callback vào component con
                  onTotalChange={handleTotalChange} // Truyền hàm callback
                  paymentFunction={paymentFunction} // Truyền hàm thanh toán qua prop
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <PopupVnpayReturnUrl
        showPopup={showPopupVnpayUrl}
        closePopup={closePopupVnpayUrl}
        storedTotal={storedTotal}
        vnpResponseCode={vnpResponseCode}
        vnpTransactionStatus={vnpTransactionStatus}
        vnp_Amount={vnp_Amount}
        vnp_TransactionNo={vnp_TransactionNo}
        vnp_BankCode={vnp_BankCode}
        vnp_OrderInfo={vnp_OrderInfo}
        vnp_PayDate={vnp_PayDate}
      />
    </>
  );
};
export default CheckOut;
