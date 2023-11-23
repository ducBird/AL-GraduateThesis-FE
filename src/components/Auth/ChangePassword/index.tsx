import { Form, Input, message } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";

const ChangePassword = () => {
  const { users } = useUser((state) => state);
  const [changePasswordForm] = Form.useForm();

  const onChangeFinish = (values: any) => {
    axiosClient
      .patch(`/customers/change/${users.user._id}`, values, {
        headers: { access_token: `Bearer ${users.access_token}` },
      })
      .then((response) => {
        console.log(response);

        message.success(response.data.msg);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onChangeFinishFailed = (err) => {
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
                form={changePasswordForm}
                name="register-form"
                initialValues={{ remember: true }}
                autoComplete="on"
                onFinish={onChangeFinish}
                onFinishFailed={onChangeFinishFailed}
              >
                <div className="flex">
                  <h2 className="mb-2 text-[15px] font-medium">Mật khẩu cũ</h2>
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
                  <h2 className="mb-2 text-[15px] font-medium">Mật khẩu mới</h2>
                </div>
                <Form.Item
                  name="newPassword"
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
                    Xác nhận mật khẩu mới
                  </h2>
                </div>
                <Form.Item
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Hãy xác nhận lại mật khẩu!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
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
                Đổi mật khẩu
              </h1>
              <p className="text-gray-700 text-center my-4">
                Nếu bạn không nhớ mật khẩu cũ hãy{" "}
                <Link
                  to={"/component/auth/authentication-email"}
                  className="text-[15px] font-bold text-primary_green cursor-pointer hover:opacity-90"
                >
                  gửi yêu cầu
                </Link>{" "}
                đến chúng tôi để đổi mật khẩu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
