import { AiOutlineClose } from "react-icons/ai";

import { useCarts } from "../../../hooks/useCart";
import { MdProductionQuantityLimits } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import numeral from "numeral";
import { CartItems } from "../../../interfaces/ICartItems";
import { IProduct } from "../../../interfaces/IProducts";
import LoginCart from "../../Auth/Login/LoginCard";
import { IRemoveCartItem } from "../../../interfaces/IRemoveCartItem";
const ShoppingCart = () => {
  // zustand
  const { items, remove, updateQuantity } = useCarts((state) => state) as any;
  const [openLogin, setOpenLogin] = useState(false);
  // Tạo state quantity cho từng sản phẩm
  const [quantities, setQuantities] = useState<number[]>(
    items.map((item) => item.quantity)
  );

  const totalOrder = items.reduce((total, item) => {
    return total + item.product.total * item.quantity;
  }, 0);
  const [quantityChange, setQuantityChange] = useState<boolean>(false);
  const [changedProductIds, setChangedProductIds] = useState<string[]>([]);
  const userString = localStorage.getItem("user-storage");
  const user = userString ? JSON.parse(userString) : null;
  const userLogin = user && Object.keys(user.state.users).length !== 0;
  const handleLogin = () => {
    setOpenLogin(true);
  };
  // Hàm giảm quantity
  const minusClick = (index: number) => {
    const updatedQuantities = [...quantities];
    const currentQuantity = updatedQuantities[index];
    updatedQuantities[index] = currentQuantity - 1;
    setQuantities(updatedQuantities);
    setQuantityChange(true);
    // Thêm id của sản phẩm có số lượng thay đổi vào danh sách changedProductIds
    const changedIds = [...changedProductIds];
    if (!changedIds.includes(items[index].product._id)) {
      changedIds.push(items[index].product._id);
      setChangedProductIds(changedIds);
    }
  };

  // Hàm tăng quantity
  const plusClick = (index: number) => {
    const updatedQuantities = [...quantities];
    const currentQuantity = updatedQuantities[index];
    updatedQuantities[index] = currentQuantity + 1;
    setQuantities(updatedQuantities);
    setQuantityChange(true);
    // Thêm id của sản phẩm có số lượng thay đổi vào danh sách changedProductIds
    const changedIds = [...changedProductIds];
    if (!changedIds.includes(items[index].product._id)) {
      changedIds.push(items[index].product._id);
      setChangedProductIds(changedIds);
    }
  };
  const quantityUpdate = () => {
    // Lặp qua mảng sản phẩm và cập nhật số lượng
    items.forEach((item, index) => {
      const updatedQuantity = quantities[index];
      const CartUpdate: CartItems = {
        product: item.product as IProduct,
        quantity: updatedQuantity,
      };
      // Gọi hàm updateQuantity từ hook useCarts để cập nhật số lượng cho sản phẩm
      updateQuantity(CartUpdate);
    });

    // Đặt lại state quantityChange về false sau khi đã cập nhật số lượng
    setQuantityChange(false);
    alert("Cập nhật giỏ hàng thành công");
  };
  return (
    <>
      <div className="w-full bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center">
        <h1 className="h-full w-full flex items-center justify-center text-2xl lg:text-4xl text-white font-bold">
          CHI TIẾT GIỎ HÀNG
        </h1>
      </div>
      {items.length > 0 ? (
        <div className="container ">
          <div className="px-3 md:grid md:grid-cols-12 ">
            <div className=" md:col-span-8 md:mr-4">
              {/* mobile */}
              <ul className="block md:hidden">
                {items &&
                  items.map((item, index) => {
                    const removeCart: IRemoveCartItem = {
                      product: item.product as IProduct,
                    };
                    const product = item.product;
                    const total = numeral(item.product?.total)
                      .format("0,0")
                      .replace(/,/g, ".");
                    return (
                      <li className="border-b" key={index}>
                        <div className="flex py-3 px-2">
                          <div className="flex w-[130px] items-center justify-center">
                            <Link to={`/shop/product/${product._id}`}>
                              <img
                                className="w-full"
                                src={product.product_image}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="flex-1 md:max-w-[220px] leading-[33px] pl-3">
                            <Link to={`/shop/product/${product._id}`}>
                              <p className="font-medium leading-[20px]">
                                {product.name}
                              </p>
                            </Link>
                            <div className="leading-[15px]">
                              <p className="text-primary_green text-[13px] ">
                                only 4 left
                              </p>
                              <span className="text-[12px]">
                                SKU: APT-P-1-1
                              </span>
                            </div>
                            <div className="flex justify-between border-dashed border-b-[1px]">
                              <span className="text-[12px] font-semibold">
                                Giá
                              </span>
                              <span>{total} vnđ</span>
                            </div>
                            <div className="flex justify-between border-dashed border-b-[1px] items-center py-2">
                              <span className="text-[12px] font-semibold">
                                Số lượng
                              </span>
                              <div className=" border h-[30px] w-[120px] flex justify-between items-center text-center rounded-[10px] overflow-hidden">
                                <button
                                  disabled={quantities[index] === 0}
                                  className="w-[25%] border-r flex items-center justify-center h-full hover:bg-primary_green cursor-pointer transition-all"
                                  onClick={() => minusClick(index)}
                                >
                                  -
                                </button>
                                <span className="w-[50%] flex items-center justify-center h-full">
                                  {quantities[index]}
                                </span>
                                <button
                                  className="w-[25%] border-l flex items-center justify-center h-full hover:bg-primary_green cursor-pointer transition-all"
                                  onClick={() => plusClick(index)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between text-primary_green font-semibold">
                              <span className="">Tổng phụ</span>
                              <span className="">
                                {numeral(item.quantity * item.product?.total)
                                  .format("0,0")
                                  .replace(/,/g, ".")}{" "}
                                vnđ
                              </span>
                            </div>
                          </div>
                          <button
                            className="cursor-pointer text-[20px] ml-8 h-2"
                            onClick={() => remove(removeCart)}
                          >
                            <AiOutlineClose />
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              {/* desktop */}
              <div>
                <table className="md:table hidden w-full mt-[60px]">
                  <thead className="text-left">
                    <tr className="md:text-[20px]">
                      <th className="pb-3"></th>
                      <th className="pb-3"></th>
                      <th className="pb-3">Sản phẩm</th>
                      <th className="pb-3">Giá</th>
                      <th className="pb-3">Số lượng</th>
                      <th className="pb-3">Tổng phụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items.map((item, index) => {
                        const removeCart: IRemoveCartItem = {
                          product: item.product as IProduct,
                        };
                        const total = numeral(item.product?.total)
                          .format("0,0")
                          .replace(/,/g, ".");
                        return (
                          <tr className="border-t-2" key={index}>
                            <td className="py-[15px] ">
                              <button
                                className="cursor-pointer"
                                onClick={() => remove(removeCart)}
                              >
                                <AiOutlineClose />
                              </button>
                            </td>
                            {/* <Link to={`/shop/product/${item.product._id}`}> */}
                            <td className="py-[15px] w-[100px] ">
                              <Link to={`/shop/product/${item.product._id}`}>
                                <img
                                  className="w-[100%]"
                                  src={item.product.product_image}
                                  alt=""
                                />
                              </Link>
                            </td>
                            {/* </Link> */}
                            <td className="py-[15px] w-[200px] pl-4">
                              <div className="w-[85%] md:text-[14px]">
                                <h2 className="font-medium leading-[20px]">
                                  {item.product.name}
                                </h2>
                                <div className="leading-[15px]">
                                  <p className="text-primary_green text-[13px] ">
                                    only 4 left
                                  </p>
                                  <span className="text-[12px]">
                                    SKU: APT-P-1-1
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-[15px] ">
                              <div className="flex justify-between items-center ">
                                <span>{total} vnđ</span>
                              </div>
                            </td>
                            <td className="py-[15px] ">
                              <div className="flex  items-center py-2">
                                <div className=" border h-[50px] w-[100px] flex justify-between items-center text-center rounded-[10px] overflow-hidden">
                                  <button
                                    disabled={quantities[index] === 0}
                                    className="border-r flex-1  h-full hover:bg-primary_green cursor-pointer transition-all flex items-center justify-center"
                                    onClick={() => minusClick(index)}
                                  >
                                    -
                                  </button>
                                  <span className=" flex-1 h-full  flex items-center justify-center">
                                    {quantities[index]}
                                  </span>
                                  <button
                                    className="border-l flex-1  h-full hover:bg-primary_green cursor-pointer transition-all flex items-center justify-center"
                                    onClick={() => plusClick(index)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="py-[15px] ">
                              <div className="flex justify-between ">
                                <span className="text-primary_green font-semibold">
                                  {numeral(item.quantity * item.product?.total)
                                    .format("0,0")
                                    .replace(/,/g, ".")}{" "}
                                  vnđ
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="py-3 px-6">
                  <div className="flex flex-col mt-4 gap-4 ">
                    <button
                      disabled={!quantityChange}
                      className={`bg-${
                        quantityChange
                          ? "primary_green"
                          : "primary_green opacity-50"
                      } py-2 rounded-[20px] text-white`}
                      onClick={quantityUpdate}
                    >
                      CẬP NHẬT GIỎ HÀNG
                    </button>
                  </div>
                </div>
                <div className="p-5 mt-5 md:flex md:justify-center">
                  <input
                    type="text"
                    className="border w-[100%] md:w-[40%] md:mr-2 p-2  rounded-[5px] outline-none "
                    placeholder="Coupon code"
                  />
                  <div className="flex flex-col mt-4 gap-4 md:mt-0 ">
                    <button className="bg-primary_green py-2 rounded-[20px] text-white hover:opacity-[0.9] md:px-4 md:py-2">
                      APPLY COUPON
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:col-span-4 mt-5">
              <div className="border-2 p-5 flex flex-col leading-[28px]">
                <h1 className=" font-semibold text-[25px]">TỔNG GIỎ HÀNG</h1>
                <div className="flex justify-between mt-3">
                  <span className="text-[16px] font-medium">Tổng phụ</span>
                  <span>
                    {numeral(totalOrder).format("0,0").replace(/,/g, ".")} vnđ
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between ">
                  <h1 className="text-[16px] font-medium">Vận chuyển</h1>
                  <div className="flex">
                    <h1>Flat rate (MAY Vary)</h1>
                    <span className="text-primary_green">:R150</span>
                    <input type="radio" name="check" className="ml-2" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <h2>Collect at Easy Scape</h2>
                  <input type="radio" name="check" className="ml-2" />
                </div>
                <h2 className="text-right">
                  Sipping to <span className="text-gray-400">Gauteng.</span>
                </h2>
                <h2 className="text-primary_green text-right">
                  Change address
                </h2>
                <hr className="my-3" />
                <div className="">
                  <div className="flex justify-between">
                    <span className="text-[16px] font-medium">Tổng</span>
                    <span className="text-[18px] font-medium text-primary_green">
                      {numeral(totalOrder).format("0,0").replace(/,/g, ".")} vnđ
                    </span>
                  </div>
                  <h2 className="text-right">(includes R123 VAT)</h2>
                  <Link
                    to={
                      !userLogin
                        ? "/component/checkcart/shoppingcart"
                        : "/component/checkcart/checkout"
                    }
                  >
                    <div className="flex flex-col mt-4 gap-4">
                      <button
                        className="bg-primary_green py-2 rounded-[20px] text-white hover:opacity-[0.9]"
                        // disabled={!userLogin}
                        onClick={() => {
                          if (!userLogin) {
                            alert("Vui lòng đăng nhập !");
                            handleLogin();
                          }
                        }}
                      >
                        ĐI TỚI THANH TOÁN
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full text-center my-10">
          <div className="text-gray-200 flex items-center justify-center">
            <MdProductionQuantityLimits lg:size={200} size={130} />
          </div>
          <p className="my-4 font-bold lg:text-5xl text-2xl">
            KHÔNG CÓ SẢN PHẨM NÀO TRONG GIỎ HÀNG CỦA BẠN
          </p>
          <p>
            Trước khi tiến hành thanh toán, bạn phải thêm một số sản phẩm vào
            giỏ hàng.
          </p>
          <p className="mb-5">
            Bạn sẽ tìm thấy rất nhiều sản phẩm thú vị trên trang "Cửa hàng" của
            chúng tôi.
          </p>
          <Link to="/shop">
            <button className="bg-primary_green rounded-full">
              <p className="px-5 py-2 text-white">QUAY VỀ CỬA HÀNG</p>
            </button>
          </Link>
        </div>
      )}

      {/* <div className="bg-[#F4F4F4] md:mt-[50px]">
        <div className="container mt-[20px] ">
          <div className=" py-8 px-3 flex flex-col gap-3 md:flex-row">
            <div className="flex items-center">
              <BiMedal size={60} className="text-gray-600" />
              <div className="ml-4 flex flex-col flex-1 text-text_gray">
                <h1 className="text-[22px] font-medium">Quallty</h1>
                <p>
                  Tried and Tested. We stock only the best aquascaping brands
                  and products.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <TbTruckDelivery size={60} className="text-gray-600" />
              <div className="ml-4 flex flex-col flex-1 text-text_gray">
                <h1 className="text-[22px] font-medium">Delivery</h1>
                <p>
                  We make use of The Courier Guy for all our delivery needs.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <RiSecurePaymentFill size={60} className="text-gray-600" />
              <div className="ml-4 flex flex-col flex-1 text-text_gray">
                <h1 className="text-[22px] font-medium">Secure Payments</h1>
                <p>
                  We offer secure credit and EFT payment options through
                  Payfast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <LoginCart openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </>
  );
};
export default ShoppingCart;
