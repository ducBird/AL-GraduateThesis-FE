import { Form, Input, message } from "antd";
import { ICustomer } from "../../../interfaces/ICustomers";
import { axiosClient } from "../../../libraries/axiosClient";
const AuthEmail = () => {
  const [verifyForm] = Form.useForm();

  const onVerify = (values: ICustomer) => {
    axiosClient
      .post("/customers/forgot", values)
      .then((response) => {
        message.success(response.data.msg);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onVerifyFailed = (err) => {
    console.log("Verify Failed:", err);
  };
  return (
    <>
      <div className="bg-primary_green text-[#ffff] text-center py-4 ">
        <h1 className="font-medium text-[30px]">TÀI KHOẢN</h1>
      </div>
      <div className="container px-3">
        <div className="md:grid md:grid-cols-12 gap-4">
          <div className="md:col-span-6 md:p-4">
            <>
              <h1 className="md:mt-[50px] my-5 font-semibold text-[20px]">
                Quên mật khẩu
              </h1>
              <Form
                form={verifyForm}
                name="verify-form"
                initialValues={{ remember: true }}
                autoComplete="on"
                onFinish={onVerify}
                onFinishFailed={onVerifyFailed}
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

                <Form.Item className="mt-[45px]">
                  <button
                    className="border w-[100%] rounded-[20px] py-2 bg-primary_green text-[20px] text-white font-semibold"
                    type="submit"
                  >
                    Xác thực Email
                  </button>
                </Form.Item>
              </Form>
            </>
          </div>
          <div className="md:hidden relative my-8">
            <hr className="my-6 " />
            <span className="hr-or font-semibold">Hoặc</span>
          </div>

          <div className="md:col-span-6 md:border-l-2">
            <div className="text-center md:mt-[50px] md:p-4">
              <h1 className="text-center font-medium text-[25px]">
                Lấy lại mật khẩu
              </h1>
              <p className="text-gray-700 text-center my-4">
                Nếu bạn quên mật khẩu đăng nhập, hãy xác thực địa chỉ email đã
                từng đăng ký tài khoản thành viên, chúng tôi sẽ hỗ trợ bạn lấy
                lại mật khẩu
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthEmail;
