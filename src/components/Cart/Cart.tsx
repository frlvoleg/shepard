import s from './Cart.module.scss';

const Cart = ({ stepType }: { stepType: string }) => {
  return (
    <div className={s.side_cart}>
      <h2>Shopping cart</h2>
      <ul className={s.side_cart__list}>
        <li>
          <span>Subtotal</span>
          <span>$15,000.00</span>
        </li>
        <li>
          <span>Tax</span>
          <span>TBD</span>
        </li>
        <li>
          <span>Promotions</span>
          <span>$0</span>
        </li>
      </ul>
    </div>
  );
};

export default Cart;
