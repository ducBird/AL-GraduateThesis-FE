import { AiOutlineClose } from "react-icons/ai";

import { useCarts } from "../../../hooks/useCart";
import { MdProductionQuantityLimits } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import numeral from "numeral";
import { CartItems } from "../../../interfaces/ICartItems";
import { IProduct } from "../../../interfaces/IProducts";
import LoginCart from "../../Auth/Login/LoginCard";
import { IRemoveCartItem } from "../../../interfaces/IRemoveCartItem";
import { ICustomer } from "../../../interfaces/ICustomers";
import { axiosClient } from "../../../libraries/axiosClient";
import { useUser } from "../../../hooks/useUser";
const ShoppingCart = () => {
  // zustand
  const { items, remove, updateQuantity } = useCarts((state) => state) as any;
  const { users } = useUser((state) => state) as any;
  const [openLogin, setOpenLogin] = useState(false);
  const [customer, setCustomer] = useState<ICustomer[]>([]);
  // Tạo state quantity cho từng sản phẩm
  const [quantities, setQuantities] = useState<number[]>([]);
  const [quantityChange, setQuantityChange] = useState<boolean>(false);
  const [changedProductIds, setChangedProductIds] = useState<string[]>([]);
  // tính tổng giỏ hàng
  let totalOrder = 0;

  if (customer.customer_cart && customer.customer_cart.length > 0) {
    totalOrder = customer.customer_cart.reduce((total, item) => {
      const variantsPrice = item.variants?.price || item.product?.price || 0;

      const priceDiscount =
        (variantsPrice * (100 - item.product?.discount)) / 100;

      return total + (priceDiscount || 0) * (item.quantity || 0);
    }, 0);
  } else if (items && items.length > 0) {
    // If there is no customer cart, calculate total based on 'items'
    totalOrder = items.reduce((total, item) => {
      const variantsPrice =
        item.product?.variants[0]?.price || item.product?.price || 0;

      const priceDiscount =
        (variantsPrice * (100 - item.product?.discount)) / 100;
      return total + (priceDiscount || 0) * (item.quantity || 0);
    }, 0);
  }

  // dùng để group lại những sản phẩm trùng nhau và cộng dồn quantity lại với nhau
  const groupedItems = [];
  if (customer.customer_cart) {
    customer.customer_cart.forEach((item) => {
      const existingItem = groupedItems.find(
        (groupedItem) =>
          groupedItem.product_id === item.product_id &&
          groupedItem.variants_id === item.variants_id
      );

      if (existingItem) {
        // If the item already exists in the groupedItems, update its quantity
        existingItem.quantity += item.quantity;
      } else {
        // If the item doesn't exist, add it to the groupedItems array
        groupedItems.push({ ...item });
      }
    });
  }
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
    if (!changedIds.includes(items[index]?.product?._id)) {
      changedIds.push(items[index]?.product?._id);
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
    if (!changedIds.includes(items[index]?.product?._id)) {
      changedIds.push(items[index]?.product?._id);
      setChangedProductIds(changedIds);
    }
  };
  const quantityUpdate = () => {
    if (users.user) {
      if (groupedItems && groupedItems.length > 0) {
        let allItemsUpdated = true; // Biến để kiểm tra xem tất cả các mục đã được cập nhật chưa

        groupedItems.forEach(async (item, index) => {
          const updatedQuantity = quantities[index];
          const CartUpdate = {
            product_id: item?.product?.id,
            attributes: item?.product?.attributes,
            variants_id: item?.variants?._id,
            quantity: updatedQuantity,
          };

          try {
            await axiosClient.patch(
              `/customers/${users?.user?._id}/cart/${item?.id}`,
              CartUpdate
            );
          } catch (error) {
            console.error(error);
            allItemsUpdated = false; // Nếu có lỗi, đặt biến này thành false
          }
        });

        // Kiểm tra xem đã cập nhật tất cả các mục chưa trước khi tái tạo trang
        if (allItemsUpdated) {
          setQuantityChange(false);
          alert("Cập nhật giỏ hàng thành công");
          window.location.reload();
        } else {
          // Xử lý khi có ít nhất một mục không được cập nhật thành công
          console.log("Có lỗi khi cập nhật giỏ hàng");
          // Thực hiện xử lý lỗi nếu cần
        }
      }
    } else {
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
    }
  };
  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (openLogin) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [openLogin]);

  useEffect(() => {
    axiosClient.get("/customers").then((response) => {
      response.data.find((item) => {
        if (item?._id === users.user?._id) {
          setCustomer(item);
        }
      });
    });
  }, [users.user?._id]);

  useEffect(() => {
    // Nếu có người dùng và giỏ hàng của khách hàng có thông tin
    if (
      users?.user &&
      customer.customer_cart &&
      customer.customer_cart.length > 0
    ) {
      setQuantities(customer.customer_cart.map((item) => item.quantity));
    } else {
      // Nếu không có người dùng hoặc giỏ hàng của khách hàng không có thông tin
      setQuantities(items.map((item) => item.quantity));
    }
  }, [users?.user, customer.customer_cart, items]);
  return (
    <div className="lg:h-[685px]">
      <div className="w-full bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center">
        <h1 className="h-full w-full flex items-center justify-center text-2xl lg:text-4xl text-white font-bold">
          CHI TIẾT GIỎ HÀNG
        </h1>
      </div>
      {/* Kiểm tra có user và có customer variants không */}
      {users?.user ? (
        customer.customer_cart && customer.customer_cart.length > 0 ? (
          <div className="container h-[100%]">
            <div className="px-3 md:grid md:grid-cols-12 ">
              <div className=" md:col-span-8 md:mr-4">
                {/* mobile */}
                <ul className="block md:hidden">
                  {groupedItems &&
                    groupedItems.map((item, index) => {
                      const product = item.product;
                      const priceDiscount =
                        (item.variants?.price *
                          (100 - item.product?.discount)) /
                        100;
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
                                  {" - "}
                                  {product?.variants &&
                                  product?.variants.length > 0
                                    ? item?.variants?.title
                                    : ""}
                                </p>
                              </Link>

                              <div className="flex justify-between border-dashed border-b-[1px]">
                                <span className="text-[12px] font-semibold">
                                  Giá
                                </span>
                                <span>
                                  {product.variants &&
                                  product.variants.length > 0
                                    ? `${numeral(priceDiscount)
                                        .format("0,0")
                                        .replace(/,/g, ".")} vnđ`
                                    : `${numeral(
                                        (product?.price *
                                          (100 - product?.discount)) /
                                          100
                                      )
                                        .format("0,0")
                                        .replace(/,/g, ".")} vnđ`}
                                </span>
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
                                  {item.product.variants &&
                                  item.product.variants.length > 0
                                    ? `${numeral(item.quantity * priceDiscount)
                                        .format("")
                                        .replace(/,/g, ".")}
                                      vnđ`
                                    : `${numeral(
                                        (item.quantity *
                                          (item.product?.price *
                                            (100 - item.product?.discount))) /
                                          100
                                      )
                                        .format("")
                                        .replace(/,/g, ".")}
                                    vnđ`}
                                </span>
                              </div>
                            </div>
                            <button className="cursor-pointer text-[20px] ml-8 h-2">
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
                      {groupedItems &&
                        groupedItems.map((item, index) => {
                          const priceDiscount =
                            (item.variants?.price *
                              (100 - item.product?.discount)) /
                            100;
                          return (
                            <tr className="border-t-2" key={index}>
                              <td className="py-[15px] ">
                                <button
                                  className="cursor-pointer"
                                  // onClick={() => remove(removeCart)}
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
                                    {" - "}
                                    {item?.product?.variants &&
                                    item?.product?.variants.length > 0
                                      ? item?.variants?.title
                                      : ""}
                                  </h2>
                                </div>
                              </td>
                              <td className="py-[15px] ">
                                <div className="flex justify-between items-center ">
                                  <span>
                                    {item.product.variants &&
                                    item.product.variants.length > 0
                                      ? `${numeral(priceDiscount)
                                          .format("0,0")
                                          .replace(/,/g, ".")} vnđ`
                                      : `${numeral(
                                          (item.product?.price *
                                            (100 - item.product?.discount)) /
                                            100
                                        )
                                          .format("0,0")
                                          .replace(/,/g, ".")} vnđ`}
                                  </span>
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
                                    {item.product.variants &&
                                    item.product.variants.length > 0
                                      ? `${numeral(
                                          item.quantity * priceDiscount
                                        )
                                          .format("")
                                          .replace(/,/g, ".")}
                                      vnđ`
                                      : `${numeral(
                                          (item.quantity *
                                            (item.product?.price *
                                              (100 - item.product?.discount))) /
                                            100
                                        )
                                          .format("")
                                          .replace(/,/g, ".")}
                                    vnđ`}
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
                    <div className="flex"></div>
                  </div>
                  <hr className="my-3" />
                  <div className="">
                    <div className="flex justify-between">
                      <span className="text-[16px] font-medium">Tổng</span>
                      <span className="text-[18px] font-medium text-primary_green">
                        {numeral(totalOrder).format("0,0").replace(/,/g, ".")}{" "}
                        vnđ
                      </span>
                    </div>
                    <Link
                      to={
                        !users.user
                          ? "/component/checkcart/shoppingcart"
                          : "/component/checkcart/checkout"
                      }
                    >
                      <div className="flex flex-col mt-10 gap-4">
                        <button
                          className="bg-primary_green py-2 rounded-[20px] text-white hover:opacity-[0.9]"
                          // disabled={!userLogin}
                          onClick={() => {
                            if (!users.user) {
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
            <p className="my-4 font-bold lg:text-4xl text-2xl">
              KHÔNG CÓ SẢN PHẨM NÀO TRONG GIỎ HÀNG CỦA BẠN
            </p>
            <div className="mt-10 lg:text-xl">
              <p>
                Trước khi tiến hành thanh toán, bạn phải thêm một số sản phẩm
                vào giỏ hàng.
              </p>
              <p className="mb-5">
                Bạn sẽ tìm thấy rất nhiều sản phẩm thú vị trên trang "Cửa hàng"
                của chúng tôi.
              </p>
            </div>
            <Link to="/shop">
              <button className="bg-primary_green rounded-full">
                <p className="px-5 py-2 text-white">QUAY VỀ CỬA HÀNG</p>
              </button>
            </Link>
          </div>
        )
      ) : items.length > 0 ? (
        <div className="container h-[100%]">
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
                    const priceDiscount =
                      (item.product?.variants[0]?.price *
                        (100 - item.product?.discount)) /
                      100;
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
                                {product.name} - {product?.variants[0]?.title}
                              </p>
                            </Link>

                            <div className="flex justify-between border-dashed border-b-[1px]">
                              <span className="text-[12px] font-semibold">
                                Giá
                              </span>
                              <span>
                                {numeral(priceDiscount)
                                  .format("0,0")
                                  .replace(/,/g, ".")}{" "}
                                vnđ
                              </span>
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
                                {numeral(item.quantity * priceDiscount)
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
                        const priceDiscount =
                          (item.product?.variants[0]?.price *
                            (100 - item.product?.discount)) /
                          100;
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
                                  {item.product.name} -{" "}
                                  {item?.product?.variants[0]?.title}
                                </h2>
                              </div>
                            </td>
                            <td className="py-[15px] ">
                              <div className="flex justify-between items-center ">
                                <span>
                                  {numeral(priceDiscount)
                                    .format("0,0")
                                    .replace(/,/g, ".")}{" "}
                                  vnđ
                                </span>
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
                                  {numeral(item.quantity * priceDiscount)
                                    .format("")
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
                  <div className="flex"></div>
                </div>
                <hr className="my-3" />
                <div className="">
                  <div className="flex justify-between">
                    <span className="text-[16px] font-medium">Tổng</span>
                    <span className="text-[18px] font-medium text-primary_green">
                      {numeral(totalOrder).format("0,0").replace(/,/g, ".")} vnđ
                    </span>
                  </div>
                  <Link
                    to={
                      !users?.user
                        ? "/component/checkcart/shoppingcart"
                        : "/component/checkcart/checkout"
                    }
                  >
                    <div className="flex flex-col mt-10 gap-4">
                      <button
                        className="bg-primary_green py-2 rounded-[20px] text-white hover:opacity-[0.9]"
                        onClick={() => {
                          if (!users?.user) {
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
          <p className="my-4 font-bold lg:text-4xl text-2xl">
            KHÔNG CÓ SẢN PHẨM NÀO TRONG GIỎ HÀNG CỦA BẠN
          </p>
          <div className="mt-10 lg:text-xl">
            <p>
              Trước khi tiến hành thanh toán, bạn phải thêm một số sản phẩm vào
              giỏ hàng.
            </p>
            <p className="mb-5">
              Bạn sẽ tìm thấy rất nhiều sản phẩm thú vị trên trang "Cửa hàng"
              của chúng tôi.
            </p>
          </div>
          <Link to="/shop">
            <button className="bg-primary_green rounded-full">
              <p className="px-5 py-2 text-white">QUAY VỀ CỬA HÀNG</p>
            </button>
          </Link>
        </div>
      )}
      <LoginCart openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </div>
  );
};
export default ShoppingCart;
