import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table, Button, InputNumber, Spin, Input, Image, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import EmptyCart from "../EmptyCart";
import {
  fetchCartProducts,
  fetchViewedList,
  getTotalPrice,
  changeProductQuantity,
  applyDiscountCode,
  removeDiscountCode,
  deleteProduct,
  deleteAllProduct,
} from "../../utils/api";

import styles from "./Cart.module.css";

const Cart = ({ userGuid }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [openViewedList, setOpenViewedList] = useState(false);
  const [viewedList, setViewedList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      title: "Фото",
      dataIndex: "images",
      key: "image",
      render: (images) => {
        if (images && images.length > 0) {
          const items = images
            .map((image) => {
              if (image.FileName && image.FileExtension && image.Image) {
                const { FileExtension, FileName, Image } = image;
                const imageUrl = `data:image/${FileExtension};base64,${Image}`;
                return { src: imageUrl, alt: FileName };
              }
              return null;
            })
            .filter((item) => item !== null);

          if (items.length > 0) {
            return (
              <Image.PreviewGroup>
                <Image
                  src={items[0].src}
                  alt={items[0].alt}
                  style={{ width: 50 }}
                />
                {items.slice(1).map((item, index) => (
                  <Image
                    key={index + 1}
                    src={item.src}
                    alt={item.alt}
                    style={{ display: "none" }}
                  />
                ))}
              </Image.PreviewGroup>
            );
          }
        }
        return null;
      },
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <div className={styles.quantityContainer}>
          <InputNumber
            value={record.quantity}
            onChange={(newQuantity) => {
              handleQuantityChange(record.key, newQuantity);
            }}
          />
          <span>{record.unit}.</span>
        </div>
      ),
    },
    {
      title: "Цена",
      dataIndex: "currency",
      key: "currency",
      render: (_, record) => (
        <div>
          <span
            className={styles.price}
          >{`${record.price} ${record.currency}`}</span>
        </div>
      ),
    },
    {
      title: "Скидка",
      dataIndex: "discountedPrice",
      key: "discountedPrice",
    },
    {
      title: "Удалить",
      key: "action",
      render: (_, record) => (
        <DeleteOutlined
          onClick={() => handleDeleteProduct(record.key)}
          size="middle"
        />
      ),
    },
  ];

  const viewedListColumns = [
    {
      title: "Фото",
      dataIndex: "images",
      key: "image",
      render: (images) => {
        if (images && images.length > 0) {
          const items = images
            .map((image) => {
              if (image.FileName && image.FileExtension && image.Image) {
                const { FileExtension, FileName, Image } = image;
                const imageUrl = `data:image/${FileExtension};base64,${Image}`;
                return { src: imageUrl, alt: FileName };
              }
              return null;
            })
            .filter((item) => item !== null);

          if (items.length > 0) {
            return (
              <Image.PreviewGroup>
                <Image
                  src={items[0].src}
                  alt={items[0].alt}
                  style={{ width: 50 }}
                />
                {items.slice(1).map((item, index) => (
                  <Image
                    key={index + 1}
                    src={item.src}
                    alt={item.alt}
                    style={{ display: "none" }}
                  />
                ))}
              </Image.PreviewGroup>
            );
          }
        }
        return null;
      },
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Цена",
      dataIndex: "currency",
      key: "currency",
      render: (_, record) => (
        <div>
          <span
            className={styles.price}
          >{`${record.price} ${record.currency}`}</span>
        </div>
      ),
    },
    {
      title: "Добавить в корзину",
      key: "action",
      render: () => <Button shape="circle" icon={<PlusOutlined />} />,
    },
  ];

  const data =
    cartProducts &&
    cartProducts.map((product) => ({
      key: product.Id,
      images: product.Images,
      name: product.Name,
      description: product.Description,
      quantity: product.Quantity,
      unit: product.Unit,
      currency: product.Сurrency,
      price: product.Price,
      discountedPrice: product.DiscountedPrice,
    }));

  const viewedListData =
    viewedList &&
    viewedList.map((product) => ({
      key: product.Id,
      images: product.Images,
      name: product.Name,
      description: product.Description,
      quantity: product.Quantity,
      unit: product.Unit,
      currency: product.Сurrency,
      price: product.Price,
      discountedPrice: product.DiscountedPrice,
    }));

  useEffect(() => {
    const loadData = async () => {
      try {
        const cartProductsData = await fetchCartProducts();
        setCartProducts(cartProductsData);
        const viewedListData = await fetchViewedList();
        setViewedList(viewedListData);
        const totalPriceData = await getTotalPrice();
        setTotalPrice(totalPriceData);
      } catch (error) {
        console.error(error);
        setError("Ошибка при загрузке данных. Пожалуйста, попробуйте позже.");
        message.error(
          "Ошибка при загрузке данных. Пожалуйста, попробуйте позже."
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleOpenViewedList = () => {
    setOpenViewedList(!openViewedList);
  };

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const product = cartProducts.find((p) => p.Id === id);
      if (!product) {
        message.error(`Товар с идентификатором ${id} не найден.`);
        return;
      }

      const currentQuantity = product.Quantity;
      const diff = newQuantity - currentQuantity;

      if (diff > 0) {
        await changeProductQuantity(id, diff, "inc", userGuid);
      } else if (diff < 0) {
        if (currentQuantity + diff <= 0) {
          await handleDeleteProduct(id);
        } else {
          await changeProductQuantity(id, -diff, "dec", userGuid);
        }
      }

      setCartProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.Id === id ? { ...product, Quantity: newQuantity } : product
        )
      );
      const totalPriceData = await getTotalPrice();
      setTotalPrice(totalPriceData);
    } catch (error) {
      console.error("Ошибка при изменении количества продуктов:", error);
      message.error("Ошибка при изменении количества продуктов.");
    }
  };

  const handleApplyDiscountCode = async () => {
    try {
      const responce = await applyDiscountCode(discountCode, userGuid);
      if (responce.Description === "Промокод введен не верно") {
        message.error(responce.Description);
        return;
      }
      setDiscountApplied(true);
      const totalPriceData = await getTotalPrice();
      setTotalPrice(totalPriceData);
      const cartProductsData = await fetchCartProducts();
      setCartProducts(cartProductsData);
      message.success("Промокод успешно применен!");
    } catch (error) {
      console.error("Ошибка при применении промокода:", error);
      message.error("Ошибка при применении промокода.");
    }
  };

  const handleRemoveDiscountCode = async () => {
    try {
      await removeDiscountCode(userGuid);
      setDiscountApplied(false);
      setDiscountCode("");
      const totalPriceData = await getTotalPrice();
      setTotalPrice(totalPriceData);
      const cartProductsData = await fetchCartProducts();
      setCartProducts(cartProductsData);
      message.success("Промокод успешно удален!");
    } catch (error) {
      console.error("Ошибка при удалении промокода:", error);
      message.error("Ошибка при удалении промокода.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id, userGuid);
      setCartProducts((prevProducts) =>
        prevProducts.filter((product) => product.Id !== id)
      );
      const totalPriceData = await getTotalPrice();
      setTotalPrice(totalPriceData);
      message.success("Товар успешно удален!");
    } catch (error) {
      console.error("Ошибка при удалении продукта из корзины:", error);
      message.error("Ошибка при удалении продукта из корзины.");
    }
  };

  const handleDeleteAllProduct = async () => {
    try {
      await deleteAllProduct();
      setCartProducts([]);
      const totalPriceData = await getTotalPrice();
      setTotalPrice(totalPriceData);
      message.success("Корзина успешно очищена!");
    } catch (error) {
      console.error("Ошибка при очистке корзины:", error);
      message.error("Ошибка при очистке корзины.");
    }
  };

  return (
    <div className={styles.cart}>
      {isLoading ? (
        <Spin size="large" fullscreen={true} />
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : cartProducts.length > 0 ? (
        <>
          <Button onClick={toggleOpenViewedList}>
            {!openViewedList
              ? "Показать просмотренные товары"
              : "Скрыть просмотренные товары"}
          </Button>

          {openViewedList && (
            <>
              <h2>Просмотренные товары</h2>
              <Table
                className={styles.viewedList}
                pagination={false}
                columns={viewedListColumns}
                dataSource={viewedListData}
              />
            </>
          )}
          <h2>Корзина</h2>
          <div className={styles.cartInfo}>
            <span>{`Товаров в корзине: ${totalPrice.TotalProducts}`}</span>
            <Button
              className="button"
              icon={<DeleteOutlined />}
              onClick={handleDeleteAllProduct}
            >
              Очистить корзину
            </Button>
          </div>
          <Table pagination={false} columns={columns} dataSource={data} />

          <div className={styles.discountSection}>
            <Input
              placeholder="Введите промокод"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={discountApplied || totalPrice.Discount}
              style={{ width: 200, marginRight: 10 }}
            />

            {discountApplied || totalPrice.Discount ? (
              <Button
                type="danger"
                onClick={handleRemoveDiscountCode}
                style={{ marginLeft: 10 }}
              >
                Удалить промокод
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleApplyDiscountCode}
                disabled={discountApplied}
              >
                Применить промокод
              </Button>
            )}
          </div>

          <div className={styles.totalPrice}>
            <span>{`Скидка: ${totalPrice.Discount} ₽`}</span>
            <span>{`К оплате: ${
              totalPrice.Total - totalPrice.Discount
            } ₽`}</span>

            <div className={styles.buttons}>
              <Link to="/" className={styles.hiddenLink}>
                <Button>Продолжить покупки</Button>
              </Link>
              <Button type="primary">Оформить заказ</Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

Cart.propTypes = {
  userGuid: PropTypes.string.isRequired,
};

export default Cart;
