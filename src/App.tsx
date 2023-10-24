import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <main className="font-roboto relative overflow-hidden">
            Main
          </main>
        </header>
        <section style={{ marginTop: "60px" }}>
          <Routes>
            <Route path="/component/auth/register" element={<Register />} />
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
