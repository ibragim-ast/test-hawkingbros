import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchHeaderData, createAdmin } from "./utils/api";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Home from "./pages/Home";

function App() {
  const [headerData, setHeaderData] = useState({
    LogoImg: "",
    UsedGuid: "",
    UserName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await createAdmin();
        const data = await fetchHeaderData();
        setHeaderData(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
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
