import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "../../../libraries/axiosClient";
import { Buffer } from "buffer";

const ActivationEmail = () => {
  const { activation_token } = useParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  console.log("chua decode", activation_token);
  useEffect(() => {
    if (activation_token) {
      const activated_token = Buffer.from(activation_token, "base64").toString(
        "utf-8"
      );
      console.log("da decode", activated_token);
      const activationEmail = async () => {
        try {
          const res = await axiosClient.post("/customers/activation", {
            activated_token,
          });
          setSuccess(res.data.msg);
        } catch (err) {
          setError("Không thể xác nhận được tài khoản!!!");
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  return (
    <h1 className="text-center text-2xl text-red-600 bg-yellow-300">
      {success ? success : error}
    </h1>
  );
};

export default ActivationEmail;
