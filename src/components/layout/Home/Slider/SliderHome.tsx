import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IProduct } from "../../../../interfaces/IProducts";
import "./slider.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
interface IProductProps {
  products: IProduct[];
}
function SliderHome(props: IProductProps) {
  const { products } = props;
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const findProductsSortOrder = products.filter((product) => {
    return product.sort_order === 1;
  });
  return (
    <div>
      <Slider {...settings}>
        {findProductsSortOrder.map((value, index) => {
          return (
            <div
              className="silder cursor-pointer px-10 lg:h-[500px]"
              key={index}
            >
              <div className="lg:flex-1 lg:h-full slider__product_image ">
                <Link to={`/shop/product/${value._id}`}>
                  <img
                    className="lg:w-full lg:h-full mx-auto object-contain "
                    src={value.product_image}
                    alt=""
                  />
                </Link>
              </div>
              <div className="lg:w-[40%] lg:h-full slider__product_name text-center">
                <div className="py-[10px] lg:py-[50%]">
                  <Link to={`/shop/product/${value._id}`}>
                    <p className="text-2xl font-bold">{value.name}</p>
                  </Link>
                  <Link to={`/shop/product/${value._id}`}>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="mt-7 rounded-full bg-primary_green shadow-md"
                    >
                      <p className="py-2 px-4 text-white hover:font-bold">
                        SHOP NOW
                      </p>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default SliderHome;
