import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/ShoppingCart";

export const createAdmin = async () => {
  try {
    await axios.post("http://localhost:8080/api/Admin/create?value=12");
  } catch (error) {
    console.error("Ошибка при создании администратора:", error);
    throw error;
  }
};
export const fetchHeaderData = async () => {
  try {
    const responce = await axios.get(`${API_BASE_URL}/header`);
    return responce.data;
  } catch (error) {
    console.error("Ошибка при получении данных заголовка:", error);
    throw error;
  }
};

export const fetchCartProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных корзины:", error);
    throw error;
  }
};

export const fetchViewedList = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/ShoppingCart/viewedList"
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных просмотренных товаров", error);
    throw error;
  }
};

export const getTotalPrice = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/baskedsummary`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении общей стоимости корзины:", error);
    throw error;
  }
};

export const changeProductQuantity = async (id, amount, type, userGuid) => {
  try {
    const endpoint =
      type === "inc"
        ? `${API_BASE_URL}/quantityinc`
        : `${API_BASE_URL}/quantitydec`;

    await axios.post(endpoint, {
      ProductId: id,
      UserGuid: userGuid,
      Amount: amount,
    });
  } catch (error) {
    console.error(
      `Error while ${type === "inc" ? "increasing" : "decreasing"} quantity:`,
      error
    );
    throw error;
  }
};

export const applyDiscountCode = async (discountCode, userGuid) => {
  try {
    const payload = {
      DiscountName: discountCode,
      UsedGuid: userGuid,
    };
    console.log("Sending payload:", payload);
    await axios.post(`${API_BASE_URL}/discount`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Ошибка при применении промокода:", error);
    throw error;
  }
};

export const removeDiscountCode = async (userGuid) => {
  try {
    await axios.delete(`${API_BASE_URL}/discount`, {
      data: { UserGuid: userGuid },
    });
  } catch (error) {
    console.error("Ошибка при удалении промокода:", error);
    throw error;
  }
};

export const deleteProduct = async (id, userGuid) => {
  try {
    await axios.delete(`${API_BASE_URL}/product`, {
      data: {
        ProductId: id,
        UserGuid: userGuid,
      },
    });
  } catch (error) {
    console.error("Ошибка при удалении продукта из корзины:", error);
    throw error;
  }
};

export const deleteAllProduct = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/products`);
  } catch (error) {
    console.error("Ошибка при очистке корзины:", error);
    throw error;
  }
};
