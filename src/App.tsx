import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register";
import ShoppingCart from "./components/CheckCart/ShoppingCart";
import CheckOut from "./components/CheckCart/CheckOut";
import Shop from "./components/layout/Shop";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <main className="font-roboto relative overflow-hidden">Main</main>
        </header>
        <section style={{ marginTop: "60px" }}>
          <Routes>
            <Route path="/component/auth/register" element={<Register />} />
            <Route
              path="/component/checkcart/shoppingcart"
              element={<ShoppingCart />}
            />
            <Route
              path="/component/checkcart/checkout"
              element={<CheckOut />}
            />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product-category/:categoryId" element={<Shop />} />
            <Route
              path="/product-category/:categoryId/sub/:subCategoryId"
              element={<Shop />}
            />

            <Route path="/search-products" element={<Shop />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>404 Page not found 😂😂😂</p>
                </main>
              }
            />
          </Routes>
        </section>
      </BrowserRouter>
    </div>
  );
}

export default App;
