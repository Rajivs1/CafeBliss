import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CafeLighting = ({ scrollProgress }) => {
  const ambientRef = useRef();
  const sunLightRef = useRef();
  const fillLightRef = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Subtle ambient light intensity change as we enter - mimics eye adjustment
    if (ambientRef.current) {
      const baseIntensity = THREE.MathUtils.lerp(0.25, 0.42, Math.min(scrollProgress * 2, 1));
      // Very subtle variation like clouds passing
      const cloudPass = Math.sin(time * 0.08) * 0.02;
      ambientRef.current.intensity = baseIntensity + cloudPass;
    }
    
    // Natural sunlight variation - not perfectly constant
    if (sunLightRef.current) {
      const sunFlicker = Math.sin(time * 0.12 + 1.5) * 0.015 +
                        Math.sin(time * 0.05 + 3) * 0.01;
      sunLightRef.current.intensity = 0.95 + sunFlicker;
    }
    
    // Fill light subtle variation
    if (fillLightRef.current) {
      const fillVar = Math.sin(time * 0.09) * 0.01;
      fillLightRef.current.intensity = 0.35 + fillVar;
    }
  });

  return (
    <group>
      {/* Ambient Light - soft indirect bounce */}
      <ambientLight ref={ambientRef} intensity={0.25} color="#fff5e6" />
      
      {/* Main Directional Light (Natural Daylight from windows) */}
      <directionalLight
        ref={sunLightRef}
        position={[8, 12, 12]}
        intensity={0.95}
        color="#fff8ed" // Warm daylight, not pure white
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.00015}
        shadow-radius={1.5} // Softer shadow edges
      />
      
      {/* Fill Light (Soft shadows / ambient bounce from walls) */}
      <directionalLight
        ref={fillLightRef}
        position={[-6, 7, 6]}
        intensity={0.35}
        color="#c8d8f0" // Slight cool blue bounce from sky
      />
      
      {/* Secondary fill from opposite side - very soft */}
      <directionalLight
        position={[4, 6, -8]}
        intensity={0.18}
        color="#ffeedd"
      />
      
      {/* Pendant Lights Above Tables - warm practical lighting */}
      <PendantLight position={[-3, 2.8, -3]} phase={0} />
      <PendantLight position={[3, 2.8, -3]} phase={1.2} />
      <PendantLight position={[-3, 2.8, -6]} phase={2.7} />
      <PendantLight position={[3, 2.8, -6]} phase={3.9} />
      
      {/* Counter Lighting - Task lighting for work area */}
      <group position={[-3.5, 3, -2]}>
        {/* Overhead counter spotlights */}
        <spotLight
          position={[0, 0, 0]}
          angle={0.65}
          penumbra={0.6} // Softer edges
          intensity={1.2}
          color="#fff5e6"
          castShadow
          target-position={[0, -2, 0]}
          distance={5}
          decay={2}
        />
        <spotLight
          position={[1, 0, 0]}
          angle={0.65}
          penumbra={0.6}
          intensity={1.2}
          color="#fff5e6"
          castShadow
          target-position={[1, -2, 0]}
          distance={5}
          decay={2}
        />
      </group>
      
      {/* Back Wall Accent Light - warm ambiance */}
      <spotLight
        position={[0, 3.5, -8]}
        angle={0.9}
        penumbra={0.75} // Very soft
        intensity={0.6}
        color="#ffead0"
        target-position={[0, 2, -8.5]}
        distance={6}
        decay={2}
      />
      
      {/* Window Light (Natural light from outside - realistic falloff) */}
      <pointLight
        position={[-2.5, 2.5, 5.8]}
        intensity={0.9}
        distance={5.5}
        decay={2}
        color="#fff8ed"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight
        position={[2.5, 2.5, 5.8]}
        intensity={0.9}
        distance={5.5}
        decay={2}
        color="#fff8ed"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      
      {/* Side window subtle fill */}
      <pointLight
        position={[-5.5, 2, 2]}
        intensity={0.4}
        distance={3.5}
        decay={2}
        color="#e8f2ff" // Slight cool from sky
      />
      <pointLight
        position={[5.5, 2, 2]}
        intensity={0.4}
        distance={3.5}
        decay={2}
        color="#e8f2ff"
      />
      
      {/* Entrance Lighting - welcoming */}
      <pointLight
        position={[0, 2.8, 5]}
        intensity={0.65}
        distance={4}
        decay={2}
        color="#ffd19b"
      />
      
      {/* Corner Accent Lights - warm intimate corners */}
      <pointLight
        position={[-5, 2.2, -7]}
        intensity={0.4}
        distance={3.5}
        decay={2}
        color="#ffb380"
      />
      <pointLight
        position={[5, 2.2, -7]}
        intensity={0.4}
        distance={3.5}
        decay={2}
        color="#ffb380"
      />
      
      {/* Menu Board Light - functional task light */}
      <spotLight
        position={[-2.6, 3.5, -1.8]}
        angle={0.5}
        penumbra={0.65}
        intensity={0.85}
        color="#ffffff"
        target-position={[-3, 2.5, -2.3]}
        distance={3}
        decay={2}
      />
      
      {/* Shelf Display Light - subtle product highlighting */}
      <spotLight
        position={[4, 3.2, -7.5]}
        angle={0.7}
        penumbra={0.6}
        intensity={0.65}
        color="#fff5e6"
        target-position={[4, 1.5, -8.5]}
        distance={4}
        decay={2}
      />
      
      {/* Under-counter ambient glow - realistic reflected light */}
      <pointLight
        position={[-3.5, 0.6, -1.5]}
        intensity={0.15}
        distance={2}
        decay={2}
        color="#ffd19b"
      />
    </group>
  );
};

// Pendant Light Component (visible fixture + light source) - Each unique
const PendantLight = ({ position, phase = 0 }) => {
  const lightRef = useRef();
  const shadeRef = useRef();
  const bulbRef = useRef();
  
  // Each light has slightly different character
  const lightPersonality = useRef({
    flickerRate: 9.5 + Math.random() * 1.5,
    flickerAmount: 0.015 + Math.random() * 0.015,
    swayRate: 0.6 + Math.random() * 0.3,
    swayAmount: 0.008 + Math.random() * 0.008
  }).current;
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() + phase;
    
    // Realistic bulb flicker - electrical imperfections, not constant
    if (lightRef.current && bulbRef.current) {
      const flicker = 1 + Math.sin(time * lightPersonality.flickerRate) * lightPersonality.flickerAmount +
                     Math.sin(time * lightPersonality.flickerRate * 0.7 + 1.3) * (lightPersonality.flickerAmount * 0.6);
      lightRef.current.intensity = 1.5 * flicker;
      
      // Bulb emissive also flickers
      bulbRef.current.material.emissiveIntensity = 1.3 * flicker;
    }
    
    // Very subtle swaying from air movement/vibration
    if (shadeRef.current) {
      const swayX = Math.sin(time * lightPersonality.swayRate + phase) * lightPersonality.swayAmount;
      const swayZ = Math.sin(time * lightPersonality.swayRate * 0.8 + phase + 1.5) * lightPersonality.swayAmount * 0.7;
      const twist = Math.sin(time * lightPersonality.swayRate * 0.5 + phase + 2) * 0.004;
      
      shadeRef.current.rotation.x = swayX;
      shadeRef.current.rotation.z = swayZ;
      shadeRef.current.rotation.y = twist;
    }
  });

  return (
    <group position={position}>
      {/* Ceiling Mount */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.35}
          metalness={0.65}
        />
      </mesh>
      
      {/* Wire/Cable */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.6, 12]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.65}
          metalness={0.35}
        />
      </mesh>
      
      {/* Light Shade - with ref for animation */}
      <group ref={shadeRef} position={[0, -0.65, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.25, 24, 1, true]} />
          <meshStandardMaterial
            color="#1a1410"
            roughness={0.45}
            metalness={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Light Bulb (visible) - with ref for flicker */}
        <mesh ref={bulbRef} position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#fff5e6"
            emissive="#fff5e6"
            emissiveIntensity={1.3}
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>
        
        {/* Point Light Source */}
        <pointLight
          ref={lightRef}
          position={[0, -0.05, 0]}
          intensity={1.5}
          distance={3.5}
          decay={2}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-bias={-0.0015}
          shadow-radius={1.2}
        />
        
        {/* Subtle glow effect */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color="#fff5e6"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

export default CafeLighting;
