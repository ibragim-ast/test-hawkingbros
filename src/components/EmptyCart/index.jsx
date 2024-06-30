import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div>
      <h1>Ваша корзина покупок пока пуста</h1>
      <Link to={"/"}>Перейти на главную страницу</Link>
    </div>
  );
};

export default EmptyCart;
