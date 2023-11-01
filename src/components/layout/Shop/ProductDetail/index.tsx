import { useEffect, useState } from "react";
import { axiosClient } from "../../../../libraries/axiosClient";
import Product from "../Product";

import { Link, useParams } from "react-router-dom";
import { IProduct } from "../../../../interfaces/IProducts";
import ProductVariantOption from "../ProductVariantOption";
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

  const [quantity, setQuantity] = useState<string>("1");

  // lấy id từ query của router
  //   const router = useRouter();

  const { id } = useParams();

  const categoryId = product?.category_id;
  const subCategoryId = product?.sub_category_id;

  // ?.name có ý nghĩa là khi đã tìm thấy id phù hợp với categoryId thì dùng ?.name để truy cập vòa thuộc tính name và gán vào biến categoryName
  const categoryName = categories.find((item) => item._id === categoryId)?.name;
  const subCategoryName = subCategories.find(
    (item) => item._id === subCategoryId
  )?.name;

  //Loại trừ sản phẩm khỏi danh sách sản phẩm liên quan
  const filteredRelatedProducts = relatedProducts.filter(
    (relatedProduct) => relatedProduct._id !== id
  );

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
          <div className="lg:flex-1 h-[400px] lg:h-[500px] w-full flex items-center justify-center">
            <img
              src={product?.product_image}
              alt="image"
              className="cursor-pointer w-full h-full object-contain"
            />
          </div>
          <div className="p-7 lg:flex-1 border border-gray-200 h-auto lg:ml-4">
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
      </div>
      <div className="border border-b-0 border-gray-200 my-12"></div>
      <div className="related-products my-7">
        <h4 className="text-xl font-semibold my-4">Sản phẩm liên quan</h4>
        <div className="grid gap-x-2 gap-y-2 grid-cols-2 lg:grid-cols-5 text-center mt-5">
          {filteredRelatedProducts &&
            filteredRelatedProducts.map((item) => {
              return <Product product={item} key={item?._id} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
