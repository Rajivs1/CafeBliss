const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p className="cart-item-price">${item.price}</p>
      </div>
      <div className="cart-item-actions">
        <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>+</button>
      </div>
      <button onClick={() => onRemove(item._id)} className="btn-remove">Remove</button>
    </div>
  );
};

export default CartItem;
