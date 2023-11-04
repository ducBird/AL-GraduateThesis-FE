import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineClose, MdProductionQuantityLimits } from "react-icons/md";
import { BsFillCartXFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useCarts } from "../../hooks/useCart";
import numeral from "numeral";
import "./index.css";
import { IProduct } from "../../interfaces/IProducts";
import { IRemoveCartItem } from "../../interfaces/IRemoveCartItem";
interface Props {
  openCart: boolean;
  setOpenCart: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart = (props: Props) => {
  const { openCart, setOpenCart } = props;
  const handleCloseCart = () => {
    setOpenCart(false);
    window.scrollTo(0, 0);
  };
  const [products, setProducts] = useState(true);
  const { items, remove } = useCarts((state: any) => state);

  const totalOrder = items.reduce((total, item) => {
    const priceDiscount =
      (item.product?.variants[0]?.price * (100 - item.product?.discount)) / 100;
    return total + priceDiscount * item.quantity;
  }, 0);

  return (
    <div className="overflow-y-auto">
      <div
        className={`fixed h-screen z-20 w-[100%] bg-black/50 ${
          openCart ? `visible` : `invisible`
        }`}
        onClick={handleCloseCart}
      ></div>
      <div
        className={`fixed h-screen z-[100] w-[80%] lg:w-[25%] bg-white border-r shadow-xl transition-transform duration-500 ${
          openCart ? `-translate-x-full` : `translate-x-full`
        } left-full`}
      >
        <div className="py-6 px-3 border border-b flex justify-between items-center">
          <img
            className="w-[100px]"
            src="https://easyscape.co.za/wp-content/uploads/2021/08/EasyScape.svg"
            alt="image_brand"
          />
          <h4 className="font-extrabold text-xl">GIỎ HÀNG</h4>
          <div
            className="flex items-center font-medium cursor-pointer gap-1 hover:opacity-[0.7] text-[20px]"
            onClick={handleCloseCart}
          >
            <MdOutlineClose />
          </div>
        </div>
        {products ? (
          <div
            className="h-[100vh] mb-5 overflow-y-auto scrollbar"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <div className="h-[65vh] border-b overflow-y-auto">
              {items.length > 0 ? (
                <ul className="h-full">
                  {items.length > 0 &&
                    items.map((item: any, index: any) => {
                      const removeCart: IRemoveCartItem = {
                        product: item.product as IProduct,
                      };
                      const priceDiscount =
                        (item.product?.variants[0]?.price *
                          (100 - item.product?.discount)) /
                        100;
                      return (
                        <li className="border-b" key={index}>
                          <div className="relative flex py-3 px-2 h-auto">
                            <div className="">
                              <img
                                className="w-[80px] h-[80px] object-contain"
                                src={item.product.product_image}
                                alt=""
                              />
                            </div>
                            <div className="max-w-[180px] md:max-w-[220px] leading-[25px] ml-5">
                              <h2 className="font-medium leading-[20px]">
                                {item.product.name} -{" "}
                                {item?.product?.variants[0]?.title}
                              </h2>
                              <p className="text-primary_green text-[13px]">
                                only 4 left
                              </p>
                              <span className="flex items-center">
                                {item.quantity}
                                <AiOutlineClose size={10} />

                                <span className="text-primary_green">
                                  {numeral(priceDiscount)
                                    .format("0,0")
                                    .replace(/,/g, ".")}{" "}
                                  vnđ
                                </span>
                              </span>
                            </div>
                            <button
                              className="absolute top-1 right-2 cursor-pointer text-[20px] text-red-500"
                              onClick={() => {
                                remove(removeCart);
                              }}
                            >
                              <AiOutlineClose size={15} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <div className="w-full text-center p-5">
                  <div className="text-gray-200 flex items-center justify-center">
                    <MdProductionQuantityLimits size={100} />
                  </div>
                  <p className="my-4 font-bold">
                    Không có sản phẩm nào trong giỏ hàng
                  </p>
                  <Link to="/shop">
                    <button
                      className="bg-primary_green rounded-full px-5 py-2 text-white"
                      onClick={() => handleCloseCart()}
                    >
                      QUAY VỀ CỬA HÀNG
                    </button>
                  </Link>
                </div>
              )}
            </div>
            <div className="h-[35vh] py-3 px-6">
              <div className="flex justify-between">
                <span className="text-[20px] font-bold">Tổng:</span>
                <span className="text-[20px]">
                  {numeral(totalOrder).format("0,0").replace(/,/g, ".")}
                </span>
              </div>
              <div className="flex flex-col mt-4 gap-4">
                <Link
                  className="bg-primary_green py-2 rounded-[20px] text-white hover:opacity-[0.9] text-center"
                  to={"/component/checkcart/shoppingcart"}
                  onClick={() => handleCloseCart()}
                >
                  <button>XEM GIỎ HÀNG</button>
                </Link>
                <Link
                  to={
                    items.length === 0
                      ? "/shop"
                      : "/component/checkcart/checkout"
                  }
                  className="bg-primary_green py-2 rounded-[20px] text-white hover:opacity-[0.9] text-center"
                  onClick={() => handleCloseCart()}
                >
                  <button
                    onClick={() => {
                      if (items.length === 0) {
                        alert("Vui lòng chọn sản phẩm và thêm vào giỏ hàng");
                      }
                    }}
                  >
                    THANH TOÁN
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-menu mt-8">
            <div className="text-center">
              <BsFillCartXFill
                size={130}
                className="m-auto mb-3 text-[#f1f1f1]"
              />
              <h2 className="font-medium text-[16px] my-4">
                No product in the basket.
              </h2>
              <button className="text-[13px] text-white font-extrabold bg-primary_green p-3 rounded-[20px]">
                RETURN TO SHOP
              </button>
            </div>
          </div>
        )}
        <div className="relative">
          <button
            className="fixed bottom-4 left-4 w-10 h-10 bg-primary_green/80 text-white rounded-full flex justify-center items-center shadow-lg"
            onClick={handleCloseCart}
          >
            <MdOutlineClose size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
