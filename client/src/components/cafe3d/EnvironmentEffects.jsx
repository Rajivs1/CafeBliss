import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const EnvironmentEffects = ({ scrollProgress }) => {
  return (
    <group>
      {/* Dust Particles in Sunlight */}
      <DustParticles />
      
      {/* Light Rays through Windows */}
      <LightRays />
      
      {/* Ambient Cafe Atmosphere */}
      <CafeAtmosphere scrollProgress={scrollProgress} />
    </group>
  );
};

// Floating Dust Particles - More realistic distribution
const DustParticles = () => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Concentrate particles where light enters (near windows and doors)
      const inLightBeam = Math.random() < 0.6;
      
      if (inLightBeam) {
        // Near windows and entrance
        positions[i * 3] = (Math.random() - 0.5) * 6; // x - concentrated
        positions[i * 3 + 1] = Math.random() * 3.5 + 0.5; // y
        positions[i * 3 + 2] = Math.random() * 8 + 2; // z - forward area
      } else {
        // Scattered throughout
        positions[i * 3] = (Math.random() - 0.5) * 10; // x
        positions[i * 3 + 1] = Math.random() * 4 + 0.5; // y
        positions[i * 3 + 2] = Math.random() * 12 - 2; // z
      }
      
      // Each particle has slightly different drift velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.0001;
      velocities[i * 3 + 1] = Math.random() * 0.00005 + 0.00002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0001;
    }
    
    return { positions, velocities };
  }, []);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const particleIndex = i / 3;
      
      // Gentle floating motion - Brownian-like movement
      const brownianX = Math.sin(time * 0.3 + particleIndex * 0.1) * 0.0004;
      const brownianZ = Math.sin(time * 0.25 + particleIndex * 0.15 + 2) * 0.0003;
      
      // Rising air currents (convection)
      const thermalRise = Math.sin(time * 0.1 + particleIndex * 0.05) * 0.00015;
      
      // Drift from air circulation
      positions[i] += particles.velocities[i] + brownianX;
      positions[i + 1] += particles.velocities[i + 1] + thermalRise;
      positions[i + 2] += particles.velocities[i + 2] + brownianZ;
      
      // Reset particles that float too high
      if (positions[i + 1] > 5) {
        positions[i + 1] = 0.5;
      }
      
      // Reset particles that drift out of bounds
      if (Math.abs(positions[i]) > 12) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
      if (Math.abs(positions[i + 2]) > 10) {
        positions[i + 2] = Math.random() * 12 - 2;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#ffffff"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Light Rays through Windows
const LightRays = () => {
  return (
    <group>
      {/* Left Window Light Rays */}
      <LightRay
        position={[-2.5, 3, 5]}
        rotation={[Math.PI / 3, 0, -Math.PI / 8]}
        scale={[1, 3, 0.5]}
      />
      
      {/* Right Window Light Rays */}
      <LightRay
        position={[2.5, 3, 5]}
        rotation={[Math.PI / 3, 0, Math.PI / 8]}
        scale={[1, 3, 0.5]}
      />
      
      {/* Side Window Rays */}
      <LightRay
        position={[-5.8, 2.5, 2]}
        rotation={[Math.PI / 4, Math.PI / 2, 0]}
        scale={[0.8, 2.5, 0.4]}
      />
      
      <LightRay
        position={[5.8, 2.5, 2]}
        rotation={[Math.PI / 4, -Math.PI / 2, 0]}
        scale={[0.8, 2.5, 0.4]}
      />
    </group>
  );
};

// Individual Light Ray
const LightRay = ({ position, rotation, scale }) => {
  const rayRef = useRef();
  
  useFrame(({ clock }) => {
    if (!rayRef.current) return;
    
    // Subtle pulsing of light rays
    const pulse = Math.sin(clock.getElapsedTime() * 0.5) * 0.05 + 0.95;
    rayRef.current.material.opacity = 0.08 * pulse;
  });

  return (
    <mesh ref={rayRef} position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[0.8, 4, 8, 1, true]} />
      <meshBasicMaterial
        color="#fff5e6"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

// Cafe Atmosphere (subtle sparkles and effects)
const CafeAtmosphere = ({ scrollProgress }) => {
  // Show different effects based on scroll position
  const showInteriorEffects = scrollProgress > 0.3;

  return (
    <group>
      {/* Subtle sparkles near windows */}
      <Sparkles
        count={30}
        scale={[8, 4, 3]}
        size={2}
        speed={0.3}
        opacity={0.3}
        color="#fff5e6"
        position={[0, 2, 4]}
      />
      
      {/* Interior ambiance sparkles */}
      {showInteriorEffects && (
        <>
          <Sparkles
            count={20}
            scale={[10, 4, 10]}
            size={1.5}
            speed={0.2}
            opacity={0.2}
            color="#ffd700"
            position={[0, 2, -2]}
          />
          
          {/* Counter area sparkles (espresso machine area) */}
          <Sparkles
            count={15}
            scale={[2, 2, 2]}
            size={1}
            speed={0.4}
            opacity={0.4}
            color="#ffffff"
            position={[-3.5, 1.5, -2]}
          />
        </>
      )}
      
      {/* Volumetric fog effect */}
      <VolumetricFog />
    </group>
  );
};

// Volumetric Fog for Depth
const VolumetricFog = () => {
  const fogRef = useRef();
  
  useFrame(({ clock }) => {
    if (!fogRef.current) return;
    
    // Gentle fog movement
    const time = clock.getElapsedTime();
    fogRef.current.rotation.y = time * 0.05;
  });

  return (
    <group ref={fogRef}>
      {/* Multiple layers of fog for depth */}
      {[0, 1, 2, 3].map((layer) => (
        <mesh
          key={layer}
          position={[0, 1 + layer * 0.5, -4 - layer * 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[15, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.02 - layer * 0.003}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default EnvironmentEffects;
