import { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Product from "../Product";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IProduct } from "../../../../interfaces/IProducts";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface Iprops {
  categoryName: string | undefined;
  subCategoryName: string | undefined;
  name: string | null;
  products: IProduct[];
  categoryId: string | undefined;
  subCategoryId: string | undefined;
  minPrice: number;
  maxPrice: number;
  showMinMax: boolean;
}
function Products({
  categoryName,
  subCategoryName,
  name,
  products,
  categoryId,
  subCategoryId,
  minPrice,
  maxPrice,
  showMinMax,
}: Iprops) {
  const [currentPage, setCurrentPage] = useState(1);

  // dùng 1 state để lưu số lượng hiển thị ban đầu là 8
  const [displayedItemsPerPage, setDisplayedItemsPerPage] = useState("8");

  // số lượng sản phẩm hiển thị trên mỗi trang
  const itemsPerPage = parseInt(displayedItemsPerPage, 10);

  // xác định chỉ số bắt đầu của một page
  const startIndex = (currentPage - 1) * itemsPerPage;

  // xác định chỉ số cuối cùng của một trang
  const endIndex = startIndex + itemsPerPage;

  // dùng biến displayedItems để đại diện hiển thị sản phẩm trên trang hiện tại
  const cloneProducts = products;
  const productItems = cloneProducts?.slice(startIndex, endIndex);

  // tính toán số lượng trang tổng cộng dựa trên tổng số lượng trong data
  // Dùng Math.ceil để làm tròn, để đảm bảo có sản phẩm dư sẽ có một trang khác hiển thị
  const totalPages = Math.ceil(cloneProducts.length / itemsPerPage);

  // hàm này để dùng để di chuyển đến trang trước đó nếu trang đang hiển thị lớn hơn 1
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // hànm này dùng để đưa người dùng đến trang kế tiếp cho đến trang cuối cùng
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // hàm này dùng để cập nhật lại số trang  nếu người dùng click vào một trang bất kì trong danh sách
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // hàm này dùng để cập nhật số lượng hiển thị khi người dùng chọn 8 hoặc 12 hoặc all
  const handleDisplayedItemsPerPage = (value: string) => {
    setDisplayedItemsPerPage(value);
    setCurrentPage(1);
  };

  // vòng lặp này dùng để tạo ra các số trang
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="shop-products">
      <div className="w-full lg:flex">
        <div className="lg:flex-1 mb-3 lg:mb-0 flex items-center">
          <motion.div whileTap={{ scale: 0.75 }}>
            <Link to="/shop">
              <span
                className="text-sm lg:text-lg font-semibold"
                style={{ flexShrink: 0 }}
              >
                Cửa hàng
              </span>
            </Link>
          </motion.div>
          <span className="mx-2 text-sm lg:text-lg">/</span>
          {/* hiển thị tên tương ứng của categoryId nếu có */}
          {categoryId ? (
            <motion.div whileTap={{ scale: 0.75 }}>
              <Link to={`/product-category/${categoryId}`}>
                <motion.span
                  whileTap={{ scale: 0.75 }}
                  className="text-sm lg:text-lg font-semibold"
                >
                  {categoryName}
                </motion.span>
              </Link>
            </motion.div>
          ) : (
            ""
          )}
          {categoryId ? <span className="mx-2 text-sm lg:text-lg">/</span> : ""}
          {/* hiển thị tên tương ứng của subcategoryId nếu có */}
          {subCategoryId ? (
            <motion.div whileTap={{ scale: 0.75 }}>
              <Link to={`/product-category/${categoryId}/sub/${subCategoryId}`}>
                <span className="text-sm lg:text-lg font-semibold">
                  {subCategoryName}
                </span>
              </Link>
            </motion.div>
          ) : (
            ""
          )}
          {subCategoryId ? (
            <span className="text-sm lg:text-lg mx-2">/</span>
          ) : (
            ""
          )}
          {/* hiển thị tên tương ứng của name tìm kiếm nếu có */}
          {name ? (
            <motion.div whileTap={{ scale: 0.75 }}>
              <span className="text-sm lg:text-lg font-semibold">
                Kết quả tìm kiếm: "{name}"
              </span>
            </motion.div>
          ) : (
            ""
          )}
          {name ? <span className="text-sm lg:text-lg mx-2">/</span> : ""}
          <span className="text-sm lg:text-lg font-semibold">
            Trang <span>{currentPage}</span>
          </span>
        </div>

        <div className="">
          <span className="text-sm lg:text-lg font-semibold">Hiển thị: </span>
          <span
            className={`text-sm lg:text-lg cursor-pointer ${
              displayedItemsPerPage === "8" ? "text-black font-semibold" : ""
            }`}
            onClick={() => {
              handleDisplayedItemsPerPage("8");
              localStorage.setItem("show-quantity-product", "8");
            }}
          >
            8
          </span>
          <span className="mx-2 text-sm lg:text-lg">/</span>
          <span
            className={`text-sm lg:text-lg cursor-pointer ${
              displayedItemsPerPage === "12" ? "text-black font-semibold" : ""
            }`}
            onClick={() => {
              handleDisplayedItemsPerPage("12");
              localStorage.setItem("show-quantity-product", "12");
            }}
          >
            12
          </span>
          <span className="text-sm lg:text-lg mx-2">/</span>
          <span
            className={`text-sm lg:text-lg cursor-pointer ${
              displayedItemsPerPage === String(products.length)
                ? "text-black font-semibold"
                : ""
            }`}
            onClick={() => {
              handleDisplayedItemsPerPage(String(products.length));
              localStorage.setItem(
                "show-quantity-product",
                String(products.length)
              );
            }}
          >
            Tất cả
          </span>
        </div>
      </div>

      {showMinMax ? (
        <div className="mt-2 flex text-lg font-semibold">
          <p className="mr-2">Min: </p>
          <p className="text-primary_green">{minPrice}</p>
          <p className="border-r mx-4"></p>
          <p className="mr-2">Max: </p>
          <p className="text-primary_green">{maxPrice}</p>
        </div>
      ) : (
        ""
      )}

      <div
        className={`w-full ${
          productItems.length > 0 ? "grid gap-2 grid-cols-1 lg:grid-cols-3" : ""
        }  text-center mt-5`}
      >
        {productItems.length > 0 ? (
          productItems.map((item) => {
            return <Product product={item} key={item?._id} />;
          })
        ) : (
          <div>
            <div className="text-gray-200 flex items-center justify-center">
              <AiOutlineInfoCircle lg:size={200} size={130} />
            </div>
            <p className="text-xl text-neutral-400">Không có sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* các nút điều hướng trang */}
      <div className="flex justify-center mt-5">
        <button
          onClick={() => {
            handlePreviousPage();
            window.scrollTo(0, 0);
          }}
          hidden={currentPage === 1}
          className="text-2xl"
        >
          <MdKeyboardArrowLeft />
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => {
              handlePageClick(number);
              window.scrollTo(0, 0);
            }}
            className={currentPage === number ? "bg-green-700 text-white" : ""}
          >
            <p className="mx-2 text-md p-[5px] font-semibold">{number}</p>
          </button>
        ))}
        <button
          onClick={() => {
            handleNextPage();
            window.scrollTo(0, 0);
          }}
          hidden={currentPage === totalPages || products.length === 0}
          className="text-2xl"
        >
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Products;
