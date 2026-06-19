import MenuCard from './MenuCard';
import './MenuList.css';

const MenuList = ({ items, onAddToCart }) => {
  if (!items || items.length === 0) {
    return <div className="no-items-found">No menu items found</div>;
  }

  return (
    <div className="menu-list-restaurant">
      {items.map((item, index) => (
        <MenuCard 
          key={item._id} 
          item={item} 
          onAddToCart={onAddToCart}
          index={index}
        />
      ))}
    </div>
  );
};

export default MenuList;
