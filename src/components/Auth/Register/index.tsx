import { Form, Input, message } from "antd";
import { FaGoogle } from "react-icons/fa";
import React from "react";
import { ICustomer } from "../../../interfaces/ICustomers";
import { axiosClient } from "../../../libraries/axiosClient";
import { useUser } from "../../../hooks/useUser";
const Register = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const handleForm = () => {
    setIsLogin(!isLogin);
  };
  const { addUser } = useUser((state) => state);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const onRegisterFinish = (values) => {
    axiosClient
      .post("/customers/register", values)
      .then((response) => {
        message.success(response.data.msg);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onRegisterFinishFailed = (err) => {
    console.log("Failed:", err);
  };
  const onLoginFinish = (values: ICustomer) => {
    axiosClient
      .post("/customers/login", values)
      .then((response) => {
        addUser(response.data.user);
        window.localStorage.setItem(
          "refresh_token",
          response.data.refresh_token
        );
        message.success(response.data.msg);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onLoginFinishFailed = (err) => {
    console.log("Login Failed:", err);
  };
  return (
    <>
      <div className="bg-primary_green text-[#ffff] text-center py-4 ">
        <h1 className="font-medium text-[30px]">TÀI KHOẢN</h1>
      </div>
      <div className="container px-3">
        <div className="md:grid md:grid-cols-12 gap-4">
          <div className="md:col-span-6 md:p-4">
            {isLogin ? (
              <div>
                <h1 className="md:mt-[50px] my-5 font-semibold text-[20px]">
                  Đăng ký tài khoản
                </h1>
                <Form
                  form={registerForm}
                  name="register-form"
                  initialValues={{ remember: true }}
                  autoComplete="on"
                  onFinish={onRegisterFinish}
                  onFinishFailed={onRegisterFinishFailed}
                >
                  <div className="flex">
                    <h2 className="mb-2 text-[15px] font-medium">
                      Họ - Tên đệm
                    </h2>
                  </div>
                  <Form.Item
                    name="first_name"
                    rules={[
                      { required: true, message: "Chưa nhập Họ - tên đệm!" },
                    ]}
                    hasFeedback
                  >
                    <Input className="outline-none border border-gray-400 h-[40px]" />
                  </Form.Item>
                  <div className="flex">
                    <h2 className="mb-2 text-[15px] font-medium">Tên</h2>
                  </div>
                  <Form.Item
                    name="last_name"
                    rules={[{ required: true, message: "Chưa nhập Tên!" }]}
                    hasFeedback
                  >
                    <Input className="outline-none border border-gray-400 h-[40px]" />
                  </Form.Item>
                  <div className="flex">
                    <h2 className="mb-2 text-[15px] font-medium">Email</h2>
                  </div>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Chưa nhập thư điện tử!" },
                      { type: "email", message: "Thư điện tử không hợp lệ" },
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

                  <div className="flex">
                    <h2 className="mb-2 text-[15px] font-medium">
                      Xác nhận mật khẩu
                    </h2>
                  </div>
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Hãy xác nhận lại mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu xác nhận không đúng!")
                          );
                        },
                      }),
                    ]}
                    className="pb-3"
                  >
                    <Input.Password className="outline-none border border-gray-400 h-[40px]" />
                  </Form.Item>

                  <Form.Item className="mt-[45px]">
                    <button
                      className="border w-[100%] rounded-[20px] py-2 bg-primary_green text-[20px] text-white font-semibold hover:opacity-[0.7]"
                      type="submit"
                    >
                      Đăng ký
                    </button>
                  </Form.Item>

                  <div className=" flex justify-around cursor-pointer items-center w-[100%] rounded-[20px] py-2 bg-orange-700 text-[20px] text-white font-semibold hover:opacity-[0.7]">
                    Đăng ký với Google
                    <FaGoogle />
                  </div>
                </Form>
              </div>
            ) : (
              <>
                <h1 className="md:mt-[50px] my-5 font-semibold text-[20px]">
                  Đăng nhập
                </h1>
                <Form
                  form={loginForm}
                  name="login-form"
                  initialValues={{ remember: true }}
                  autoComplete="on"
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
                  </Form.Item>
                  {/* <Form.Item>
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
                          <span>Remember me</span>
                        </label>
                      </div>
                      <h2 className="text-[15px] text-primary_green cursor-pointer hover:opacity-[0.7]">
                        Lost your password?
                      </h2>
                    </div>
                  </Form.Item> */}
                  <div className=" flex justify-around cursor-pointer items-center w-[100%] rounded-[20px] py-2 bg-orange-700 text-[20px] text-white font-semibold hover:opacity-[0.7]">
                    Đăng nhập với Google
                    <FaGoogle />
                  </div>
                </Form>
              </>
            )}
          </div>
          <div className="md:hidden relative my-8">
            <hr className="my-6 " />
            <span className="hr-or font-semibold">Hoặc</span>
          </div>

          {/* <div className="border-register"></div> */}

          <div className="md:col-span-6 md:border-l-2">
            <div className="text-center md:mt-[50px] md:p-4">
              <h1 className="text-center font-medium text-[25px]">Đăng nhập</h1>
              <p className="text-gray-700 text-center my-4">
                Đăng ký trang web này cho phép bạn truy cập trạng thái và lịch
                sử đơn hàng của mình. Chỉ cần điền vào các trường bên dưới và
                chúng tôi sẽ thiết lập tài khoản mới cho bạn ngay lập tức. Chúng
                tôi sẽ chỉ yêu cầu bạn những thông tin cần thiết để giúp quá
                trình mua hàng nhanh hơn và dễ dàng hơn.
              </p>
              <button
                onClick={handleForm}
                className="border px-4 py-2 rounded-[20px] bg-primary_green font-semibold hover:opacity-[0.7]"
              >
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
