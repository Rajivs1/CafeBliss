import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import MenuList from '../../components/menu/MenuList';
import CategoryFilter from '../../components/menu/CategoryFilter';
import Loader from '../../components/common/Loader';
import { menuService } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import './Menu.css';

// Coffee Bean 3D Background
const CoffeeBeansBackground = () => {
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random() * 2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10 - 5
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
          >
            <sphereGeometry args={[0.3 + Math.random() * 0.3, 16, 16]} />
            <meshStandardMaterial
              color="#3d2817"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const Menu = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const menuRef = useRef();
  const headerRef = useRef();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  useEffect(() => {
    if (!loading && headerRef.current) {
      // Animate header on load
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out'
      });
    }
  }, [loading]);

  const fetchMenuItems = async () => {
    try {
      setError(null);
      console.log('Fetching menu items...');
      const data = await menuService.getAllItems();
      console.log('Menu items received:', data);
      
      if (!data || data.length === 0) {
        setError('No menu items available. Please run: npm run seed in the server folder to add sample data.');
      }
      
      setItems(data);
      setFilteredItems(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError(error.response?.data?.message || 'Failed to load menu items. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">✓</span>
        <span>${item.name} added to cart!</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'back.out' }
    );
    
    setTimeout(() => {
      gsap.to(toast, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => toast.remove()
      });
    }, 2000);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="menu-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Menu Not Available</h2>
          <p>{error}</p>
          <button onClick={fetchMenuItems} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page" ref={menuRef}>
      {/* 3D Background Canvas */}
      <div className="menu-canvas-bg">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} color="#D4A574" />
          <CoffeeBeansBackground />
        </Canvas>
      </div>

      {/* Menu Content */}
      <div className="menu-container">
        {/* Header */}
        <header className="menu-header" ref={headerRef}>
          <div className="menu-header-ornament top"></div>
          <h1 className="menu-title">Our Menu</h1>
          <p className="menu-subtitle">Crafted with passion, served with love</p>
          <div className="menu-header-ornament bottom"></div>
        </header>

        {items.length === 0 ? (
          <div className="no-items">
            <p>No menu items available yet.</p>
          </div>
        ) : (
          <>
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <MenuList items={filteredItems} onAddToCart={handleAddToCart} />
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
