// import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IProduct } from "../../../../interfaces/IProducts";
import numeral from "numeral";
import PopupView from "../Popup/PopupView";
import PopupVariantOption from "../Popup/PopupVariantOption";
import { AiOutlineHeart } from "react-icons/ai";
import {
  WishlistItem,
  useProductWishlist,
} from "../../../../hooks/useProductWishlist";
interface IProps {
  product: IProduct;
}
function Product(props: IProps) {
  const { product } = props;
  const { addWishlist, removeWishlist } = useProductWishlist(
    (state) => state
  ) as any;
  // state chứa id product được chọn
  const [productId, setProductId] = useState<string | undefined>("");
  const [productItem, setProductItem] = useState<IProduct | undefined>();
  // popup
  const [showPopupView, setShowPopupView] = useState(false);
  const [showPopupVariant, setShowPopupVariant] = useState(false);

  const link = `/shop/product/${product?._id}`;
  const [isWishlist, setIsWishlist] = useState(false);
  const openPopup = (type: string) => {
    if (type === "view") {
      setShowPopupView(true);
    } else if (type === "variant") {
      setShowPopupVariant(true);
    }
    setProductId(productItem?._id);
  };

  const closePopup = () => {
    setShowPopupView(false);
    setShowPopupVariant(false);
  };

  // Lấy ra danh sách các variant từ sản phẩm
  const variants = productItem?.variants || [];

  // Khởi tạo giá mới bằng giá ban đầu
  let newPrice = numeral(productItem?.price).value();
  const discount = numeral(productItem?.discount).value();
  // Lặp qua danh sách các variant
  for (const variant of variants) {
    // Kiểm tra xem variant có options không
    if (variant.options && variant.options.length > 0) {
      // Lấy giá của option đầu tiên trong variant
      const optionPrice = numeral(variant.options[0].add_valuation).value();

      // Cộng giá của option đầu tiên vào giá mới
      newPrice += optionPrice;
    }
  }
  const totalDiscount = (newPrice * (100 - discount)) / 100;

  // wishlist
  const toggleWishlist = () => {
    if (isWishlist) {
      removeWishlist(productItem?._id);
      setIsWishlist(false);
      localStorage.setItem(`favorite_${productItem?._id}`, "false");
    } else {
      const Wishlist: WishlistItem = {
        product: { ...productItem } as IProduct,
      };
      addWishlist(Wishlist);
      setIsWishlist(true);
      localStorage.setItem(`favorite_${productItem?._id}`, "true");
    }
  };
  const favoriteStatus = localStorage.getItem(`favorite_${productItem?._id}`);
  useEffect(() => {
    setProductItem(product);

    // Kiểm tra trong localStorage và cập nhật trạng thái isFavorite
    if (favoriteStatus === "true") {
      setIsWishlist(true);
    }
  }, [product, favoriteStatus]);

  return (
    <div className="relative border border-gray-300 rounded-md h-[430px] shadow-md ">
      <Link to={link} onClick={() => window.scrollTo(0, 0)}>
        <div>
          <img
            src={productItem?.product_image}
            alt="image"
            className="w-[190px] h-[190px] object-contain mx-auto my-7 "
          />
          <div>
            <p className="h-[50px] font-bold px-1">{productItem?.name} </p>
            <div className="min-h-[30px]">
              {productItem?.variants?.map((item: any, index: number) => {
                return (
                  <span key={item._id}>
                    {item.options[0]?.value}{" "}
                    {index !== productItem.variants.length - 1 ? "-" : ""}{" "}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="price text-lg text-primary_green mb-3 mt-3">
            <span
              className={
                productItem?.discount
                  ? "line-through text-black"
                  : "list-none  font-bold"
              }
            >
              {numeral(newPrice).format("0,0").replace(/,/g, ".")}
            </span>
            <span
              className={productItem?.discount ? "pl-2 font-bold" : "hidden"}
            >
              {numeral(totalDiscount).format("0,0").replace(/,/g, ".")}
            </span>
          </div>

          {productItem?.discount ? (
            <div className="absolute top-2 right-2 py-1 px-3 bg-red-500 rounded-md">
              <p className="text-white">- {productItem?.discount}%</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </Link>
      <div
        className="absolute top-1 left-3 cursor-pointer group"
        onClick={() => toggleWishlist()}
      >
        <AiOutlineHeart
          size={24}
          className={`group-hover:text-red-500 ${
            favoriteStatus === "true" || isWishlist
              ? "text-red-500"
              : "text-black"
          }`}
        />
      </div>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center h-[25px]">
        <motion.div whileTap={{ scale: 0.85 }} className=" cursor-pointer">
          <button
            className={`px-4 py-1 border rounded-full bg-primary_green text-white 
              } `}
            onClick={() => {
              openPopup("variant");
              setProductId(productItem?._id);
            }}
          >
            Mua
          </button>
        </motion.div>
        <div className="mx-2 border-r border-0 h-full"></div>
        <motion.div whileTap={{ scale: 0.85 }} className=" cursor-pointer">
          <button
            className="px-4 py-1 border rounded-full bg-primary_green text-white"
            onClick={() => {
              openPopup("view");
              setProductId(productItem?._id);
            }}
          >
            Xem
          </button>
        </motion.div>
      </div>

      {/* hiển thị popup view xem nhanh của sản phẩm */}
      <PopupView
        showPopup={showPopupView}
        closePopup={closePopup}
        productId={productId}
      />
      <PopupVariantOption
        showPopup={showPopupVariant}
        closePopup={closePopup}
        productId={productId}
      />
    </div>
  );
}

export default Product;
