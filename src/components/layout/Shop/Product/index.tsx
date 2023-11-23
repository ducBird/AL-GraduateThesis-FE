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
import { Rate } from "antd";
interface IProps {
  product: IProduct;
}
function Product(props: IProps) {
  const { product } = props;
  const { addWishlist, removeWishlist } = useProductWishlist((state) => state);
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

  let minPrice = 0;
  let maxPrice = 0;

  if (variants.length > 0) {
    const prices = variants.map((variant) => numeral(variant.price).value());

    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

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

  // hàm tính trung bình cộng rating của sản phẩm
  const averageRating = () => {
    if (productItem?.reviews && productItem.reviews.length > 0) {
      const sumRating = productItem.reviews.reduce(
        (accumulator, review) => accumulator + review.rating,
        0
      );
      return sumRating / productItem.reviews.length;
    }
    return 0; // Trả về 0 nếu không có đánh giá
  };
  useEffect(() => {
    setProductItem(product);

    // Kiểm tra trong localStorage và cập nhật trạng thái isFavorite
    if (favoriteStatus === "true") {
      setIsWishlist(true);
    }
  }, [product, favoriteStatus]);

  return (
    <div className="relative border border-gray-300 rounded-md h-[450px] shadow-md ">
      <Link to={link} onClick={() => window.scrollTo(0, 0)}>
        <div>
          <img
            src={productItem?.product_image}
            alt="image"
            className="w-[240px] h-[200px] object-contain mx-auto my-7 "
          />
          <div>
            <p className="h-[50px] font-bold px-1">{productItem?.name} </p>
            {/* <div className="min-h-[30px]">
            {productItem?.variants?.map((item: any, index: number) => {
              return (
                <span key={item._id}>
                  {item?.options[0]?.value}{" "}
                  {index !== productItem.variants.length - 1 ? "-" : ""}{" "}
                </span>
              );
            })}
          </div> */}
          </div>
          <div className="price text-lg text-primary_green mb-3 mt-3 font-bold">
            <span>
              {variants.length > 0 ? (
                <span>
                  {numeral(minPrice).format("0,0").replace(/,/g, ".")} -{" "}
                  {numeral(maxPrice).format("0,0").replace(/,/g, ".")} vnđ
                </span>
              ) : (
                <span>
                  {numeral(productItem?.price).format("0,0").replace(/,/g, ".")}{" "}
                  vnđ
                </span>
              )}
            </span>
          </div>

          {productItem?.discount ? (
            <div className="absolute top-2 right-2 py-1 px-3 bg-red-500 rounded-md">
              <p className="text-white">- {productItem?.discount}%</p>
            </div>
          ) : (
            ""
          )}
          {productItem?.reviews?.length !== undefined &&
            productItem?.reviews?.length > 0 && (
              <div>
                <Rate
                  allowHalf
                  disabled
                  value={parseFloat(averageRating().toFixed(1))}
                />
              </div>
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
