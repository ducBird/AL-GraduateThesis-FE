import React, { useEffect, useState, useRef } from "react";
import { MdOutlineClose } from "react-icons/md";
import ReactModal from "react-modal";
import { IProduct } from "../../../../interfaces/IProducts";
import { axiosClient } from "../../../../libraries/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import numeral from "numeral";
import Product from "../../Shop/Product";
import { AiOutlineInfoCircle } from "react-icons/ai";
interface IModalProps {
  showPopup: boolean;
  closePopup: () => void;
}

const SearchPopup: React.FC<IModalProps> = ({ closePopup, showPopup }) => {
  const [products, setProducts] = useState<IProduct | null>(null);

  // xử lý click tìm kiếm
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchProducts, setSearchProducts] = useState<IProduct[]>([]);

  const formattedValue = searchValue.replace(/\s+/g, "+");
  const navigate = useNavigate();
  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      navigate(`/search-products?name=${formattedValue}`);
      setSearchProducts([]);
    } else {
      alert("Please enter your information in the search box ");
    }
  };
  // hàm dùng để sử dụng phím enter để tìm kiếm
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      closePopup();
      setSearchProducts([]);
    }
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
      // Di chuyển con trỏ chuột vào input
      // Kiểm tra inputRef.current trước khi gọi .focus()
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);
  useEffect(() => {
    const fetchDataProducts = async () => {
      try {
        const response = await axiosClient.get("/products");
        setProducts(response.data);
        if (formattedValue) {
          const filteredProducts = response.data.filter((product) => {
            return product.name
              .toLowerCase()
              .includes(formattedValue.toLowerCase());
          });
          setSearchProducts(filteredProducts);
        } else setSearchProducts([]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchDataProducts();
  }, [formattedValue]);
  return (
    <div>
      <div
        className={`fixed h-screen z-20 w-[100%] ${
          showPopup ? `visible` : `invisible`
        }`}
        onClick={closePopup}
      ></div>
      <div
        className={`fixed mt-[60px] h-screen z-[100] w-[100%] lg:w-[100%] bg-white border-r shadow-xl transition-transform duration-500 ${
          showPopup ? `-translate-y-full` : `translate-y-full`
        } top-full`}
      >
        <div className="items-center justify-between py-6 border border-b">
          <div className="w-full h-full">
            <input
              type="text"
              className="p-8 w-full text-center text-5xl focus:outline-none"
              placeholder="Tìm kiếm sản phẩm"
              ref={inputRef} // Gắn ref vào input element
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div
            onClick={() => {
              closePopup();
              handleSearch();
            }}
            className="absolute top-3 right-3 items-center cursor-pointer hover:opacity-[0.7] text-red-500"
          >
            <Link
              to={
                searchValue.trim() !== ""
                  ? `/search-products?name=${formattedValue}`
                  : ""
              }
            >
              <span className="text-[35px] font-[100]">
                <MdOutlineClose />
              </span>
            </Link>
          </div>
        </div>
        <div className="text-center mt-5 px-4 max-h-[575px] overflow-y-auto">
          {searchValue !== "" ? (
            <div
              className={`${
                searchProducts.length > 0 ? "grid grid-cols-6 gap-4 mb-4" : ""
              } `}
            >
              {searchProducts.length > 0 ? (
                searchProducts.map((item) => {
                  let minPrice = 0;
                  let maxPrice = 0;

                  if (item.variants.length > 0) {
                    const prices = item.variants.map((variant) =>
                      numeral(variant.price).value()
                    );

                    minPrice = Math.min(...prices);
                    maxPrice = Math.max(...prices);
                  }
                  return (
                    <Link
                      to={`/shop/product/${item?._id}`}
                      onClick={() => {
                        closePopup();
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="border text-center h-[325px] rounded-md">
                        <img
                          src={item?.product_image}
                          alt="image"
                          className="w-[200px] h-[200px] object-contain mx-auto p-3"
                        />
                        <div className="text-sm mt-3">
                          <p className="font-bold">{item?.name} </p>
                          <div className="price text-primary_green mt-6 font-bold">
                            {item.variants.length > 0 ? (
                              <span>
                                {numeral(minPrice)
                                  .format("0,0")
                                  .replace(/,/g, ".")}{" "}
                                -{" "}
                                {numeral(maxPrice)
                                  .format("0,0")
                                  .replace(/,/g, ".")}{" "}
                                vnđ
                              </span>
                            ) : (
                              <span>{item.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div>
                  <div className="text-gray-200 flex items-center justify-center">
                    <AiOutlineInfoCircle lg:size={200} size={130} />
                  </div>
                  <p className="text-xl text-neutral-400">
                    Không tìm thấy sản phẩm nào
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xl text-neutral-400">
              Bắt đầu nhập để xem các sản phẩm bạn đang tìm kiếm
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
