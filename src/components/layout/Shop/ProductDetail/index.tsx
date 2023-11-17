import { useEffect, useState } from "react";
import { axiosClient } from "../../../../libraries/axiosClient";
import Product from "../Product";

import { Link, useParams } from "react-router-dom";
import { IProduct } from "../../../../interfaces/IProducts";
import ProductVariantOption from "../ProductVariantOption";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Rate } from "antd";
import imageUser from "../../../../assets/hinh_anh_danh_gia.png";
import { useUser } from "../../../../hooks/useUser";
import moment from "moment";
interface ICategories {
  _id: string;
  name: string;
}
interface ISubCategories {
  _id: string;
  name: string;
}

function ProductDetail() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Array<IProduct>>([]);

  const [categories, setCategories] = useState<Array<ICategories>>([]);
  const [subCategories, setSubCategories] = useState<Array<ISubCategories>>([]);

  const [selectedRating, setSelectedRating] = useState("ALL"); // Giá trị mặc định là "ALL"
  const { users } = useUser((state) => state);
  // lấy id từ query của router
  //   const router = useRouter();

  const { id } = useParams();

  const categoryId = product?.category_id;
  const subCategoryId = product?.sub_category_id;

  // ?.name có ý nghĩa là khi đã tìm thấy id phù hợp với categoryId thì dùng ?.name để truy cập vào thuộc tính name và gán vào biến categoryName
  const categoryName = categories.find((item) => item._id === categoryId)?.name;
  const subCategoryName = subCategories.find(
    (item) => item._id === subCategoryId
  )?.name;

  const ratingValue = [
    { label: "Tất cả", value: "ALL" },
    { label: "5 Sao", value: 5 },
    { label: "4 Sao", value: 4 },
    { label: "3 Sao", value: 3 },
    { label: "2 Sao", value: 2 },
    { label: "1 Sao", value: 1 },
  ];
  //Loại trừ sản phẩm khỏi danh sách sản phẩm liên quan
  const filteredRelatedProducts = relatedProducts.filter(
    (relatedProduct) => relatedProduct._id !== id
  );
  // hàm tính trung bình cộng rating của sản phẩm
  const averageRating = () => {
    if (product?.reviews && product.reviews.length > 0) {
      const sumRating = product.reviews.reduce(
        (accumulator, review) => accumulator + review.rating,
        0
      );
      return sumRating / product.reviews.length;
    }
    return 0; // Trả về 0 nếu không có đánh giá
  };
  const getReviewsByRating = (rating) => {
    const reviewCounts = {};

    // Khởi tạo đối tượng để theo dõi số lượng đánh giá của từng mức sao
    ratingValue.forEach((value) => {
      reviewCounts[value?.value] = 0;
    });

    // Lặp qua danh sách đánh giá và tăng giá trị tương ứng trong đối tượng
    product?.reviews?.forEach((review) => {
      reviewCounts[review?.rating]++;
    });

    return reviewCounts[rating] || 0; // Trả về số lượng đánh giá của mức sao cần tìm
  };

  useEffect(() => {
    if (id) {
      axiosClient.get("/products/product/" + id).then((response) => {
        setProduct(response.data);
      });
    }
  }, [id]);

  // get data categories
  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  // get data subcategories
  useEffect(() => {
    if (subCategoryId) {
      axiosClient.get("/sub-categories").then((response) => {
        setSubCategories(response.data);
      });
    }
  }, [subCategoryId]);

  // tìm ra các sản phẩm liên quan với product được chọn làm product detail
  useEffect(() => {
    if (product) {
      const fetchRelatedProducts = async () => {
        try {
          if (subCategoryId) {
            const response = await axiosClient.get(
              "/products/" + categoryId + "/sub/" + subCategoryId
            );
            setRelatedProducts(response.data);
          }
        } catch (error) {
          console.error("Error fetching related products:", error);
        }
      };

      fetchRelatedProducts();
    }
  }, [product, subCategoryId, categoryId]);

  return (
    <div className="m-4 lg:px-20 lg:py-8 py-4">
      <div className="product-detail">
        <div className="flex">
          <Link to="/shop">
            <p>Cửa hàng</p>
          </Link>
          <p className="mx-2">/</p>
          <Link to={`/product-category/${categoryId}`}>
            <p>{categoryName}</p>
          </Link>
          {subCategoryId && (
            <>
              <p className="mx-2">/</p>
              <Link to={`/product-category/${categoryId}/sub/${subCategoryId}`}>
                <p className="font-semibold">{subCategoryName}</p>
              </Link>
            </>
          )}
        </div>
        <div className="lg:flex mt-3 lg:mt-10 ">
          {/* <div className="lg:flex-1 h-[400px] lg:h-[500px] w-full flex items-center justify-center">
            <img
              src={product?.product_image}
              alt="image"
              className="cursor-pointer w-full h-full object-contain"
            />
          </div> */}
          <div className="p-7 lg:flex-1 border border-gray-200 h-auto">
            <div>
              <ProductVariantOption product={product} />
            </div>
            <div className="border border-b-0 my-9"></div>
            <div className="flex">
              <p className="font-bold">Categories: </p>
              <Link to={`/product-category/${categoryId}`}>
                <p className="ml-2 hover:font-bold">{categoryName}</p>
              </Link>
              {subCategoryId && (
                <>
                  <p>,</p>
                  <Link
                    to={`/product-category/${categoryId}/sub/${subCategoryId}`}
                  >
                    <p className="ml-1 hover:font-bold">{subCategoryName}</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {product?.reviews && product.reviews.length > 0 && (
          <div className="border h-auto mt-10">
            <h3 className="text-xl font-semibold m-4">ĐÁNH GIÁ SẢN PHẨM</h3>
            <div className="border h-auto m-6 bg-[#fffbf8] flex">
              <div className="rating m-4 text-xl text-red-500">
                <p>{parseFloat(averageRating().toFixed(1))} trên 5</p>
                <Rate
                  allowHalf
                  disabled
                  value={parseFloat(averageRating().toFixed(1))}
                />
              </div>
              <div className="flex justify-between items-center gap-10 ml-10 lg:text-xl">
                {ratingValue.map((value, index) => {
                  return (
                    <button
                      key={index}
                      className="border py-2 px-10 flex rounded-md"
                      onClick={() =>
                        setSelectedRating(value.value.toLocaleString())
                      }
                    >
                      <p className="pr-2">{value.label}</p>
                      {value.value === "ALL" ? (
                        ""
                      ) : (
                        <p>({getReviewsByRating(value.value) || 0})</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="m-6">
              <h3>Nội dung đánh giá</h3>
              {product?.reviews?.map(
                (review, index) =>
                  (selectedRating === "ALL" ||
                    selectedRating === review.rating.toString()) && (
                    <div key={index} className="border-b pb-5 mt-5">
                      <div className="flex">
                        <img
                          src={imageUser}
                          alt="imge_user"
                          className="w-[50px] h-[50px] rounded-full"
                        />
                        <div className="pl-5">
                          <p>
                            {users.user?.first_name} {users.user?.last_name}
                          </p>
                          <Rate disabled value={review.rating} />
                          <p>{moment(review.date).format("DD/MM/YYYY")}</p>
                        </div>
                      </div>
                      <div className="pl-[70px] mt-5">
                        <p>{review.comment}</p>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
      <div className="border border-b-0 border-gray-200 my-12"></div>
      <div className="related-products my-7">
        <h4 className="text-xl font-semibold my-4">SẢN PHẨM LIÊN QUAN</h4>
        {filteredRelatedProducts.length > 0 ? (
          <div className="grid gap-x-2 gap-y-2 grid-cols-2 lg:grid-cols-5 text-center mt-5">
            {filteredRelatedProducts &&
              filteredRelatedProducts.map((item) => {
                return <Product product={item} key={item?._id} />;
              })}
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AiOutlineInfoCircle lg:size={200} size={130} />
            </div>
            <p className="text-primary_green font-bold text-lg">
              Không có sản phẩm{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
