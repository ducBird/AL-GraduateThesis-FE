import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";
import { RxBell, RxPerson } from "react-icons/rx";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosGitCompare } from "react-icons/io";
import Navbar from "./Navbar";
import NavPage from "./Subnav/NavPage";
import Cart from "../../../components/Cart";
import LoginCart from "../../Auth/Login/LoginCard";
import AquaticLogo from "../../../assets/ImageAquaticLand.png";
import { useCarts } from "../../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useProductWishlist } from "../../../hooks/useProductWishlist";
import SearchPopup from "./Search/index";
// import { ICustomer } from "../../../interfaces/ICustomers";
// import { axiosClient } from "../../../libraries/axiosClient";
import { useUser } from "../../../hooks/useUser";
// import { useNotification } from "../../../hooks/useNotification";
import { useNotification } from "../../../hooks/useNotification";
export default function Header() {
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  3;
  const [isMobile, setIsMobile] = useState(false);
  const [showPopupSearch, setShowPopupSearch] = useState(false);
  // zustand
  const { items } = useCarts((state) => state) as any;
  const { users } = useUser((state) => state) as any;
  // const customerId = users.user?._id;
  const { wishlist_items } = useProductWishlist((state) => state) as any;
  const quantityCart = items.reduce((total, item) => {
    // cast biến item sang kiểu dữ liệu number
    const cartItem = item as { quantity: number };
    return total + cartItem.quantity;
  }, 0);
  const quantityUserCart =
    users?.user &&
    users?.user?.customer_cart.reduce((total, item) => {
      // cast biến item sang kiểu dữ liệu number
      const cartItem = item as { quantity: number };
      return total + cartItem.quantity;
    }, 0);
  const { unreadNotificationCount } = useNotification() as any;
  const handleMenu = () => {
    setOpenMenu(true);
  };
  const closeNavbar = () => {
    setOpenMenu(false);
  };
  const handleCart = () => {
    setOpenCart(true);
  };
  const handleLogin = () => {
    setOpenLogin(true);
  };
  const closePopup = () => {
    setShowPopupSearch(false);
  };
  const navigate = useNavigate();
  // const userStorage = localStorage.getItem("user-storage") ?? "";
  // const parsedUser = userStorage ? JSON.parse(userStorage) : null;
  // const user = parsedUser && Object.keys(parsedUser.state.users).length !== 0;
  const access_token = localStorage.getItem("access_token");
  useEffect(() => {
    const handleSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleSize);
    handleSize();
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  useEffect(() => {
    if (windowSize.width < 500) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    // console.log(windowSize);
  }, [windowSize]);

  // useEffect(() => {
  //   axiosClient.get("/notifications").then((response) => {
  //     // Lọc dữ liệu để chỉ giữ lại các thông báo của customerId
  //     const filteredNotifications = response.data.filter(
  //       (notification) =>
  //         notification.customer_id === customerId &&
  //         notification.isRead === false
  //     );
  //     if (filteredNotifications) {
  //       useNotification.setState({
  //         unreadNotificationCount: filteredNotifications.length,
  //       });
  //     }
  //   });
  // }, []);
  // const link = `/user/notifications/order/${users.user?._id}`;
  return (
    <main className="relative w-full">
      <div className="mobile-header w-full fixed z-10 bg-white">
        <div className="border border-b shadow-sm">
          <div className="flex flex-row justify-between items-center flex-nowrap px-[15px] max-h-[60px] h-[60px] lg:max-w-[1222px] lg:mx-auto">
            {/* If screen mobile -> Icon Hambuger Menu */}
            {isMobile && (
              <div className="flex flex-1">
                <button onClick={handleMenu}>
                  <FiMenu size={24} />
                </button>
              </div>
            )}
            {/* Image Logo */}
            <div className="px-[10px]">
              <a href="/">
                <img
                  className="py-[5px] max-w-[150px] lg:max-w-[217px]"
                  src={AquaticLogo}
                  alt="image_brand"
                />
              </a>
            </div>
            {/* If screen desktop -> component NavPage (Home, Shop, Service,...) */}
            {!isMobile && (
              <NavPage
                isMobile={isMobile}
                setOpenMenu={setOpenMenu}
                closeNavbar={closeNavbar}
              />
            )}
            {/* If screen mobile -> icon search, login, cart, whitelist */}
            {isMobile ? (
              <div className={`flex justify-end flex-1`}>
                <a
                  className="flex justify-center items-center"
                  onClick={handleCart}
                >
                  <span>
                    <RiShoppingCartLine size={20} />
                  </span>
                  {users?.user?.customer_cart &&
                    users?.user?.customer_cart.length > 0 && (
                      <span className="bg-primary_green w-5 h-5 rounded-full flex items-center justify-center ms-[6px]">
                        <span className="text-[10px] leading-3 font-bold text-white">
                          {quantityUserCart}
                        </span>
                      </span>
                    )}
                  {items && items.length > 0 && (
                    <span className="bg-primary_green w-5 h-5 rounded-full flex items-center justify-center ms-[6px]">
                      <span className="text-[10px] leading-3 font-bold text-white">
                        {quantityCart}
                      </span>
                    </span>
                  )}
                </a>
              </div>
            ) : (
              <div className={`flex justify-end`}>
                <a
                  onClick={() => setShowPopupSearch(true)}
                  className="flex justify-center items-center h-[40px] leading-none px-[10px] text-gray-800 cursor-pointer"
                >
                  <span className="relative flex item-center justify-center">
                    <BiSearchAlt size={24} />
                  </span>
                </a>
                <a
                  onClick={() => {
                    if (access_token) {
                      navigate("/user-profile");
                      window.scrollTo(0, 0);
                    } else {
                      handleLogin();
                    }
                  }}
                  className="flex justify-center items-center h-[40px] leading-none px-[10px] text-gray-800 cursor-pointer"
                >
                  <span className="relative flex item-center justify-center">
                    {users.user ? (
                      <div className="w-[24px] h-[24px]">
                        <img
                          src={users.user.avatar}
                          alt="avatar"
                          className="w-[100%] h-[100%] rounded-full"
                        />
                      </div>
                    ) : (
                      <RxPerson size={24} />
                    )}
                  </span>
                </a>
                {/* <a
                  onClick={() => {
                    navigate(link);
                    window.scrollTo(0, 0);
                  }}
                  className="flex justify-center items-center h-[40px] leading-none px-[10px] text-gray-800 cursor-pointer"
                >
                  <span className="relative flex item-center justify-center">
                    <RxBell size={24} />
                    {unreadNotificationCount !== 0 && (
                      <span className="absolute top-[-5px] end-[-9px] bg-primary_green text-white text-[9px] w-[15px] h-[15px] leading-[15px] text-center font-normal rounded-full z-[1]">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </span>
                </a> */}
                <a
                  onClick={() => {
                    navigate("/wishlist");
                    window.scrollTo(0, 0);
                  }}
                  className="flex justify-center items-center h-[40px] leading-none px-[10px] text-gray-800 cursor-pointer"
                >
                  <span className="relative flex item-center justify-center">
                    <AiOutlineHeart size={24} />
                    {wishlist_items.length > 0 && (
                      <span className="absolute top-[-5px] end-[-9px] bg-primary_green text-white text-[9px] w-[15px] h-[15px] leading-[15px] text-center font-normal rounded-full z-[1]">
                        {wishlist_items.length}
                      </span>
                    )}
                  </span>
                </a>
                {/* <a className="flex justify-center items-center h-[40px] leading-none px-[10px] text-gray-800 cursor-pointer">
                  <span className="relative flex item-center justify-center">
                    <IoIosGitCompare size={24} />
                    <span className="absolute top-[-5px] end-[-9px] bg-primary_green text-white text-[9px] w-[15px] h-[15px] leading-[15px] text-center font-normal rounded-full z-[1]">
                      0
                    </span>
                  </span>
                </a> */}
                <a
                  className="flex justify-center items-center h-[40px] leading-none px-[10px] text-gray-800 cursor-pointer"
                  onClick={handleCart}
                >
                  <span className="relative flex item-center justify-center">
                    <RiShoppingCartLine size={24} />
                    {users?.user &&
                      users?.user?.customer_cart &&
                      users?.user?.customer_cart.length > 0 && (
                        <span className="absolute top-[-5px] end-[-9px] bg-primary_green text-white text-[9px] w-[15px] h-[15px] leading-[15px] text-center font-normal rounded-full z-[1]">
                          {quantityUserCart}
                        </span>
                      )}
                    {items && items.length > 0 && (
                      <span className="absolute top-[-5px] end-[-9px] bg-primary_green text-white text-[9px] w-[15px] h-[15px] leading-[15px] text-center font-normal rounded-full z-[1]">
                        {quantityCart}
                      </span>
                    )}
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Navbar mobile */}
      <Navbar
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        isMobile={isMobile}
        closeNavbar={closeNavbar}
      />
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
      <LoginCart openLogin={openLogin} setOpenLogin={setOpenLogin} />
      <SearchPopup showPopup={showPopupSearch} closePopup={closePopup} />
    </main>
  );
}
