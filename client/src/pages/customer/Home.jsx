import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

// ── Reliable coffee images (Pexels CDN — no CORS, no hotlink block) ───────────
const IMGS = {
  story:      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  cappuccino: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
  latte:      'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=600',
  chai:       'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=600',
  croissant:  'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600',
  g1:         'https://images.pexels.com/photos/1955030/pexels-photo-1955030.jpeg?auto=compress&cs=tinysrgb&w=600',
  g2:         'https://images.pexels.com/photos/539432/pexels-photo-539432.jpeg?auto=compress&cs=tinysrgb&w=600',
  g3:         'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600',
  g4:         'https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?auto=compress&cs=tinysrgb&w=600',
  g5:         'https://images.pexels.com/photos/373639/pexels-photo-373639.jpeg?auto=compress&cs=tinysrgb&w=600',
  g6:         'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=600',
  g7:         'https://images.pexels.com/photos/374912/pexels-photo-374912.jpeg?auto=compress&cs=tinysrgb&w=600',
  g8:         'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
  cta:        'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=1400',
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ─── 1. Silk Particle Field ───────────────────────────────────────────────────
const SilkParticles = () => {
  const ref = useRef();
  const COUNT = 1800;
  const { pos, col } = useMemo(() => {
    const rng = seeded(42);
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const gold  = new THREE.Color('#D4A574');
    const cream = new THREE.Color('#F5E6D3');
    const amber = new THREE.Color('#b8731a');
    for (let i = 0; i < COUNT; i++) {
      const r = 12 + rng() * 20;
      const theta = rng() * Math.PI * 2;
      const phi   = (rng() - 0.5) * Math.PI;
      pos[i*3]   = Math.cos(theta) * Math.cos(phi) * r;
      pos[i*3+1] = Math.sin(phi) * r * 0.55;
      pos[i*3+2] = Math.sin(theta) * Math.cos(phi) * r - 18;
      const c = rng() < 0.5 ? gold : (rng() < 0.5 ? cream : amber);
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    return { pos, col };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.018;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.009) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={pos} itemSize={3}/>
        <bufferAttribute attach="attributes-color"    count={COUNT} array={col} itemSize={3}/>
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.85}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/>
    </points>
  );
};

// ─── 2. Golden Torus Ring ─────────────────────────────────────────────────────
const GoldenRing = ({ pos, phase = 0, size = 2.2 }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.18 + phase;
    ref.current.rotation.y = t * 0.11 + phase * 0.7;
    ref.current.material.emissiveIntensity = 0.35 + Math.sin(t * 1.4 + phase) * 0.2;
  });
  return (
    <mesh ref={ref} position={pos}>
      <torusGeometry args={[size, size * 0.055, 20, 90]}/>
      <meshStandardMaterial color="#D4A574" emissive="#a86820"
        emissiveIntensity={0.4} roughness={0.12} metalness={0.85}/>
    </mesh>
  );
};

// ─── 3. Floating Glowing Orbs (replaces dark beans) ──────────────────────────
const CoffeeBeans = () => {
  const beans = useMemo(() => {
    const rng = seeded(77);
    return Array.from({ length: 18 }, () => ({
      pos: [(rng()-0.5)*28, (rng()-0.5)*12+1, -10 - rng()*18],
      speed: 0.4 + rng() * 0.9,
      phase: rng() * Math.PI * 2,
      scale: 0.06 + rng() * 0.14,
      color: `hsl(${28 + rng()*18}, ${65 + rng()*25}%, ${42 + rng()*22}%)`,
    }));
  }, []);
  return (
    <>
      {beans.map((b, i) => (
        <Float key={i} speed={b.speed} floatIntensity={1.4} rotationIntensity={0.3}>
          <mesh position={b.pos} scale={b.scale}>
            <sphereGeometry args={[1, 16, 16]}/>
            <meshStandardMaterial
              color={b.color} emissive={b.color}
              emissiveIntensity={0.65} roughness={0.15} metalness={0.3}
              transparent opacity={0.72}/>
          </mesh>
        </Float>
      ))}
    </>
  );
};

// ─── 4. Steam Wisps ──────────────────────────────────────────────────────────
const SteamWisps = () => {
  const ref = useRef();
  const COUNT = 180;
  const { pos } = useMemo(() => {
    const rng = seeded(13);
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (rng()-0.5) * 3;
      pos[i*3+1] = rng() * 6 - 1;
      pos[i*3+2] = (rng()-0.5) * 3 - 2;
    }
    return { pos };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t  = clock.getElapsedTime();
    const a  = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      a[i*3]   += Math.sin(t * 0.4 + i * 0.3) * 0.003;
      a[i*3+1] += 0.006;
      if (a[i*3+1] > 5) { a[i*3+1] = -1; a[i*3] = (Math.random()-0.5)*3; }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[3.5, 0, -4]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={pos} itemSize={3}/>
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#fff5e6" transparent opacity={0.28}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/>
    </points>
  );
};

// ─── 5. Liquid Silk Wave — subtle, far back, very faint ──────────────────────
const SilkWave = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t  = clock.getElapsedTime();
    const pa = ref.current.geometry.attributes.position.array;
    const W  = 40, H = 40;
    for (let i = 0; i <= W; i++) {
      for (let j = 0; j <= H; j++) {
        const idx = (i * (H+1) + j) * 3;
        const x   = pa[idx], y = pa[idx+1];
        pa[idx+2] = Math.sin(x*0.12 + t*0.3) * 1.1
                  + Math.cos(y*0.1  + t*0.25) * 0.9
                  + Math.sin((x+y)*0.06 + t*0.4) * 0.5;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.geometry.computeVertexNormals();
  });
  return (
    <mesh ref={ref} position={[0, -9, -38]} rotation={[-0.22, 0, 0]}>
      <planeGeometry args={[70, 50, 40, 40]}/>
      <meshStandardMaterial color="#b8731a" wireframe transparent opacity={0.028}
        side={THREE.DoubleSide}/>
    </mesh>
  );
};

// ─── 6. Glass Espresso Cup (glassmorphism look) ───────────────────────────────
const HeroCup = () => {
  const g = useRef();
  const rimGlowRef = useRef();
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.getElapsedTime();
    g.current.rotation.y = t * 0.22;
    g.current.position.y = Math.sin(t * 0.55) * 0.3;
    if (rimGlowRef.current)
      rimGlowRef.current.intensity = 1.2 + Math.sin(t * 1.6) * 0.5;
  });

  return (
    <Float speed={0.9} floatIntensity={0.5} rotationIntensity={0.08}>
      <group ref={g} position={[4.2, 0.5, -5.5]} scale={1.3}>

        {/* ── outer glass body (wide cylinder, thin walls) ── */}
        <mesh castShadow>
          <cylinderGeometry args={[0.68, 0.56, 1.6, 48, 1, true]}/>
          <meshPhysicalMaterial
            color="#c8e8f0" transparent opacity={0.18}
            roughness={0.04} metalness={0} transmission={0.88}
            thickness={0.3} ior={1.45}
            side={THREE.DoubleSide}/>
        </mesh>

        {/* ── inner glass wall highlight ── */}
        <mesh>
          <cylinderGeometry args={[0.63, 0.52, 1.55, 48, 1, true]}/>
          <meshPhysicalMaterial
            color="#e8f4ff" transparent opacity={0.08}
            roughness={0.02} metalness={0} transmission={0.92}
            side={THREE.BackSide}/>
        </mesh>

        {/* ── glass bottom disc ── */}
        <mesh position={[0, -0.8, 0]}>
          <circleGeometry args={[0.56, 48]}/>
          <meshPhysicalMaterial
            color="#c8e8f0" transparent opacity={0.22}
            roughness={0.04} transmission={0.85} thickness={0.4}/>
        </mesh>

        {/* ── espresso liquid surface ── */}
        <mesh position={[0, 0.52, 0]}>
          <circleGeometry args={[0.6, 48]}/>
          <meshStandardMaterial
            color="#2a0e04" roughness={0.02}
            emissive="#7a3c12" emissiveIntensity={0.6}
            metalness={0.1}/>
        </mesh>

        {/* ── crema ring on top ── */}
        <mesh position={[0, 0.53, 0]}>
          <ringGeometry args={[0.3, 0.58, 48]}/>
          <meshStandardMaterial
            color="#c8761a" roughness={0.05}
            emissive="#d4840a" emissiveIntensity={0.35}/>
        </mesh>

        {/* ── gold rim top ── */}
        <mesh ref={rimGlowRef} position={[0, 0.81, 0]}>
          <torusGeometry args={[0.68, 0.032, 16, 64]}/>
          <meshStandardMaterial
            color="#D4A574" emissive="#c87010"
            emissiveIntensity={1.2} roughness={0.08} metalness={0.95}/>
        </mesh>

        {/* ── gold base ring ── */}
        <mesh position={[0, -0.81, 0]}>
          <torusGeometry args={[0.57, 0.028, 12, 48]}/>
          <meshStandardMaterial
            color="#D4A574" roughness={0.15} metalness={0.9}
            emissive="#a86010" emissiveIntensity={0.4}/>
        </mesh>

        {/* ── glass handle ── */}
        <mesh position={[0.88, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.32, 0.038, 10, 32, Math.PI * 1.1]}/>
          <meshPhysicalMaterial
            color="#d0eef8" transparent opacity={0.35}
            roughness={0.05} transmission={0.7} thickness={0.2}/>
        </mesh>

        {/* ── saucer ── */}
        <mesh position={[0, -0.88, 0]}>
          <cylinderGeometry args={[1.0, 0.95, 0.09, 48]}/>
          <meshPhysicalMaterial
            color="#c8e0ec" transparent opacity={0.25}
            roughness={0.06} metalness={0} transmission={0.8}/>
        </mesh>
        <mesh position={[0, -0.84, 0]}>
          <torusGeometry args={[0.97, 0.018, 8, 48]}/>
          <meshStandardMaterial color="#D4A574" roughness={0.15} metalness={0.9}
            emissive="#a86010" emissiveIntensity={0.3}/>
        </mesh>

        {/* ── inner glow light ── */}
        <pointLight position={[0, 0.3, 0]} intensity={1.2} distance={3} color="#ff8c2a" decay={2}/>
      </group>
    </Float>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const HomeScene = () => (
  <>
    <color attach="background" args={['#0c0906']}/>
    <fog attach="fog" args={['#0c0906', 18, 60]}/>
    <ambientLight intensity={0.35} color="#f0dcc4"/>
    <pointLight position={[10, 10, 5]}  intensity={1.5} color="#D4A574"/>
    <pointLight position={[-9, 8, -8]}  intensity={0.9} color="#8B6F47"/>
    <pointLight position={[0, 16, -20]} intensity={1.2} color="#F5E6D3"/>
    <spotLight   position={[0, 22, 8]}  angle={0.4} penumbra={1} intensity={1.1} color="#ffe8c4" castShadow/>
    {/* extra warm fill from right for the glass cup */}
    <pointLight position={[8, 4, -4]}   intensity={2.0} color="#ff9040" distance={14}/>
    <SilkParticles/>
    <GoldenRing pos={[-5.5, 1.2, -12]} phase={0}    size={2.4}/>
    <GoldenRing pos={[ 7,   -1,  -18]} phase={2.1}  size={1.6}/>
    <GoldenRing pos={[ 0,    3,  -30]} phase={4.4}  size={3.2}/>
    <HeroCup/>
    <CoffeeBeans/>
    <SteamWisps/>
    <SilkWave/>
  </>
);

// ─── Intersection-observer reveal hook ────────────────────────────────────────
function useReveal(selector) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [selector]);
}

// ─── Stagger children on reveal ──────────────────────────────────────────────
function useStagger(parentSelector, childSelector, delay = 120) {
  useEffect(() => {
    const parents = document.querySelectorAll(parentSelector);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const children = e.target.querySelectorAll(childSelector);
          children.forEach((c, i) => {
            setTimeout(() => c.classList.add('revealed'), i * delay);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    parents.forEach(p => obs.observe(p));
    return () => obs.disconnect();
  }, [parentSelector, childSelector, delay]);
}

// ─── GSAP cursor glow ────────────────────────────────────────────────────────
function useCursorGlow() {
  useEffect(() => {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    const move = (e) => {
      gsap.to(glow, {
        x: e.clientX - 150,
        y: e.clientY - 150,
        duration: 0.9,
        ease: 'power3.out',
      });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
}

// ─── GSAP hero text stagger on mount ─────────────────────────────────────────
function useHeroEntrance() {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.hero-eyebrow', { opacity: 0, y: 24, filter: 'blur(8px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' })
      .fromTo('.hero-main-title', { opacity: 0, y: 48, filter: 'blur(10px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-italic',     { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')
      .fromTo('.hero-ornament',   { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.4')
      .fromTo('.hero-desc',       { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .fromTo('.hero-cta-group',  { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
  }, []);
}

// ─── Card 3D tilt on hover ────────────────────────────────────────────────────
function useCardTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll('.menu-card');
    const handlers = [];
    cards.forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -14;
        const ry = ((x / r.width)  - 0.5) *  14;
        gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.3, ease: 'power2.out', transformPerspective: 900 });
        // move shine with mouse
        const shine = card.querySelector('.card-glass-shine');
        if (shine) gsap.to(shine, { x: x * 0.4, y: y * 0.4, opacity: 0.55, duration: 0.3 });
      };
      const onLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
        const shine = card.querySelector('.card-glass-shine');
        if (shine) gsap.to(shine, { x: 0, y: 0, opacity: 0, duration: 0.4 });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push({ card, onMove, onLeave });
    });
    return () => handlers.forEach(({ card, onMove, onLeave }) => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    });
  }, []);
}

// ─── Main Home Component ──────────────────────────────────────────────────────
const Home = () => {
  useReveal('.reveal');
  useStagger('.stagger-parent', '.stagger-child', 130);
  useCursorGlow();
  useHeroEntrance();
  useCardTilt();

  // Parallax on scroll for hero
  useEffect(() => {
    const hero = document.querySelector('.hero-text-wrap');
    const onScroll = () => {
      if (!hero) return;
      const y = window.scrollY;
      hero.style.transform = `translateY(${y * 0.38}px)`;
      hero.style.opacity   = Math.max(0, 1 - y / 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home-root">
      {/* Cursor glow */}
      <div className="cursor-glow"/>

      {/* Fixed 3D canvas */}
      <div className="canvas-bg">
        <Canvas
          camera={{ position: [0, 1.5, 14], fov: 62 }}
          gl={{
            antialias: true, alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.3,
          }}
        >
          <Suspense fallback={null}>
            <HomeScene/>
          </Suspense>
        </Canvas>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-text-wrap">
          <p  className="hero-eyebrow">Est. 2024 &nbsp;·&nbsp; Artisanal Coffee</p>
          <h1 className="hero-main-title">Café&nbsp;Bliss</h1>
          <p  className="hero-italic">Where moments become memories</p>
          <div className="hero-ornament"/>
          <p  className="hero-desc">Artisanal coffee&nbsp;·&nbsp;Fresh pastries&nbsp;·&nbsp;Warm ambiance</p>
          <div className="hero-cta-group">
            <Link to="/menu"         className="btn-gold">Explore Menu</Link>
            <Link to="/reservations" className="btn-ghost">Reserve a Table</Link>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span/><p>Scroll</p>
        </div>
      </section>

      {/* ── SPLINE 3D ACCENT (between hero and story) ─────────────── */}
      <div className="spline-divider">
        <div className="spline-wrap">
          <iframe
            src="https://my.spline.design/coffeecupinteractive-lQTeTlnJjp3kRQHCXQCK/"
            title="Spline 3D Coffee Scene"
            className="spline-frame"
            allow="autoplay"
            loading="lazy"
          />
          <div className="spline-overlay-top"/>
          <div className="spline-overlay-bottom"/>
        </div>
      </div>

      {/* ── STORY ────────────────────────────────────────────────────── */}
      <section className="story-section">
        <div className="story-inner">
          <div className="story-img-wrap reveal">
            {/* layered images for depth effect */}
            <div className="story-img-stack">
              <img className="story-img-back" src={IMGS.g1} alt="Cafe atmosphere"/>
              <img className="story-img-front" src={IMGS.story} alt="Coffee craft"/>
            </div>
            <div className="story-img-glow"/>
            <div className="story-img-overlay"/>
            {/* floating glass badge */}
            <div className="story-badge">
              <span className="badge-number">12+</span>
              <span className="badge-label">Years of Craft</span>
            </div>
          </div>
          <div className="story-copy">
            <p  className="section-label reveal">Our Story</p>
            <h2 className="section-heading reveal">Crafted with<br/><em>Passion</em></h2>
            <div className="ornament-line reveal"/>
            <p  className="section-body reveal">
              Every cup tells a story. Our expert baristas source the finest beans from
              sustainable farms across Ethiopia, Colombia and Sumatra — roasted in‑house
              to bring you an unforgettable sensory experience.
            </p>
            <p  className="section-body reveal" style={{ marginTop: '1rem' }}>
              We believe great coffee is a craft, not a commodity. Every detail,
              from bean selection to the final pour, is handled with deliberate care.
            </p>
            <Link to="/menu" className="btn-text-link reveal">
              Discover the Menu <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE MENU ───────────────────────────────────────────── */}
      <section className="menu-section">
        <div className="menu-header reveal">
          <p  className="section-label">Signature Selection</p>
          <h2 className="section-heading">Sip &amp; Savour</h2>
          <div className="ornament-line"/>
        </div>
        <div className="menu-grid stagger-parent">
          {[
            { img: IMGS.cappuccino, name: 'Classic Cappuccino', desc: 'Rich double-shot espresso crowned with velvety steamed milk foam', price: '₹150', tag: 'Bestseller' },
            { img: IMGS.latte,      name: 'Signature Latte',    desc: 'Smooth espresso with artful rosette latte art — Instagram worthy',  price: '₹180', tag: 'Signature'  },
            { img: IMGS.chai,       name: 'Chai Latte',         desc: 'Aromatic spiced masala chai blended with steamed oat milk',          price: '₹110', tag: 'Popular'   },
            { img: IMGS.croissant,  name: 'Fresh Croissant',    desc: 'Buttery, impossibly flaky — baked fresh each morning at 6 AM',       price: '₹120', tag: 'Fresh Daily'},
          ].map(({ img, name, desc, price, tag }) => (
            <div className="menu-card stagger-child" key={name}>
              {/* glass shimmer layer */}
              <div className="card-glass-shine"/>
              <div className="menu-card-img">
                <img src={img} alt={name}/>
                {/* colour-grade overlay on image */}
                <div className="img-grade"/>
                <span className="card-tag">{tag}</span>
              </div>
              <div className="menu-card-body">
                <h4>{name}</h4>
                <p>{desc}</p>
                <div className="card-footer">
                  <span className="card-price">{price}</span>
                  <Link to="/menu" className="card-order-btn">Order →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE PILLARS ───────────────────────────────────────── */}
      <section className="pillars-section">
        <div className="pillars-header reveal">
          <p  className="section-label">The Experience</p>
          <h2 className="section-heading">Why Café Bliss</h2>
          <div className="ornament-line"/>
        </div>
        <div className="pillars-grid stagger-parent">
          {[
            { icon: '☕', title: 'Artisanal Roasts',   body: 'Small-batch, in-house roasting preserving the unique terroir of every origin.' },
            { icon: '🌿', title: 'Sustainably Sourced', body: 'Direct trade partnerships with farms that prioritise people and the planet.' },
            { icon: '✦',  title: 'Expert Baristas',    body: 'SCA-certified team trained in the science and art of exceptional coffee.' },
            { icon: '🕯️', title: 'Cosy Ambiance',      body: 'Warm lighting, plush seating and curated music — your second living room.' },
          ].map(({ icon, title, body }) => (
            <div className="pillar-card stagger-child" key={title}>
              <span className="pillar-icon">{icon}</span>
              <h3 className="pillar-title">{title}</h3>
              <p  className="pillar-body">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY STRIP ────────── */}
      <section className="gallery-section reveal">
        <div className="gallery-track">
          {[IMGS.g1,IMGS.g2,IMGS.g3,IMGS.g4,IMGS.g5,IMGS.g6,IMGS.g7,IMGS.g8,
            IMGS.g1,IMGS.g2,IMGS.g3,IMGS.g4,IMGS.g5,IMGS.g6,IMGS.g7,IMGS.g8,
          ].map((src, i) => (
            <div className="gallery-frame" key={i}>
              <img src={src} alt={`gallery-${i}`} loading="lazy"/>
              <div className="gallery-frame-grade"/>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────────── */}
      <section className="stats-section stagger-parent">
        {[
          { value: '50+',    label: 'Coffee Origins'     },
          { value: '1,200+', label: 'Happy Guests Daily' },
          { value: '8',      label: 'Awards Won'         },
          { value: '5★',     label: 'Average Rating'     },
        ].map(({ value, label }) => (
          <div className="stat-item stagger-child" key={label}>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-bg-img">
          <img src={IMGS.cta} alt="Café interior"/>
        </div>
        <div className="cta-overlay reveal">
          <p  className="section-label" style={{ color: '#D4A574' }}>Come Visit</p>
          <h2 className="cta-heading">Your Table Awaits</h2>
          <div className="ornament-line" style={{ margin: '1.5rem auto 2rem' }}/>
          <p  className="cta-sub">
            Experience the perfect blend of flavour, warmth and community
          </p>
          <div className="cta-btn-row">
            <Link to="/menu"         className="btn-gold large">View Full Menu</Link>
            <Link to="/reservations" className="btn-ghost large">Reserve a Table</Link>
          </div>
          <div className="cta-info">
            <span>Open Daily: 7:00 AM – 10:00 PM</span>
            <span className="dot-sep">·</span>
            <span>123 Coffee Street, Downtown</span>
          </div>
        </div>
      </section>

      {/* ── SCROLL PROGRESS ──────────────────────────────────────────── */}
      <ProgressBar/>
    </div>
  );
};

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = () => {
  const barRef = useRef();
  useEffect(() => {
    const update = () => {
      const top = window.scrollY;
      const h   = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.width = `${h > 0 ? (top / h) * 100 : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="progress-rail">
      <div ref={barRef} className="progress-fill"/>
    </div>
  );
};

export default Home;
