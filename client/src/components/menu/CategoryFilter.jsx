import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const filterRef = useRef();

  useEffect(() => {
    if (filterRef.current) {
      gsap.from(filterRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)'
      });
    }
  }, []);

  return (
    <div className="category-filter-restaurant" ref={filterRef}>
      <button
        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        <span className="btn-text">All</span>
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          <span className="btn-text">{category}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
