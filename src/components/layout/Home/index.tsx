import React, { useState, useEffect } from "react";
import SliderHome from "./Slider/SliderHome";
import CategoriesHome from "./CategoriesHome";
import HotProductsHome from "./HotProductsHome";
import { IProduct } from "../../../interfaces/IProducts";
import { axiosClient } from "../../../libraries/axiosClient";
import { ICategory } from "../../../interfaces/ICategory";

function Home() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);

  const [products, setProducts] = useState<Array<IProduct>>([]);

  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);
  useEffect(() => {
    axiosClient.get("/products").then((reponse) => {
      setProducts(reponse.data);
    });
  }, []);
  return (
    <div className="mx-5 lg:mx-32 py-10">
      <SliderHome products={products} />
      <HotProductsHome products={products} />
      <CategoriesHome categories={categories} products={products} />
    </div>
  );
}

export default Home;
