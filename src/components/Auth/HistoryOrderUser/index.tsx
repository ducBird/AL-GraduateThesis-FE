import { useEffect, useState } from "react";
import userImage from "../../../assets/user.png";
import { axiosClient } from "../../../libraries/axiosClient";
import { IOrders } from "../../../interfaces/IOrders";
import numeral from "numeral";
import { Button, Form, Input, Select, Upload, message } from "antd";
import axios from "axios";
import { useFormik } from "formik";
import { useUser } from "../../../hooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { UpCircleFilled } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { API_URL } from "../../../constants/URLS";
function HistoryOrderUser() {
  // const userString = localStorage.getItem("user-storage");
  // const user = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();
  const { users, addUser, updateUserAvatar, updateUserProfile, removeUser } =
    useUser((state) => state);
  const [historyOrderUser, setHistoryOrderUser] = useState<Array<IOrders>>([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvinces] = useState("");
  const [selectedDistrict, setSelectedDistricts] = useState("");
  const [selectedWard, setSelectedWards] = useState("");
  const [hiddenAddress, setHiddenAddress] = useState(true);
  const [updateProfileForm] = Form.useForm();

  useEffect(() => {
    if (users.user?._id) {
      axiosClient.get("/orders").then((response) => {
        const filteredOrders = response.data.filter(
          (order) => order.customer_id === users.user?._id
        );
        setHistoryOrderUser(filteredOrders);
      });
    }
  }, [users.user?._id]);

  useEffect(() => {
    const getUser = async () => {
      await axios
        .get("http://localhost:9000/customers/login/success", {
          withCredentials: true,
        })
        .then((resObject) => {
          // console.log(resObject.data);
          // console.log(resObject.data.cookie.session_google_account);
          window.localStorage.setItem(
            "cookie-google",
            resObject.data.cookie.session_google_account
          );
          window.localStorage.setItem(
            "access_token",
            resObject.data.access_token
          );
          addUser(resObject.data);
        })
        .catch((error) => {
          navigate("/");
          message.error(error.response.data.msg);
          // console.log(error);
        });
    };
    if (!users?.user) {
      getUser();
    }
  }, []);

  // console.log("historyOrderUser", historyOrderUser);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100"
        );
        setProvinces(response.data.results);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://vnprovinces.pythonanywhere.com/api/provinces/${provinceId}`
      );
      // Điều chỉnh dữ liệu theo cấu trúc thực tế của API
      setDistricts(response.data.districts);
      setSelectedProvinces(response.data.full_name);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(
        `https://vnprovinces.pythonanywhere.com/api/districts/${districtId}`
      );
      // Điều chỉnh dữ liệu theo cấu trúc thực tế của API
      setWards(response.data.wards);
      setSelectedDistricts(response.data.full_name);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const fetchDetailWard = async (wardId) => {
    try {
      const response = await axios.get(
        `https://vnprovinces.pythonanywhere.com/api/wards/${wardId}`
      );
      setSelectedWards(response.data.full_name);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const initialCustomerValues = {
    first_name: users.user?.first_name,
    last_name: users.user?.last_name,
    email: users.user?.email,
    phone_number: users.user?.phone_number,
    shipping_address: users.user?.shipping_address,
  };

  const filterOptions = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // Upload ảnh đại diện (kiểm tra định dạng PNG/JPG của file upload)
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể chọn file JPG/PNG!");
    }
    return isJpgOrPng;
  };

  const updatedProfile = (values) => {
    const newField = `${values.detail_address}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
    const newValues = { ...values, address: newField };
    let valueUpdated = {};
    if (
      !values.detail_address ||
      !selectedWard ||
      !selectedDistrict ||
      !selectedProvince
    ) {
      valueUpdated = { ...values };
    } else {
      valueUpdated = newValues;
    }
    axiosClient
      .patch(
        "/customers/" + users.user._id,
        valueUpdated
        // {
        //   headers: {
        //     access_token: `Bearer ${window.localStorage.getItem("access_token")}`,
        //   },
        // }
      )
      .then((response) => {
        message.success("Cập nhật thành công!");
        updateUserProfile();
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        console.log(err);
      });
  };

  const updatedFailed = (err) => {
    console.log("update profile failed", err);
  };

  return (
    <div className="w-full">
      <div className="bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center lg:mb-0 mb-3">
        <h3 className="h-full w-full flex items-center justify-center text-3xl lg:text-4xl text-white font-bold">
          TÀI KHOẢN
        </h3>
      </div>
      <div className="lg:m-10 flex items-center justify-center">
        {users.user && (
          <div className="lg:w-[700px] w-full lg:border-gray lg:border-2 text-center p-5 lg:flex lg:flex-col lg:justify-center lg:items-center">
            <h4 className="text-2xl font-bold text-primary_green mb-5">
              Thông tin tài khoản
            </h4>
            <Form
              className="w-full flex flex-col"
              form={updateProfileForm}
              name="updateProfileForm"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 12 }}
              onFinish={updatedProfile}
              onFinishFailed={updatedFailed}
              initialValues={initialCustomerValues}
            >
              <Upload
                showUploadList={false}
                name="file"
                // headers={{ authorization: "authorization-text" }}
                // action={`http://localhost:9000/upload/customers/${users?.user?._id}`}
                customRequest={({ file }) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  axios
                    .post(
                      `${API_URL}/upload/customers/${users.user._id}`,
                      formData
                    )
                    .then((response) => {
                      if (response.statusText === "OK") {
                        updateUserAvatar(response.data.url);
                        message.success(
                          `Ảnh đại diện ${file.name} đã được thay đổi`
                        );
                      } else {
                        message.error(
                          `Không thể tải ảnh đại diện ${file.name}.`
                        );
                      }
                    })
                    .catch((err) => {
                      message.error("Tải lên hình ảnh thất bại!");
                      message.error(err.response.data);
                      console.log(err);
                    });
                }}
                beforeUpload={beforeUpload}
              >
                <div className="w-[150px] h-[150px] mx-auto flex items-center justify-center mb-7 hover:bg-slate-100 hover:rounded-full hover:opacity-80">
                  <img
                    src={users.user.avatar}
                    alt="image"
                    className="w-[100%] h-[100%] rounded-full"
                  />
                </div>
              </Upload>
              <Form.Item
                hasFeedback
                label="Họ - Tên đệm"
                name="first_name"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                hasFeedback
                label="Tên"
                name="last_name"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                hasFeedback
                label="Email"
                name="email"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Input disabled />
              </Form.Item>
              {/* SĐT */}
              <Form.Item
                hasFeedback
                label="SĐT"
                name="phone_number"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Input />
              </Form.Item>

              {/* Hiển thị địa chỉ của khách */}
              <div className="flex items-center justify-center mb-[24px]">
                <div className="mr-3">Địa chỉ:</div>
                <div>{users.user.address}</div>
              </div>
              <div className="flex justify-center items-center">
                <Button
                  className="lg:w-1/3 w-1/2 py-1 mb-[24px] rounded-md bg-primary_green text-white"
                  onClick={() => {
                    setHiddenAddress(!hiddenAddress);
                  }}
                >
                  Cập nhật địa chỉ
                </Button>
              </div>

              {/* Tỉnh */}
              <Form.Item
                hidden={hiddenAddress}
                label="Tỉnh/Thành Phố"
                name="provinces"
                rules={[
                  {
                    required: hiddenAddress ? false : true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  onChange={(values) => {
                    fetchDistricts(values);
                  }}
                  filterOption={filterOptions}
                  options={
                    provinces &&
                    provinces.map((province) => {
                      return {
                        value: province.id,
                        label: province.full_name,
                      };
                    })
                  }
                />
              </Form.Item>
              {/* Huyện */}
              <Form.Item
                hidden={hiddenAddress}
                label="Quận/Huyện/Thị Xã"
                name="districts"
                rules={[
                  {
                    required: hiddenAddress ? false : true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  onChange={(e) => {
                    fetchWards(e);
                  }}
                  filterOption={filterOptions}
                  options={
                    districts &&
                    districts.map((district) => {
                      return {
                        value: district.id,
                        label: district.full_name,
                      };
                    })
                  }
                />
              </Form.Item>
              {/* Xã */}
              <Form.Item
                hidden={hiddenAddress}
                label="Xã/Thị Trấn"
                name="wards"
                rules={[
                  {
                    required: hiddenAddress ? false : true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  onChange={(e) => {
                    fetchDetailWard(e);
                  }}
                  filterOption={filterOptions}
                  options={
                    wards &&
                    wards.map((ward) => {
                      return {
                        value: ward.id,
                        label: ward.full_name,
                      };
                    })
                  }
                />
              </Form.Item>
              {/* Địa chỉ */}
              <Form.Item
                hidden={hiddenAddress}
                hasFeedback
                label="Địa chỉ cụ thể"
                name="detail_address"
                rules={[
                  {
                    required: hiddenAddress ? false : true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {/* Nút đổi mật khẩu */}
              <div className="flex justify-center items-center">
                <Link
                  to={"/customers/auth/change-password"}
                  className="lg:w-1/3 w-1/2 py-1 mb-[24px] rounded-md bg-primary_green text-white"
                >
                  Đổi mật khẩu
                </Link>
              </div>

              <div className="lg:flex my-2 items-center lg:justify-between">
                <div className="lg:flex-grow lg:flex justify-end mr-2 w-[150px]">
                  <p className="lg:text-right text-lg font-bold text-left text-primary_green">
                    Tiền tích lũy:
                  </p>
                </div>
                <p className="text-left text-lg font-bold w-[300px]">
                  {numeral(users.user?.points).format("0,0").replace(/,/g, ".")}{" "}
                  vnđ
                </p>
              </div>
              <div className="w-full flex lg:justify-between items-center gap-2">
                <Form.Item className="m-0">
                  <Button
                    className="bg-primary_green text-white"
                    htmlType="submit"
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
                <Button
                  className="bg-primary_green text-white"
                  onClick={() => {
                    // window.location.href = "/product-rewiews";
                    navigate("/user-purchase");
                  }}
                >
                  Đơn đã mua
                </Button>
                <Button
                  danger
                  type="primary"
                  onClick={() => {
                    //không hiểu sao không thể dùng cách call api để logout mà xóa đi cookie google
                    // axiosClient
                    //   .get("/customers/logout", { withCredentials: true })
                    //   .then((response) => {
                    //     console.log("res", response);
                    //     localStorage.clear();
                    //     removeUser();
                    //     window.location.href = "/";
                    //   })
                    //   .catch((err) => {
                    //     console.log(err);
                    //   });
                    localStorage.clear();
                    window.open(
                      "http://localhost:9000/customers/logout",
                      "_self"
                    );
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
      {/* <div className="lg:mx-10 mx-5 my-4">
        <h3 className="my-3 text-xl text-primary_green font-bold">Đơn Hàng</h3>
        <div className="w-full bg-gray-300 p-2 border rounded-md">
          {historyOrderUser &&
            historyOrderUser.map((item, index) => {
              return (
                <div key={index}>
                  {item.order_details?.map((orderDetail, orderDetailIndex) => (
                    <div key={orderDetailIndex}>
                      <div>{orderDetail.product?.[0]?.name}</div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div> */}
    </div>
  );
}

export default HistoryOrderUser;
