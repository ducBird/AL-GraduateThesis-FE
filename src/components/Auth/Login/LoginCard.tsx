import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { Form, Input, Button, message } from "antd";
import { ICustomer } from "../../../interfaces/ICustomers";
import { axiosClient } from "../../../libraries/axiosClient";
import { useUser } from "../../../hooks/useUser";
import { useCarts } from "../../../hooks/useCart";
import { FaGoogle } from "react-icons/fa";
interface Props {
  openLogin: boolean;
  setOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
const LoginCart = (props: Props) => {
  const navigate = useNavigate();
  const { openLogin, setOpenLogin } = props;
  const [loginForm] = Form.useForm();
  const { addUser } = useUser((state) => state) as any;
  const { items } = useCarts((state) => state) as any;
  const handleLoginClose = () => {
    setOpenLogin(false);
  };
  const onLoginFinish = (values: ICustomer) => {
    axiosClient
      .post("/customers/login", values)
      .then((response) => {
        if (!response.data.user.active) {
          message.error("Tài khoản đã bị khóa!");
        } else {
          addUser(response.data);
          window.localStorage.setItem(
            "refresh_token",
            response.data.refresh_token
          );
          window.localStorage.setItem(
            "access_token",
            response.data.access_token
          );
          message.success(response.data.msg);
          window.scrollTo(0, 0);
          const customerId = response?.data?.user?._id; // Lấy id của khách hàng đã đăng nhập
          // Chuẩn bị dữ liệu cần patch (thêm sản phẩm vào customer_cart)
          const updateData = {
            $push: {
              customer_cart: items.map((item: any) => ({
                product_id: item.product?._id,
                variants_id: item.product?.variants[0]?._id,
                quantity: parseInt(item.quantity, 10),
              })),
            },
          };
          // Gửi yêu cầu PATCH đến máy chủ để cập nhật thông tin giỏ hàng của khách hàng
          console.log("data", updateData);
          axiosClient.patch(`/customers/${customerId}`, updateData).then(() => {
            window.localStorage.removeItem("cart-storage");
          });

          //chuyển hướng về trang chính (home)
          setTimeout(() => {
            // Code React thì hạn chế cho trình duyệt load lại bằng cách dùng window.location.href
            // window.location.href = "/";
            // mà hãy dùng useNavigation
            navigate("/user-profile");
            setOpenLogin(false);
            window.localStorage.removeItem("cart-storage");
          }, 1000);
        }
      })
      .catch((err) => {
        message.error(err.response?.data.msg);
      });
  };
  const onLoginFinishFailed = (err) => {
    console.log("Login Failed:", err);
  };
  // const getAccessToken = async () => {
  //   const rf_token = window.localStorage.getItem("refresh_token");
  //   const res = await axiosClient.post("/customers/refresh-token", {
  //     rf_token,
  //   });
  //   console.log(res.data);
  //   // const res = await axiosClient.get("/customers", {
  //   //   headers: { access_token: `Bearer ${users.access_token}` },
  //   // });
  //   // console.log(res.data);
  // };
  const googleLogin = () => {
    window.open("http://localhost:9000/customers/auth/google", "_self");
  };

  return (
    <div>
      <div
        className={`fixed h-[100%] z-20 w-[100%] bg-black/50 ${
          openLogin ? `visible` : `invisible`
        }`}
        onClick={handleLoginClose}
      ></div>
      <div
        className={`fixed top-0 r-0 h-screen z-[100] w-[80%] lg:w-[25%] bg-white border-r shadow-xl transition-transform duration-500 ${
          openLogin ? `-translate-x-full` : `translate-x-full`
        } left-full`}
      >
        <div className="flex items-center justify-between px-3 py-6 border border-b">
          <h2 className="text-[20px] font-semibold">Đăng nhập</h2>
          <div
            onClick={handleLoginClose}
            className="flex items-center cursor-pointer hover:opacity-[0.7] text-red-500"
          >
            <span className="text-[20px] font-[100]">
              <MdOutlineClose />
            </span>
            <h2 className="text-[18px]">Đóng</h2>
          </div>
        </div>

        {/* Chỗ cần xem lại không xóa <button onClick={getAccessToken}>test cookie</button> */}
        <div className="px-3 mt-4  border-b">
          <Form
            form={loginForm}
            name="login-form"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onLoginFinish}
            onFinishFailed={onLoginFinishFailed}
          >
            <div className="flex">
              <h2 className="mb-2 text-[15px] font-medium">Email</h2>
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Chưa nhập thư điện tử!" },
                { type: "email", message: "Thư điện tử không đúng" },
              ]}
              hasFeedback
            >
              <Input className="outline-none border border-gray-400 h-[40px]" />
            </Form.Item>
            <div className="flex">
              <h2 className="mb-2 text-[15px] font-medium">Mật khẩu</h2>
            </div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Chưa nhập mật khẩu!" },
                {
                  min: 5,
                  max: 50,
                  message: "Độ dài mật khẩu từ 5-50 kí tự",
                },
              ]}
            >
              <Input.Password className="outline-none border border-gray-400 h-[40px]" />
            </Form.Item>

            <Form.Item className="mt-[45px]">
              <button
                className="border w-[100%] rounded-[20px] py-2 bg-primary_green text-[20px] text-white font-semibold"
                type="submit"
              >
                Đăng nhập
              </button>
              <button
                onClick={googleLogin}
                className=" flex justify-around cursor-pointer items-center w-[100%] rounded-[20px] py-2 bg-orange-700 text-[20px] text-white font-semibold hover:opacity-[0.7]"
              >
                Đăng nhập với Google
                <FaGoogle />
              </button>
            </Form.Item>
            <Form.Item>
              <div className="flex justify-between items-center my-1">
                <div className="text-[15px] font-bold flex">
                  <label
                    htmlFor="remember-checkbox"
                    className="cursor-pointer flex"
                  >
                    <input
                      type="checkbox"
                      id="remember-checkbox"
                      className="mr-[4px]"
                    />
                    <span>Nhớ mật khẩu</span>
                  </label>
                </div>
                <Link
                  to={"/component/auth/authentication-email"}
                  onClick={handleLoginClose}
                  className="text-[15px] text-primary_green cursor-pointer hover:opacity-90"
                >
                  Quên mật khẩu
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div className="text-center  border-b py-3">
          <div className="opacity-[0.1] font-thin m-auto">
            <AiOutlineUser size={"80px"} className="m-auto" />
          </div>
          <div className="">
            <h2 className="font-bold mb-4">Chưa có tài khoản</h2>
            <Link to={"/component/auth/register"} onClick={handleLoginClose}>
              <span className="border-b-2 border-primary_green font-semibold text-[14px] cursor-pointer hover:opacity-[0.7]">
                Đăng ký tài khoản
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCart;
