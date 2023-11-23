import { Form, Input, message } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Buffer } from "buffer";
const ResetPassword = () => {
  const { verify_token } = useParams();
  let verified_token = "";
  const [resetPasswordForm] = Form.useForm();
  // console.log("chua decode", verify_token);
  if (verify_token) {
    verified_token = Buffer.from(verify_token, "base64").toString("utf-8");
    // console.log("da decode", verified_token);
  }
  const onResetFinish = (values: any) => {
    axiosClient
      .post("/customers/reset", values, {
        headers: { access_token: `Bearer ${verified_token}` },
      })
      .then((response) => {
        console.log(response);

        message.success(response.data.msg);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onResetFinishFailed = (err) => {
    console.log("Failed:", err);
  };

  return (
    <>
      <div className="bg-primary_green text-[#ffff] text-center py-4 ">
        <h1 className="font-medium text-[30px]">TÀI KHOẢN</h1>
      </div>
      <div className="container px-3">
        <div className="md:grid md:grid-cols-12 gap-4">
          <div className="md:col-span-6 md:p-4">
            <div>
              <h1 className="md:mt-[50px] my-5 font-semibold text-[20px]">
                Đổi mật khẩu
              </h1>
              <Form
                form={resetPasswordForm}
                name="register-form"
                initialValues={{ remember: true }}
                autoComplete="on"
                onFinish={onResetFinish}
                onFinishFailed={onResetFinishFailed}
              >
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
                    Đổi mật khẩu
                  </button>
                </Form.Item>
              </Form>
            </div>
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
                Hãy nhập mật khẩu an toàn và dễ nhớ. Cách tốt nhất để bảo vệ tài
                khoản của bạn là nên đổi mật khẩu 1 tháng/1 lần
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
