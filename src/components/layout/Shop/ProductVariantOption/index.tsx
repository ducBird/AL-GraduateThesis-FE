import { useState, useEffect } from "react";
import { MdDone } from "react-icons/md";
import numeral from "numeral";
import { IProduct } from "../../../../interfaces/IProducts";
import { useCarts } from "../../../../hooks/useCart";
import { CartItems } from "../../../../interfaces/ICartItems";
interface Iprops {
  product: IProduct | null;
}
interface PriceResult {
  discountOptions: number;
  totalPrice: number;
}

function ProductVariantOption({ product }: Iprops) {
  // console.log(product);
  const { add } = useCarts((state) => state);
  const [quantity, setQuantity] = useState<string>("1");
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [selectedValueNames, setSelectedValueNames] = useState<string[]>([]);

  const variants = product?.variants || [];
  let minPrice = 0;
  let maxPrice = 0;

  if (variants.length > 0) {
    const prices = variants.map((variant) => numeral(variant.price).value());

    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  // các nút tăng hay giảm số lượng khi đặt hàng
  // nút trừ
  const handleChange = (event) => {
    setQuantity(event.target.value);
  };
  const minusClick = () => {
    setQuantity((prevQuantity: string) => {
      const newQuantity = parseInt(prevQuantity) - 1;
      if (newQuantity > 0) {
        return newQuantity.toString();
      } else {
        return "1";
      }
    });
  };

  const plusClick = () => {
    setQuantity((prevQuantity: string) => {
      const newQuantity = parseInt(prevQuantity, 10) + 1;
      return newQuantity.toString();
    });
  };
  // Tìm biến thể phù hợp dựa trên selectedValueNames
  const selectedVariant = product?.variants.find((variant) => {
    const variantTitle = variant?.title;
    const joinSelectedValueNames = selectedValueNames.join("/");
    return joinSelectedValueNames === variantTitle;
  });
  let selectedPrice = 0;
  let selectedStock = 0;
  let selectedImage = "";

  if (selectedVariant) {
    // selectedVariant chứa thông tin biến thể phù hợp
    selectedPrice = selectedVariant?.price;
    selectedStock = selectedVariant?.stock;
    if (selectedStock === 0) {
      alert("hết hàng");
    }
    selectedImage = selectedVariant?.variant_image;
  }
  const priceDiscount = (selectedPrice * (100 - product?.discount)) / 100;

  const handleAddToBasketClick = () => {
    // Kiểm tra nếu đã chọn hết các biến thể
    if (selectedValueNames.length === (product?.attributes?.length || 0)) {
      const selectedAttributes = product?.attributes?.map(
        (attribute, index) => ({
          _id: attribute._id,
          attribute_name: attribute.attribute_name,
          value: selectedValueNames[index],
        })
      );

      const selectedVariant = product?.variants.find((variant) => {
        const variantTitle = variant?.title;
        const joinSelectedValueNames = selectedValueNames.join("/");
        return joinSelectedValueNames === variantTitle;
      });

      if (selectedAttributes && selectedVariant) {
        // Kiểm tra stock trước khi thêm vào giỏ hàng
        if (selectedVariant.stock === 0) {
          alert("Hết hàng");
        } else {
          const Cart: CartItems = {
            product: {
              ...product,
              attributes: selectedAttributes,
              variants: [selectedVariant],
            },
            quantity: parseInt(quantity, 10),
          };
          console.log("Cart", Cart);
          add(Cart);
        }
      }
    } else {
      // Hiển thị thông báo hoặc xử lý khác nếu chưa chọn hết biến thể
      alert("Vui lòng chọn tất cả các biến thể trước khi thêm vào giỏ hàng.");
    }
  };

  const handleAttributeClick = (attributeIndex, optionIndex) => {
    // đùng để tìm ra vị trí index đã chọn
    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[attributeIndex] = optionIndex;
    setSelectedVariants(newSelectedVariants);

    // dựa vào attributeIndex và optionIndex để tìm ra tên của từng value tương ứng
    const selectedAttribute = product?.attributes[attributeIndex];
    if (selectedAttribute) {
      const selectedValue = selectedAttribute.values[optionIndex];

      // Lấy danh sách giá trị đã chọn hiện tại
      const updatedValueNames = [...selectedValueNames];

      // Cộng dồn giá trị đã chọn
      updatedValueNames[attributeIndex] = selectedValue;

      // Cập nhật state với danh sách giá trị đã chọn
      setSelectedValueNames(updatedValueNames);
    }
  };
  // console.log("selectedVariants", selectedVariants);
  console.log("selectedValueNames", selectedValueNames);

  return (
    <div className="lg:flex">
      {/* image */}
      <div className="lg:flex-1 h-[400px] lg:h-[500px] w-full flex items-center justify-center">
        <img
          src={
            selectedVariant &&
            selectedValueNames.length === product?.attributes?.length
              ? selectedImage
              : product?.product_image
          }
          alt="image"
          className="cursor-pointer w-full h-full object-contain"
        />
      </div>
      <div className="lg:flex-1 ml-10">
        x``
        {/* name */}
        <div className="">
          <h3 className="text-2xl text-black font-semibold">{product?.name}</h3>
        </div>
        {/* price */}
        <div className="mt-4 text-primary_green font-bold text-lg">
          <div className="price text-lg text-primary_green mb-1">
            <span>
              {variants.length > 0 ? (
                <span>
                  {numeral(minPrice).format("0,0").replace(/,/g, ".")} -{" "}
                  {numeral(maxPrice).format("0,0").replace(/,/g, ".")} vnđ
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
        </div>
        {/* Stock */}
        {selectedValueNames.length === product?.attributes?.length && (
          <div className="flex mt-4 items-center gap-2 text-primary_green">
            <MdDone size={20} />
            <p>{selectedStock}</p>
            <p>in stock</p>
          </div>
        )}
        {/* variants */}
        {variants.length > 0 && (
          <div className="variants mt-2">
            {product && product.attributes ? (
              product.attributes.map((attribute, attributeIndex) => (
                <div className="mt-2" key={attributeIndex}>
                  <p>{attribute.attribute_name}</p>
                  <div className="flex lg:gap-2 lg:flex-row flex-col mt-3">
                    {attribute?.values?.map((option, optionIndex) => {
                      const isSelected =
                        selectedVariants[attributeIndex] === optionIndex;
                      return (
                        <button
                          className={`px-5 py-1 text-black hover:font-bold border rounded-full mb-3 ${
                            isSelected ? "bg-primary_green text-white" : ""
                          }`}
                          key={optionIndex}
                          onClick={() =>
                            handleAttributeClick(attributeIndex, optionIndex)
                          }
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}
        {/* quantity */}
        <div className="cart flex my-4 pb-20 lg:pb-0">
          <div className="quantity flex border border-gray-200 rounded-md w-[120px] h-[42px]">
            <div className="flex flex-none p-1 border-r w-[25px] items-center justify-center">
              <button
                disabled={parseInt(quantity, 10) === 1}
                onClick={minusClick}
              >
                -
              </button>
            </div>
            <input
              type="text"
              value={quantity}
              onChange={handleChange}
              className="flex-auto w-full text-center"
            />
            <div className="flex flex-none p-1 border-l w-[25px] items-center justify-center">
              <button onClick={plusClick}>+</button>
            </div>
          </div>
          <div className="variants-price mt-4 flex gap-4">
            <p
              className={` font-bold text-lg ${
                product?.discount
                  ? "text-black line-through"
                  : "text-primary_green"
              }`}
            >
              {selectedValueNames.length === product?.attributes?.length
                ? `${numeral(selectedPrice)
                    .format("0,0")
                    .replace(/,/g, ".")} vnđ`
                : ""}
            </p>
            {product?.discount ? (
              <p className="text-primary_green font-bold text-lg">
                {selectedValueNames.length === product?.attributes?.length
                  ? `${numeral(priceDiscount)
                      .format("0,0")
                      .replace(/,/g, ".")} vnđ`
                  : ""}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="add-to-cart flex border border-gray-200 rounded-full bg-primary_green w-[150px] h-[42px] mb-14 mt-4 items-center justify-center">
            <button
              className="p-3 text-white text-sm hover:font-bold"
              onClick={() => handleAddToBasketClick()}
            >
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductVariantOption;
