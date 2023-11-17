import { IProduct } from "../../../../interfaces/IProducts";
import Product from "../../Shop/Product";
interface IProductsProps {
  products: IProduct[];
}

function HotProductsHome(props: IProductsProps) {
  const { products } = props;
  const findProductsDiscount = products.filter((product) => {
    return product.sort_order === 10;
  });
  return (
    <div className="mt-16 w-full">
      <p
        className="md:text-2xl text-xl font-semibold capitalize text-headingColor 
      relative before:absolute before:rounded-lg before:content before:w-[165px] lg:before:w-[198px]
      before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-primary_green to-green-700 mr-auto"
      >
        Sản Phẩm Nổi Bật
      </p>

      <div className="w-full mt-9 grid grid-flow-col gap-3 overflow-x-auto text-center">
        {findProductsDiscount &&
          findProductsDiscount.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[270px] text-center border mb-10 justify-center rounded-md shadow-md"
              >
                <Product product={item} key={item?._id} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default HotProductsHome;
