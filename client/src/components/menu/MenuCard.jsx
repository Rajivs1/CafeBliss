import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './MenuCard.css';

const MenuCard = ({ item, onAddToCart, index = 0 }) => {
  const cardRef = useRef();

  useEffect(() => {
    // Staggered animation on mount
    gsap.fromTo(cardRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.2)'
      }
    );
  }, [index]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.03,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div 
      className="menu-card-restaurant" 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="menu-card-image-wrapper">
        <img 
          src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={item.name}
          className="menu-card-image-restaurant"
        />
        <div className="menu-card-overlay"></div>
        {!item.available && (
          <div className="sold-out-badge">Sold Out</div>
        )}
      </div>
      
      <div className="menu-card-content-restaurant">
        <div className="menu-card-header">
          <h3 className="menu-card-name">{item.name}</h3>
          <span className="menu-card-price-restaurant">₹{item.price}</span>
        </div>
        
        <div className="menu-card-divider"></div>
        
        <p className="menu-card-category-restaurant">
          <span className="category-icon">◆</span>
          {item.category}
        </p>
        
        <p className="menu-card-description-restaurant">{item.description}</p>
        
        <div className="menu-card-footer-restaurant">
          {item.available ? (
            <button 
              onClick={() => onAddToCart(item)}
              className="btn-add-cart-restaurant"
            >
              <span className="btn-icon">+</span>
              <span>Add to Cart</span>
            </button>
          ) : (
            <button className="btn-unavailable" disabled>
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
