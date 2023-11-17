import { useState } from "react";
import { motion } from "framer-motion";
import { ICategory } from "../../../../interfaces/ICategory";
import { IProduct } from "../../../../interfaces/IProducts";
import Product from "../../Shop/Product";
import imageCategory from "../../../../assets/AquaticLogo-modified.png";
interface IProps {
  categories: ICategory[];
  products: IProduct[];
}
function CategoriesHome(props: IProps) {
  const { categories, products } = props;
  const [filter, setFilter] = useState<string>("");
  const findProductByCategoryId = products.filter(
    (product) => product?.category?._id?.toString() === filter
  );

  return (
    <div className="mt-16">
      <p
        className="md:text-2xl text-xl font-semibold capitalize text-headingColor 
            relative before:absolute before:rounded-lg before:content before:w-24 md:before:w-28
            before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-primary_green to-green-700 mr-auto"
      >
        Danh mục
      </p>
      <div className="w-full flex items-center justify-start lg:justify-center gap-8 py-6 overflow-x-scroll scrollbar-none lg:overflow-x-hidden">
        {categories &&
          categories.map((category, index) => {
            const categoryId = category?._id?.toString() ?? "";
            return (
              <motion.div
                whileTap={{ scale: 0.85 }}
                key={index}
                className={`group ${
                  filter === categoryId ? "bg-primary_green" : "bg-green-50"
                } w-28 min-w-[94px] h-32 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center 
                  justify-center duration-100 transition-all ease-in-out hover:bg-primary_green`}
                onClick={() => {
                  setFilter(categoryId);
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    filter === categoryId ? "bg-white" : "bg-primary_green"
                  } group-hover:bg-white 
                  flex items-center justify-center`}
                >
                  <img
                    src={imageCategory}
                    alt="image"
                    className={`${
                      filter === categoryId ? "text-black" : "text-white"
                    } group-hover:text-black text-lg`}
                  />
                </div>
                <p
                  className={`md:text-sm text-xs ${
                    filter === categoryId ? "text-white" : "text-black"
                  } group-hover:text-white`}
                >
                  {category?.name}
                </p>
              </motion.div>
            );
          })}
      </div>
      <div className="w-full lg:flex lg:items-center lg:justify-center gap-3 mt-5">
        {findProductByCategoryId &&
          findProductByCategoryId.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[90%] lg:w-[290px] text-center border mb-5 justify-center rounded-md
                            shadow-md mx-auto lg:mx-0"
              >
                <Product product={item} key={item?._id} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CategoriesHome;
