import React from "react";
import PropTypes from "prop-types";
import { Button, Menu } from "antd";
import {
  ShopOutlined,
  MailOutlined,
  ProductOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ logoImg, userName }) => {
  const [current, setCurrent] = React.useState("main");

  const navItems = [
    {
      key: "main",
      label: <Link to="/">Главная</Link>,
      icon: <HomeOutlined />,
    },
    {
      label: "О компании",
      key: "about",
      icon: <ShopOutlined />,
    },
    {
      label: "Категории",
      key: "SubMenu",
      icon: <ProductOutlined />,
      children: [
        {
          label: "Категория 1",
        },
        {
          label: "Категория 2",
        },
      ],
    },
    {
      label: "Контакты",
      key: "contacts",
      icon: <MailOutlined />,
    },
    {
      key: "cart",
      label: <Link to="/cart">Корзина</Link>,
      icon: <ShoppingCartOutlined />,
    },
  ];

  const shortenFullName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length < 3) {
      return fullName;
    }
    const lastName = parts[0];
    const firstNameInitial = parts[1].charAt(0);
    const middleNameInitial = parts[2].charAt(0);
    return `${lastName} ${firstNameInitial}. ${middleNameInitial}.`;
  };

  const shortenedName = shortenFullName(userName);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img
          className={styles.logo}
          src={`data:image/png;base64, ${logoImg}`}
          alt="Logo"
        />
        <div className={styles.userInfo}>
          <span>{shortenedName}</span>
          <Button className="button" type="primary">
            Выйти
          </Button>
        </div>
      </div>

      <Menu
        className={styles.menu}
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={navItems}
      />
    </header>
  );
};

Header.propTypes = {
  logoImg: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default Header;
