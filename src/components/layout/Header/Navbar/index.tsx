import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";
import numeral from "numeral";
import NavPage from "../Subnav/NavPage";
import NavCategories from "../Subnav/NavCategories";
import { ICategory } from "../../../../interfaces/ICategory";
import { axiosClient } from "../../../../libraries/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "../../../../interfaces/IProducts";
interface Props {
  openMenu: boolean;
  isMobile: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  closeNavbar: () => void;
}

const Navbar = (props: Props) => {
  const { openMenu, setOpenMenu, isMobile, closeNavbar } = props;
  const [showMenuPage, setShowMenuPage] = useState(true);
  const [showMenuCategories, setShowMenuCategories] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchProducts, setSearchProducts] = useState<IProduct[]>([]);
  // xử lý click tìm kiếm
  const [searchValue, setSearchValue] = useState<string>("");

  const handleClose = () => {
    setOpenMenu(false);
  };
  const handleMenuPage = () => {
    setShowMenuPage(true);
    setShowMenuCategories(false);
  };
  const handleMenuCategories = () => {
    setShowMenuCategories(true);
    setShowMenuPage(false);
  };
  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      navigate(`/search-products?name=${formattedValue}`);
    } else {
      alert("Please enter your information in the search box ");
    }
  };
  const formattedValue = searchValue.replace(/\s+/g, "+");
  const navigate = useNavigate();
  // hàm dùng để sử dụng phím enter để tìm kiếm
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
      handleClose();
    }
  };

  useEffect(() => {
    axiosClient
      .get("/categories")
      .then((response) => {
        const filteredCategories = response.data.filter(
          (category: ICategory) => {
            return category.is_delete === false;
          }
        );
        setCategories(filteredCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axiosClient.get("/products").then((response) => {
      if (formattedValue) {
        const filteredProducts = response.data.filter((product) => {
          return product.name
            .toLowerCase()
            .includes(formattedValue.toLowerCase());
        });
        setSearchProducts(filteredProducts);
      } else setSearchProducts([]);
    });
  }, [formattedValue]); // Đảm bảo useEffect chạy lại khi formattedValue thay đổi
  return (
    <nav>
      <div
        className={`fixed h-screen z-20 w-[100%] bg-black/50 ${
          openMenu ? `visible` : `invisible`
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`fixed h-screen z-[21] w-[calc(100%-6rem)] bg-white border-r shadow-xl transition-transform duration-500 ${
          openMenu ? `translate-x-0` : `-translate-x-full`
        } left-0`}
      >
        <div className="mobile-nav">
          <div className="wd-search-form">
            <form
              className="search-form relative shadow-md"
              action=""
              onSubmit={(e) => {
                e.preventDefault(); // Ngăn chặn việc gửi lại form
              }}
            >
              <input
                className="w-full h-[70px] font-semibold pl-5 pr-12"
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div
                className="search-submit p-3 absolute top-0 right-0 bottom-0"
                onClick={() => {
                  handleSearch();
                  handleClose();
                }}
              >
                <Link
                  to={
                    searchValue.trim() !== ""
                      ? `/search-products?name=${formattedValue}`
                      : ""
                  }
                >
                  <BiSearchAlt size={28} className="text-gray-600" />
                </Link>
              </div>
            </form>
            <div className="search-result max-h-[270px] overflow-y-auto">
              {searchProducts.length > 0 && (
                <p className="m-2">
                  {" "}
                  Kết quả tìm kiếm:{" "}
                  <span className="text-primary_green">
                    {searchProducts.length}
                  </span>
                </p>
              )}

              {searchProducts.length > 0 &&
                searchProducts.map((item) => {
                  // Lấy ra danh sách các variant từ sản phẩm
                  const variants = item?.variants || [];
                  // Khởi tạo giá mới bằng giá ban đầu
                  let newPrice = numeral(item?.price).value();
                  const discount = numeral(item?.discount).value();
                  // Lặp qua danh sách các variant
                  for (const variant of variants) {
                    // Kiểm tra xem variant có options không
                    if (variant.options && variant.options.length > 0) {
                      // Lấy giá của option đầu tiên trong variant
                      const optionPrice = numeral(
                        variant.options[0].add_valuation
                      ).value();

                      // Cộng giá của option đầu tiên vào giá mới
                      newPrice += optionPrice;
                    }
                  }
                  const totalDiscount = (newPrice * (100 - discount)) / 100;
                  return (
                    <Link
                      to={`/shop/product/${item?._id}`}
                      onClick={() => {
                        handleClose();
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="border-b flex my-3">
                        <img
                          src={item?.product_image}
                          alt="image"
                          className="w-[100px] h-[100px] object-contain "
                        />
                        <div className="ml-3">
                          <p className="font-bold text-sm">{item?.name} </p>
                          <div className="price text-sm text-primary_green mb-3 mt-3">
                            <span
                              className={
                                item?.discount
                                  ? "line-through text-black"
                                  : "list-none  font-bold"
                              }
                            >
                              {numeral(newPrice)
                                .format("0,0")
                                .replace(/,/g, ".")}{" "}
                              vnđ
                            </span>
                            <span
                              className={
                                item?.discount ? "pl-2 font-bold" : "hidden"
                              }
                            >
                              {numeral(totalDiscount)
                                .format("0,0")
                                .replace(/,/g, ".")}{" "}
                              vnđ
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
          <div className="relative">
            <ul className="wd-nav flex border-b-black/10 flex-wrap uppercase">
              <li
                className={`relative flex-grow flex-shrink-0 basis-1/2 max-w-[50%] border-r`}
              >
                <a
                  href="#"
                  className="relative flex items-center flex-row text-[13px] font-bold h-full leading-4"
                  onClick={handleMenuPage}
                >
                  <span className="static flex-grow flex-shrink basis-auto px-[15px] py-[18px] text-center">
                    menu
                  </span>
                </a>
              </li>
              <li className="relative flex-grow flex-shrink-0 basis-1/2 max-w-[50%]">
                <a
                  href="#"
                  className="relative flex items-center flex-row text-[13px] font-bold h-full"
                  onClick={handleMenuCategories}
                >
                  <span className="static flex-grow flex-shrink basis-auto px-[15px] py-[18px] text-center">
                    Danh mục
                  </span>
                </a>
              </li>
            </ul>
            <div
              className={`absolute bottom-0 h-1 w-1/2 bg-primary_green transition-all duration-300 ${
                showMenuPage ? `translate-x-0` : `-translate-x-full`
              } ${showMenuCategories ? `translate-x-full` : `translate-x-0`}`}
            ></div>
          </div>
          {showMenuPage ? (
            <div
              className={`${
                searchProducts.length > 0 ? "max-h-[150px] overflow-y-auto" : ""
              } `}
            >
              <NavPage
                isMobile={isMobile}
                setOpenMenu={setOpenMenu}
                closeNavbar={closeNavbar}
              />
            </div>
          ) : (
            <div
              className={`${
                searchProducts.length > 0 ? "max-h-[150px] overflow-y-auto" : ""
              } `}
            >
              <NavCategories categories={categories} />
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="fixed bottom-4 right-4 w-10 h-10 bg-primary_green/80 text-white rounded-full flex justify-center items-center shadow-lg"
            onClick={handleClose}
          >
            <MdOutlineClose size={30} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
