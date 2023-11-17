import { AiOutlineInfoCircle } from "react-icons/ai";
import { useProductWishlist } from "../../hooks/useProductWishlist";
import Product from "../layout/Shop/Product";

function WishList() {
  const { wishlist_items, removeWishlistAll } = useProductWishlist(
    (state) => state
  ) as any;
  return (
    <div className="w-full">
      <div className="bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center lg:mb-0 mb-3">
        <h3 className="h-full w-full flex items-center justify-center text-3xl lg:text-4xl text-white font-bold">
          DANH SÁCH YÊU THÍCH
        </h3>
      </div>
      <div className="lg:m-10">
        <div className="ml-5 lg:ml-0">
          <button
            className={`${
              wishlist_items.length > 0
                ? "border px-3 py-2 rounded-full text-white bg-primary_green"
                : ""
            } `}
            onClick={() => {
              wishlist_items.forEach((item) => {
                localStorage.setItem(`favorite_${item?.product?._id}`, "false");
              });
              removeWishlistAll();
            }}
          >
            {wishlist_items.length > 0 ? "Xóa tất cả" : ""}
          </button>
        </div>
        <div
          className={`favorite-list mt-5 text-center ${
            wishlist_items.length > 0
              ? "grid grid-cols-1 lg:grid-cols-5 gap-4"
              : ""
          }`}
        >
          {wishlist_items?.length > 0 ? (
            wishlist_items.map((item) => {
              return (
                <div className="mx-5 lg:mx-0" key={item?.product?._id}>
                  <Product product={item.product} />
                </div>
              );
            })
          ) : (
            <div className="w-full my-10">
              <div className="text-gray-200 flex items-center justify-center">
                <AiOutlineInfoCircle lg:size={200} size={130} />
              </div>
              <p className="my-4 font-bold lg:text-4xl text-xl">
                KHÔNG CÓ SẢN PHẨM YÊU THÍCH
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishList;
