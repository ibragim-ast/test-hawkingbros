import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Cart from "./components/Cart";
import Home from "./pages/Home";

function App() {
  const [headerData, setHeaderData] = useState({
    LogoImg: "",
    UsedGuid: "",
    UserName: "",
  });

  const fetchHeaderData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/shoppingcart/header"
      );
      setHeaderData(response.data);
      console.log("HeaderData", response.data);
    } catch (error) {
      console.error("Ошибка при получении данных заголовка:", error);
    }
  };

  const createAdmin = async () => {
    try {
      await axios.post("http://localhost:8080/api/Admin/create?value=12");
    } catch (error) {
      console.error("Ошибка при создании администратора:", error);
    }
  };

  useEffect(() => {
    createAdmin();
    fetchHeaderData();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header logoImg={headerData.LogoImg} userName={headerData.UserName} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/cart"
            element={<Cart userGuid={headerData.UsedGuid} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
