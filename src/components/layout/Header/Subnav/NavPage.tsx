import React, { useEffect, useState } from "react";
import { PageMenuData } from "../../../../meta/NavPageMenu";
import LoginCard from "../../../Auth/Login/LoginCard";
import { Link, useLocation } from "react-router-dom";

interface INavPage {
  isMobile: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  closeNavbar: () => void;
}

export default function NavPage({
  isMobile,
  setOpenMenu,
  closeNavbar,
}: INavPage) {
  const menudata = PageMenuData;
  const [selectedItem, setSelectedItem] = useState("");

  const handleLogin = () => {
    setOpenMenu(false);
  };

  const handleItemClick = (itemValue: string) => {
    setSelectedItem(itemValue);
  };

  const lastItemIndex = menudata.length - 1;

  const location = useLocation();

  useEffect(() => {
    // Lấy path từ URL và kiểm tra xem có phần tử tương ứng không
    const path = location.pathname;
    const selectedMenuItem = menudata.find((item) => item.linkTo === path);
    if (selectedMenuItem) {
      setSelectedItem(selectedMenuItem.value);
    } else {
      setSelectedItem("");
    }
  }, [location.pathname, menudata]);
  return (
    <>
      <div className="lg:flex lg:items-center lg:flex-row lg:px-[10px] lg:w-full">
        <ul className="lg:inline-flex lg:justify-center lg:items-center lg:w-full">
          {menudata.map((data, index) => {
            const isSelected = selectedItem === data.value;
            return isMobile ? (
              // NAVBAR MOBILE
              <li
                key={index}
                className="relative flex flex-wrap w-full max-w-full uppercase"
              >
                {/* <a
                href="#"
                className="relative flex flex-wrap flex-1 w-full px-[20px] py-[5px] items-center min-h-[50px] border border-b-black/10 text-[13px] font-semibold focus:ring-2 focus:text-primary_green focus:ring-primary_green transition-all duration-300"
              >
                {data.icon && (
                  <span className="me-[6px]">
                    {data.icon && <data.icon size={20} />}
                  </span>
                )}
                <span>{data.value}</span>
              </a> */}
                {index === lastItemIndex ? (
                  <Link
                    to={"/component/auth/register"}
                    className="relative flex flex-wrap flex-1 w-full px-[20px] py-[5px] items-center min-h-[50px] border border-b-black/10 text-[13px] font-semibold focus:ring-2 focus:text-primary_green focus:ring-primary_green transition-all duration-300"
                    onClick={handleLogin}
                  >
                    {data.icon && (
                      <span className="me-[6px]">
                        {data.icon && <data.icon size={20} />}
                      </span>
                    )}
                    <span>{data.value}</span>
                  </Link>
                ) : (
                  <Link
                    to={data.linkTo}
                    onClick={() => {
                      handleItemClick(data.value);
                      closeNavbar();
                    }}
                    className={`flex flex-wrap flex-1 w-full px-[20px] py-[5px] items-center min-h-[50px] text-[14px] font-bold hover:text-primary_green transition-all duration-300 ${
                      data.icon ? "" : ""
                    }`}
                  >
                    <span
                      className={`${
                        isSelected ? "text-primary_green font-bold" : ""
                      }`}
                    >
                      {data.value}
                    </span>
                  </Link>
                )}
              </li>
            ) : (
              // NAVBAR DESKTOP
              <li
                key={index}
                className={`relative flex flex-wrap uppercase ${
                  data.icon ? "hidden" : ""
                }`}
              >
                <Link
                  to={data.linkTo}
                  onClick={() => {
                    handleItemClick(data.value);
                    window.localStorage.removeItem("category-id");
                    window.localStorage.removeItem("sub-category-id");
                    window.scrollTo(0, 0);
                  }}
                  className="relative flex flex-wrap flex-1 w-full px-[20px] py-[5px] items-center min-h-[50px] text-[14px] font-bold hover:text-primary_green transition-all duration-300 header__menu"
                >
                  <span
                    className={`relative header__navpage ${
                      isSelected ? "text-primary_green" : ""
                    }`}
                  >
                    {data.value}
                    {isSelected && (
                      <span className="absolute w-full h-0.5 bg-primary_green bottom-0 left-0" />
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
