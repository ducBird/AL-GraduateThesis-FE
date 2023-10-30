import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosClient } from "../../../libraries/axiosClient";
import { useCarts } from "../../../hooks/useCart";
import { useUser } from "../../../hooks/useUser";
// import CheckOutCard from "./CheckOutCard";
import { IAccumulated } from "../../../interfaces/Accumulated";
import numeral from "numeral";
// interface typeCity {
//   id: string;
//   city: string;
// }
interface IOrderDetails {
  product_id: string;
  quantity: number;
}
const ordersSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "Họ - Tên đệm phải dài từ 2 - 50 ký tự")
    .max(50, "Họ - Tên đệm phải dài từ 2 - 50 ký tự")
    .required("Họ - Tên đệm không được trống"),
  last_name: Yup.string().required("Tên không được trống"),
  shipping_information: Yup.string()
    .min(5, "Địa chỉ phải dài từ 5 - 100 ký tự")
    .max(100, "Địa chỉ phải dài từ 5 - 100 ký tự")
    .required("Địa chỉ không được trống"),
  phoneNumber: Yup.string()
    .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại không được trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được trống"),
  shipping_city: Yup.string().required("Thành phố không được trống"),
});
const CheckOut = () => {
  // const [isLocation, setIsLocation] = React.useState<string>("");
  // const [isCity, setIsCity] = React.useState<string>("");
  // payment paypal
  const { updateUser } = useUser((state) => state);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [checkInput, setCheckInput] = useState(0);
  const [sdkReady, setSdkReady] = useState(false);
  const [city, setCity] = React.useState([]);
  const [accumulated, setAccumulated] = useState<IAccumulated[]>([]);
  const [pointStatus, setPointStatus] = useState(false);
  console.log(pointStatus);
  //chứa tên tp vừa chọn
  // const [selectedCity, setSelectedCity] = React.useState<typeCity>();
  // hàm để set lại giá trị khi chọn các phương thức thanh toán
  // zustand
  const { items } = useCarts((state) => state);
  const handlePointStatusChange = (newPointStatus) => {
    setPointStatus(newPointStatus); // Cập nhật giá trị pointStatus ở component cha
  };
  const totalOrder = items.reduce((total, item) => {
    return total + item.product.total * item.quantity;
  }, 0);

  const userString = localStorage.getItem("user-storage");
  const user = userString ? JSON.parse(userString) : null;

  // Tính toán tổng số điểm mới
  const currentPoints = user.state.users.user?.points;
  const percent = accumulated[0]?.percent;
  let orderPoints = 0;
  if (percent !== undefined) {
    orderPoints = (totalOrder * percent) / 100;
    // Sử dụng orderPoints ở đây
  }
  // tổng số tiền tích lũy muốn trừ vào tổng hóa đơn
  const points = user.state.users.user?.points;
  const newTotalOrder = totalOrder - points;
  // if (pointStatus === true) {
  //   console.log(numeral(newTotalOrder).format("0,0").replace(/,/g, "."));
  // }
  const newPoints = currentPoints + orderPoints;
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      shipping_information: "",
      phoneNumber: "",
      email: "",
      shipping_city: "",
      order_details: [] as IOrderDetails[],
      total_money_order: totalOrder,
      payment_information: paymentMethod,
      customer_id: user.state.users.user ? user.state.users.user._id : "",
      payment_status: false,
    },
    validationSchema: ordersSchema,
    onSubmit: async (values) => {
      // Cập nhật trường points của khách hàng
      if (pointStatus === true) {
        await axiosClient.patch(`/customers/${user.state.users.user._id}`, {
          points: newPoints - currentPoints,
        });
        updateUser({ points: newPoints - currentPoints });
      } else {
        await axiosClient.patch(`/customers/${user.state.users.user._id}`, {
          points: newPoints,
        });
        updateUser({ points: newPoints });
      }
      values.order_details = [];
      values.customer_id = user.state.users.user._id;
      values.payment_status = false;
      (values.total_money_order =
        pointStatus === true
          ? `${numeral(newTotalOrder).format("0,0").replace(/,/g, ".")}`
          : totalOrder),
        items.forEach((item) => {
          const orderDetail: IOrderDetails = {
            product_id: item.product._id,
            quantity: item.quantity,
          };
          values.order_details.push(orderDetail);
        });
      await axiosClient
        .post("/orders", values)
        .then((response) => {
          // axiosClient.patch(`/orders/${response.data._id}`, {
          //   payment_status: false,
          // });
          window.localStorage.removeItem("cart-storage");
          window.location.replace("/shop");
          window.alert("Đặt hàng thành công");
        })
        .catch(() => {
          window.alert("Đặt hàng thất bại");
        });
    },
  });
  React.useEffect(() => {
    axios
      .get("https://63528f71a9f3f34c3741633b.mockapi.io/api/v1/users")
      .then((response) => {
        setCity(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log("city", city);

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
    formik.setFieldValue("payment_information", selectedPaymentMethod);
  };

  const onSuccessPaypal = async (details, data) => {
    // Create an object containing the order data
    const orderData = {
      // Populate the order data based on the formik values
      // Assuming you have access to the formik values here
      first_name: formik.values.first_name,
      last_name: formik.values.last_name,
      shipping_information: formik.values.shipping_information,
      phoneNumber: formik.values.phoneNumber,
      email: formik.values.email,
      shipping_city: formik.values.shipping_city,
      order_details: [] as IOrderDetails[],
      payment_information: paymentMethod,
      payment_status: true,
      total_money_order:
        pointStatus === true ? totalOrder - points : totalOrder,
      customer_id: user.state.users.user._id,
    };

    items.forEach((item) => {
      // orderData.customer_id = user.state.users.user._id;
      const orderDetail = {
        product_id: item.product._id,
        quantity: item.quantity,
      };
      orderData.order_details.push(orderDetail);
    });

    try {
      // Cập nhật trường accumulated_money của khách hàng
      if (pointStatus === true) {
        await axiosClient.patch(`/customers/${user.state.users.user._id}`, {
          points: newPoints - currentPoints,
        });
        updateUser({ points: newPoints - currentPoints });
      } else {
        await axiosClient.patch(`/customers/${user.state.users.user._id}`, {
          points: newPoints,
        });
        updateUser({ points: newPoints });
      }
      // Send the order data to the server
      await axiosClient.post("/orders", orderData);
      window.alert("Đặt hàng thành công");
      // Sau một khoảng thời gian, chuyển hướng đến "/shop"
      setTimeout(() => {
        window.localStorage.removeItem("cart-storage");
        window.location.replace("/shop");
      }, 4000);
    } catch (error) {
      console.error(error);
      window.alert("Đặt hàng thất bại");
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
  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  // payment vnpay
  const onSuccessVnpay = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = queryParams.get("vnp_ResponseCode");
    const vnpTransactionStatus = queryParams.get("vnp_TransactionStatus");
    // Kiểm tra xem đã chuyển hướng trở lại từ VNPay hay chưa
    if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
      // Thực hiện gửi yêu cầu đặt hàng
      // Khôi phục dữ liệu từ Local Storage
      let orderData: any;
      try {
        orderData = JSON.parse(localStorage.getItem("formValues") || "{}");
      } catch (error) {
        console.error("Lỗi khi phân tích chuỗi JSON:", error);
        return;
      }

      if (orderData !== null) {
        orderData.customer_id = user.state.users.user._id;
        orderData.payment_status = true;
        items.forEach((item) => {
          const orderDetail = {
            product_id: item.product._id,
            quantity: item.quantity,
          };
          orderData.order_details.push(orderDetail);
        });
        // Cập nhật giá trị payment_information thành "vnpay"
        orderData.payment_information = "vnpay";

        // Thực hiện gửi yêu cầu đặt hàng với dữ liệu đã lưu trữ
        try {
          // Cập nhật trường accumulated_money của khách hàng
          if (pointStatus === true) {
            await axiosClient.patch(`/customers/${user.state.users.user._id}`, {
              points: newPoints - currentPoints,
            });
            updateUser({ points: newPoints - currentPoints });
          } else {
            await axiosClient.patch(`/customers/${user.state.users.user._id}`, {
              points: newPoints,
            });
            updateUser({ points: newPoints });
          }
          await axiosClient.post("/orders", orderData);
          window.alert("Đặt hàng thành công");
          // Sau một khoảng thời gian, chuyển hướng đến "/shop"
          setTimeout(() => {
            window.localStorage.removeItem("formValues");
            window.localStorage.removeItem("cart-storage");
            window.location.replace("/shop");
          }, 4000);
        } catch (error) {
          console.error(error);
          window.alert("Đặt hàng thất bại");
        }
      }
    }
  };

  const checkInputData = async () => {
    let isLogShown = false;
    const requiredFields: {
      [key in keyof typeof formik.values]: string;
    } = {
      first_name: "Họ",
      last_name: "Tên",
      shipping_information: "Địa chỉ",
      shipping_city: "Thành phố",
      phoneNumber: "Số điện thoại",
      email: "Email",
      order_details: "Thông tin đơn hàng",
      total_money_order: "Chọn sản phẩm cần mua",
      payment_information: "Thông tin thanh toán",
      customer_id: "tài khoản",
    };

    const missingFields: string[] = [];
    for (const field in requiredFields) {
      if (!formik.values[field]) {
        missingFields.push(requiredFields[field]);
      }
    }
    setCheckInput(missingFields.length);
    if (missingFields.length > 0) {
      if (!isLogShown) {
        alert(`Vui lòng nhập đầy đủ thông tin ${missingFields.join(", ")}`);
        isLogShown = true;
      }

      return false;
    }
    return true;
  };
  const paymentVnpayClick = async () => {
    const inputValid = await checkInputData();
    if (inputValid === false) {
      return;
    }
    // Lưu các giá trị vào localStorage trước khi chuyển hướng đến trang thanh toán Vnpay
    localStorage.setItem("formValues", JSON.stringify(formik.values));
    const paymentUrl = await axiosClient.post(
      "/payment/create_paymentVnpay_url",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        amount: totalOrder,
        bankCode: "NCB",
        orderDescription: "thanh toan don hang test",
        orderType: "other",
        language: "vn",
      }
    );
    window.location.replace(paymentUrl.data);
  };

  // momo
  const paymentMoMoClick = async () => {
    const inputValid = await checkInputData();
    if (inputValid === false) {
      return;
    }

    // Lưu các giá trị vào localStorage trước khi gọi endpoint tạo URL thanh toán
    localStorage.setItem("formValues", JSON.stringify(formik.values));

    try {
      const response = await axiosClient.post(
        "/payment/create_paymentMoMo_url",
        {}
      );
      const payUrl = response.data.payUrl;
      console.log("res", response);
      // Chuyển hướng đến URL thanh toán Momo
      // window.location.replace(payUrl);
    } catch (error) {
      console.error("Error creating Momo payment URL: ", error);
    }
  };

  useEffect(() => {
    onSuccessVnpay();
  }, []);

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
  // const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const cityId = event.target.value;
  //   // console.log("cityid", cityId);
  //   const selectCity = city.find((city: typeCity) => city.id === cityId);
  //   console.log("selected city", selectCity);
  //   if (selectCity) {
  //     setSelectedCity(selectCity);
  //     formik.setFieldValue("shipping_city", selectCity.city);
  //     // setIsCity(selectCity.city);
  //     // set lại initialValue có giá trị đã thay đổi
  //   }
  // };

  // React.useEffect(() => {
  //   console.log("location", isLocation);
  // }, [isLocation]);
  // React.useEffect(() => {
  //   console.log("city", isCity);
  // }, [isCity]);
  // const handleLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const concatenatedString = event.target.value + isCity;
  //   setIsLocation(concatenatedString);
  //   formik.setFieldValue("shipping_information", concatenatedString);
  //   console.log("con", concatenatedString);
  //   formik.handleChange(event);
  // };

  return (
    <>
      <div className="w-full bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center">
        <h1 className="h-full w-full flex items-center justify-center text-2xl lg:text-4xl text-white font-bold">
          THANH TOÁN
        </h1>
      </div>
      <form action="" onSubmit={formik.handleSubmit}>
        <div className="container px-3">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-8 md:mr-4">
              <div className="flex mt-8 gap-2">
                <h1 className="text-black font-bold">Bạn có tài khoản chưa?</h1>
                <a
                  href="/component/auth/register"
                  className="text-primary_green underline font-semibold"
                >
                  Đi tới đăng nhập
                </a>
              </div>
              <div className="flex mt-8 gap-2">
                <h1 className="text-black font-bold">Have a coupon?</h1>
                <a
                  href=""
                  className="text-primary_green underline font-semibold"
                >
                  Click here to enter your code
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
                  {/* <div className="w-full">
                    <div className="mb-1">
                      <span className="text-[18px] font-medium">
                        Company name
                      </span>
                      <span className="ml-1  text-[20px]">(optional)</span>
                    </div>
                    <input
                      type="text"
                      name=""
                      className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                    />
                  </div> */}
                </div>
                <div>
                  {/* <div className="flex">
                    <h2 className="font-semibold">Country / Region</h2>
                    <span className="ml-1 text-[20px] text-red-500">*</span>
                  </div>
                  <h2 className="mt-0 mb-4">South Africa</h2> */}
                  <div className="flex flex-col mt-3">
                    <div className="flex">
                      <h2 className="font-semibold">Địa chỉ</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      name="shipping_information"
                      value={formik.values.shipping_information}
                      onChange={formik.handleChange}
                      // value={isLocation}
                      // onChange={handleLocation}
                      onBlur={formik.handleBlur}
                      placeholder="House number and street name"
                      className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                    />
                    <p className="text-red-500">
                      {formik.touched.shipping_information
                        ? formik.errors.shipping_information
                        : null}
                    </p>
                  </div>
                  {/* <div className="flex flex-col mt-3">
                    <div className="flex">
                      <h2 className="font-semibold">Town / City</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <select
                      className="border border-[#e5e7eb] p-2 rounded-[5px] outline-none cursor-pointer w-[150px]"
                      value={formik.values.shipping_city}
                      onChange={handleCityChange}
                    >
                      <option
                        value=""
                        className="cursor-pointer text-[13px] md:text-[16px]"
                      >
                        {selectedCity ? selectedCity.city : "Chọn thành phố"}
                      </option>
                      {city.map((city: typeCity) => (
                        <option
                          key={city.id}
                          value={city.id}
                          className=" text-[13px] md:text-[16px]"
                        >
                          {city.city}
                        </option>
                      ))}
                    </select>
                    <p className="text-red-500">
                      {formik.touched.shipping_city
                        ? formik.errors.shipping_city
                        : null}
                    </p>
                  </div> */}
                  <div className="flex flex-col mt-3">
                    <div className="flex">
                      <h2 className="font-semibold">Thành phố</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formik.values.shipping_city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="border p-2"
                    />
                    <p className="text-red-500">
                      {formik.touched.shipping_city
                        ? formik.errors.shipping_city
                        : null}
                    </p>
                  </div>
                  {/* <div className="flex flex-col mt-3">
                    <div className="flex">
                      <h2 className="font-semibold">Street address</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      name=""
                      placeholder="House number and street name"
                      className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                    />
                  </div> */}
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
                    <div className="flex">
                      <h2 className="font-semibold">Email</h2>
                      <span className="ml-1 text-[20px] text-red-500">*</span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="border w-[100%] p-2 rounded-[10px] md:rounded-[5px] outline-none"
                    />
                    <p className="text-red-500">
                      {formik.touched.email ? formik.errors.email : null}
                    </p>
                    {/* <div className=" flex mt-4 ">
                      <input
                        type="checkbox"
                        className=" h-[22px] w-[20px] mr-3"
                      />
                      <p className="font-semibold">
                        Subscribe to our newsletter for Specials, Product
                      </p>
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        className="w-[20px] h-[22px] mr-3"
                      />
                      <span className="font-semibold">Create an account?</span>
                    </div> */}

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
                        <div
                          className="flex gap-1"
                          onMouseDown={checkInputData}
                        >
                          <input
                            type="radio"
                            id="paypal_payment"
                            name="payment_information"
                            value="paypal"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "paypal"}
                          />
                          <label
                            htmlFor="paypal_payment"
                            className="cursor-pointer"
                          >
                            Thanh toán bằng paypal
                          </label>
                        </div>
                        <div className="flex gap-1" onClick={paymentVnpayClick}>
                          <input
                            type="radio"
                            id="vnpay"
                            name="payment_information"
                            value="vnpay"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "vnpay"}
                          />
                          <label htmlFor="vnpay" className="cursor-pointer">
                            Thanh toán bằng vnpay
                          </label>
                        </div>
                        <div className="flex gap-1" onClick={paymentMoMoClick}>
                          <input
                            type="radio"
                            id="momo"
                            name="payment_information"
                            value="momo"
                            onChange={handlePaymentMethodChange}
                            checked={paymentMethod === "momo"}
                          />
                          <label htmlFor="momo" className="cursor-pointer">
                            Thanh toán bằng momo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h1 className="mt-6 font-bold text-[22px]">
                    ADDTIONAL INFORMATION
                  </h1>
                  <div className="flex flex-col mt-4">
                    <span className="font-bold mb-2">
                      Order notes (optional)
                    </span>
                    <textarea
                      className="p-3 outline-none border"
                      placeholder="Notes about your order, e.g special notes for delivery"
                      rows={4}
                      cols={20}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="md:col-span-4 md:mt-8">
              <div className="mt-4 bg-[#f7f7f7] p-3">
                <CheckOutCard
                  items={items}
                  totalOrder={totalOrder}
                  paymentMethod={paymentMethod}
                  checkInput={checkInput}
                  sdkReady={sdkReady}
                  onSuccessPaypal={onSuccessPaypal}
                  orderPoints={orderPoints}
                  points={points}
                  onPointStatusChange={handlePointStatusChange} // Truyền hàm callback vào component con
                />
              </div>
            </div> */}
          </div>
        </div>
      </form>
      {/* <div className="bg-[#F4F4F4] md:mt-[50px]">
        <div className="container mt-[20px] ">
          <div className=" py-8 px-3 flex flex-col gap-3 md:flex-row">
            <div className="flex items-center">
              <BiMedal size={60} className="text-gray-600" />
              <div className="ml-4 flex flex-col flex-1 text-text_gray">
                <h1 className="text-[22px] font-medium">Quality</h1>
                <p>
                  Tried and Tested. We stock only the best aquascaping brands
                  and products.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <TbTruckDelivery size={60} className="text-gray-600" />
              <div className="ml-4 flex flex-col flex-1 text-text_gray">
                <h1 className="text-[22px] font-medium">Delivery</h1>
                <p>
                  We make use of The Courier Guy for all our delivery needs.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <RiSecurePaymentFill size={60} className="text-gray-600" />
              <div className="ml-4 flex flex-col flex-1 text-text_gray">
                <h1 className="text-[22px] font-medium">Secure Payments</h1>
                <p>
                  We offer secure credit and EFT payment options through
                  Payfast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
export default CheckOut;
