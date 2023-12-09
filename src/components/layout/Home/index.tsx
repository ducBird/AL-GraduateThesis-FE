import React, { useState, useEffect } from "react";
import SliderHome from "./Slider/SliderHome";
import CategoriesHome from "./CategoriesHome";
import HotProductsHome from "./HotProductsHome";
import { IProduct } from "../../../interfaces/IProducts";
import { axiosClient } from "../../../libraries/axiosClient";
import { ICategory } from "../../../interfaces/ICategory";
// import { useUser } from "../../../hooks/useUser";

function Home() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [products, setProducts] = useState<Array<IProduct>>([]);
  // const { addUser } = useUser((state) => state);

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
  // useEffect(() => {
  //   const getUser = () => {
  //     fetch("http://localhost:9000/customers/login/success", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin": "http://localhost:3000",
  //         "Access-Control-Allow-Credentials": true,
  //       },
  //     })
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json();
  //         }
  //         throw new Error("authentication failed!");
  //       })
  //       .then((resObject) => {
  //         // console.log(resObject.user);
  //         // console.log(resObject.cookie.session_google_account);
  //         window.localStorage.setItem(
  //           "cookie-google",
  //           resObject.cookie.session_google_account
  //         );
  //         addUser(resObject.user);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  //   getUser();
  // }, []);
  return (
    <div className="mx-5 lg:mx-32 py-10">
      <SliderHome products={products} />
      <HotProductsHome products={products} />
      <CategoriesHome categories={categories} products={products} />
    </div>
  );
}

export default Home;
