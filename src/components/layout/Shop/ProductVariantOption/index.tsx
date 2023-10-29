import { useState, useEffect } from "react";
import { MdDone } from "react-icons/md";
import numeral from "numeral";
import { IProduct } from "../../../../interfaces/IProducts";
import { useCarts } from "../../../../hooks/useCart";
import { IVariantOptions } from "../../../../interfaces/IVariantOptions";
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
  const [selectedOptions, setSelectedOptions] = useState<{
    [variantId: string]: IVariantOptions | null;
  }>({});

  // console.log("setSelectedOptions", selectedOptions);
  // const [productPrice, setProductPrice] = useState<number | null>(null);
  // Lấy ra danh sách các variant từ sản phẩm
  const variants = product?.variants || [];

  // Khởi tạo giá mới bằng giá ban đầu
  let newPrice = numeral(product?.price).value();
  const discount = numeral(product?.discount).value();
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
  const [productPrice, setProductPrice] = useState<number | null>(newPrice);
  const [productDiscount, setProductDiscount] = useState<number | null>(
    totalDiscount
  );
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
  // Hàm tính toán tên sản phẩm với các option đã chọn
  const getProductFullName = (): string => {
    let fullName = product?.name || ""; // Tên sản phẩm mặc định

    // Duyệt qua các variant và option đã chọn
    for (const variantId in selectedOptions) {
      const selectedOptionValue = selectedOptions[variantId];
      if (selectedOptionValue) {
        const variant = product?.variants.find(
          (variant) => variant._id === variantId
        );
        const option = variant?.options?.find(
          (option) => option.value === selectedOptionValue?.value
        );
        if (variant && option) {
          fullName += ` - ${option.value}`; // Nối tên option vào chuỗi fullName
        }
      }
    }

    return fullName;
  };
  const handleOptionClick = (variantId: string, option: IVariantOptions) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [variantId]: option,
    }));
  };

  // Hàm tính toán giá sản phẩm dựa trên các option đã chọn
  const calculateProductPrice = (): PriceResult => {
    let totalPrice = product?.price || 0; // Giá gốc của sản phẩm
    let discountOptions = 0;

    if (product !== null && product !== undefined) {
      // Duyệt qua các variant và option đã chọn
      for (const variantId in selectedOptions) {
        const selectedOptionValue = selectedOptions[variantId];
        if (selectedOptionValue) {
          const variant = product.variants.find(
            (variant) => variant._id === variantId
          );
          const option = variant?.options?.find(
            (option) => option.value === selectedOptionValue?.value
          );
          if (variant && option && option.add_valuation !== undefined) {
            totalPrice += option.add_valuation!; // Cộng giá trị add_valuation của option vào giá sản phẩm
          }
        }
      }

      if (product.discount) {
        discountOptions = (totalPrice * (100 - product?.discount)) / 100; // Giá sau khi áp dụng giảm giá
      } else {
        discountOptions = totalPrice;
      }
      product.total = discountOptions; // Gán giá trị discountOptions vào thuộc tính total của product
    }

    return {
      discountOptions,
      totalPrice,
    };
  };

  // const handleAddToBasketClick = () => {
  //   // Object.keys(selectedOptions) là một phương thức trong JavaScript
  //   // trả về một mảng các tên thuộc tính có thể liệt kê của một đối tượng.
  //   // ví dụ selectedOptions{ variant1: "option1", variant2: "option2" }
  //   // thì khi sử dụng Object.keys(selectedOptions) sẽ có kết quả là: ["variant1", "variant2"]
  //   const fullName = getProductFullName();
  //   const Cart: CartItems = {
  //     product: { ...product, name: fullName } as IProduct, // Thay đổi trường "name" thành giá trị của "fullName"
  //     quantity: parseInt(quantity, 10),
  //   };
  //   const options = Object.keys(selectedOptions).length;
  //   if (options === product?.variants.length) {
  //     // const selectedOptionsString = JSON.stringify(selectedOptions);
  //     // localStorage.setItem("selectedOptions", selectedOptionsString);
  //     add(Cart);
  //   } else {
  //     alert("Vui lòng chọn đầy đủ các biến thể");
  //   }
  // };
  const handleAddToBasketClick = () => {
    const fullName = getProductFullName();
    const productItems = JSON.parse(JSON.stringify(product));
    const Cart: CartItems = {
      product: { ...productItems, name: fullName } as IProduct,
      quantity: parseInt(quantity, 10),
    };

    // Kiểm tra xem tất cả các variant đã được chọn option chưa
    const options = Object.keys(selectedOptions).length;
    if (options === product?.variants.length) {
      const selectedVariantIds = Object.keys(selectedOptions); // Lấy danh sách các variant đã chọn option
      // biến này dùng để lấy ra các option đã được chọn
      const selectedOptionsToAdd = selectedVariantIds.map((variantId) => {
        const selectedOptionValue = selectedOptions[variantId];
        const variant = product.variants.find(
          (variant) => variant?._id === variantId
        );
        const option = variant?.options?.find(
          (option) => option.value === selectedOptionValue?.value
        );
        return option;
      });

      // dùng để tìm các option đã được chọn mới được thêm vào variant trong mảng items
      Cart?.product?.variants.forEach((variant) => {
        const variantId = variant._id;
        // Kiểm tra xem variant có trong danh sách variant đã chọn option không
        if (selectedVariantIds.includes(variantId)) {
          // tạo một biến để lưu trữ các option đã chọn
          const selectedVariantOptions: IVariantOptions[] = [];
          variant.options?.forEach((option) => {
            const selectedOption = selectedOptionsToAdd.find(
              (filteredOption) => filteredOption?._id === option?._id
            );
            if (selectedOption) {
              selectedVariantOptions.push(selectedOption); // Sử dụng kiểu 'any' ở đây
            }
          });
          variant.options = selectedVariantOptions;
        } else {
          // Xóa tất cả các option của variant không có trong danh sách variant đã chọn option
          variant.options = null;
        }
      });

      add(Cart);
    } else {
      alert("Vui lòng chọn đầy đủ các loại sản phẩm");
    }
  };

  // Cập nhật giá sản phẩm khi có thay đổi trong selectedOptions
  useEffect(() => {
    // Kiểm tra xem đã có selectedOptions hay chưa
    if (Object.keys(selectedOptions).length > 0) {
      const newProductPrice = calculateProductPrice();
      const newProductDiscount = calculateProductPrice();
      setProductPrice(newProductPrice.totalPrice);
      setProductDiscount(newProductDiscount.discountOptions);
    } else {
      // Nếu không có selectedOptions, sử dụng giá ban đầu và discount theo giá ban đầu
      setProductPrice(newPrice);
      setProductDiscount(totalDiscount);
    }
  }, [selectedOptions, newPrice, totalDiscount]);

  return (
    <>
      {/* name */}
      <div className="">
        <h3 className="text-2xl text-black font-semibold">
          {getProductFullName()}
        </h3>
      </div>

      {/* price */}
      <div className="mt-4 text-primary_green font-bold text-lg">
        <div className="price text-lg text-primary_green mb-1">
          <span
            className={
              product?.discount
                ? "line-through text-black"
                : "list-none  font-bold"
            }
          >
            {/* {numeral(product?.price).format("0,0").replace(/,/g, ".")} */}
            {/* {numeral(calculateProductPrice().totalPrice)
              .format("0,0")
              .replace(/,/g, ".")} */}
            {numeral(productPrice || newPrice)
              .format("0,0")
              .replace(/,/g, ".")}{" "}
            vnđ
          </span>
          <span className={product?.discount ? "pl-2 font-bold" : "hidden"}>
            {product &&
              // numeral(calculateProductPrice().discountOptions)
              //   .format("0,0")
              //   .replace(/,/g, ".")
              numeral(productDiscount || totalDiscount)
                .format("0,0")
                .replace(/,/g, ".")}{" "}
            vnđ
          </span>
        </div>
      </div>

      {/* Stock */}
      <div className="flex mt-4 items-center gap-2 text-primary_green">
        <MdDone size={20} />
        <p></p>
        <p>in stock</p>
      </div>

      {/* variants */}
      <div className="variants mt-2">
        {product &&
          product.variants.map((variant, variantIndex) => (
            <div className="mt-2" key={variantIndex}>
              <p>{variant.title}</p>
              <div className="flex gap-2 mt-3">
                {variant?.options?.map((option, optionIndex) => {
                  const optionValue = option.value;
                  const isOptionSelected =
                    selectedOptions[variant._id]?._id === option._id &&
                    optionValue !== undefined;
                  return (
                    <button
                      className={`px-5 py-1 text-black hover:font-bold border rounded-full ${
                        isOptionSelected ? "bg-primary_green text-white" : ""
                      }`}
                      key={optionIndex}
                      onClick={() => {
                        handleOptionClick(variant._id, option);
                      }}
                    >
                      {option?.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

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
        <div className="add-to-cart flex border border-gray-200 rounded-full bg-primary_green w-auto h-[42px] ml-10 items-center justify-center">
          <button
            className="p-3 text-white text-sm hover:font-bold"
            onClick={() => handleAddToBasketClick()}
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductVariantOption;
