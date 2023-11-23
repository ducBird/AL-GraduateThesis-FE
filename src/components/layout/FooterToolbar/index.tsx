import React from "react";
import { AiOutlineShop, AiOutlineHeart } from "react-icons/ai";
import { BsHandbag } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import LoginCart from "../../Auth/Login/LoginCard";
import { Link, useNavigate } from "react-router-dom";

const FooterTool = () => {
  const [openLogin, setOpenLogin] = React.useState(false);
  const handleLogin = () => {
    setOpenLogin(true);
  };
  const navigate = useNavigate();
  const refresh_token = localStorage.getItem("refresh_token");
  return (
    <>
      <div className="container">
        <div className=" w-full fixed z-10 bg-white bottom-0">
          <div className="border-t-2 py-3">
            <div className="flex justify-evenly">
              <Link to="/shop">
                <div className="flex flex-col">
                  <div className="m-auto text-[20px] font-medium">
                    <AiOutlineShop />
                  </div>
                  <span>Cửa hàng</span>
                </div>
              </Link>
              <Link to="/wishlist">
                <div className="flex flex-col">
                  <div className="m-auto text-[20px] font-medium">
                    <AiOutlineHeart />
                  </div>
                  <span>Yêu thích</span>
                </div>
              </Link>

              <Link to="/component/checkcart/shoppingcart">
                <div className="flex flex-col">
                  <div className="m-auto text-[20px] font-medium">
                    <BsHandbag />
                  </div>
                  <span>Giỏ hàng</span>
                </div>
              </Link>

              <div
                onClick={() => {
                  if (refresh_token) {
                    navigate("/history-order-user");
                    window.scrollTo(0, 0);
                  } else {
                    handleLogin();
                  }
                }}
                className="flex flex-col"
              >
                <div className="m-auto text-[20px] font-medium">
                  <RxPerson />
                </div>
                <span>Tài khoản</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginCart openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </>
  );
};
export default FooterTool;
