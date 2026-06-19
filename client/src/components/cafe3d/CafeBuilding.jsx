import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

const CafeBuilding = ({ scrollProgress }) => {
  const buildingRef = useRef();
  const doorLeftRef = useRef();
  const doorRightRef = useRef();

  // Door animation - opens as user approaches
  useFrame(() => {
    if (doorLeftRef.current && doorRightRef.current) {
      // Doors start opening at 20% scroll and fully open at 35%
      const doorProgress = THREE.MathUtils.clamp((scrollProgress - 0.2) / 0.15, 0, 1);
      const doorAngle = doorProgress * Math.PI / 2.5; // 72 degrees max
      
      doorLeftRef.current.rotation.y = -doorAngle;
      doorRightRef.current.rotation.y = doorAngle;
    }
  });

  return (
    <group ref={buildingRef} position={[0, 0, 0]}>
      {/* Main Building Structure */}
      <BuildingWalls />
      
      {/* Glass Storefront */}
      <StorefrontWindows scrollProgress={scrollProgress} />
      
      {/* Entrance Doors */}
      <group position={[0, 0, 5]}>
        {/* Left Door */}
        <group ref={doorLeftRef} position={[-0.5, 0, 0]}>
          <EntranceDoor side="left" />
        </group>
        
        {/* Right Door */}
        <group ref={doorRightRef} position={[0.5, 0, 0]}>
          <EntranceDoor side="right" />
        </group>
      </group>
      
      {/* Cafe Signage */}
      <CafeSignage />
      
      {/* Exterior Decoration */}
      <ExteriorDecoration />
      
      {/* Pavement and Entry */}
      <Pavement />
    </group>
  );
};

// Building Walls Component with realistic imperfections
const BuildingWalls = () => {
  return (
    <group>
      {/* Main Front Wall */}
      <mesh position={[0, 2.5, 5]} castShadow receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.85} // Slightly rougher - not new construction
          metalness={0.08}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-6, 2.5, -2]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 5, 0.3]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[6, 2.5, -2]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 5, 0.3]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 2.5, -9]} castShadow receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>
      
      {/* Roof - slightly weathered */}
      <mesh position={[0, 5, -2]} receiveShadow>
        <boxGeometry args={[12.6, 0.2, 14.6]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>
    </group>
  );
};

// Storefront Windows with realistic glass behavior
const StorefrontWindows = ({ scrollProgress }) => {
  const leftWindowRef = useRef();
  const rightWindowRef = useRef();
  
  useFrame(({ clock, camera }) => {
    // Subtle reflection changes based on camera position - parallax effect
    if (leftWindowRef.current && rightWindowRef.current) {
      const time = clock.getElapsedTime();
      
      // Very subtle environment map intensity shift with viewing angle
      const cameraAngle = Math.atan2(camera.position.x, camera.position.z);
      const envIntensity = 0.8 + Math.sin(cameraAngle * 2) * 0.15 +
                          Math.sin(time * 0.1) * 0.05; // Subtle cloud movement effect
      
      leftWindowRef.current.material.envMapIntensity = envIntensity;
      rightWindowRef.current.material.envMapIntensity = envIntensity;
    }
  });
  
  return (
    <group position={[0, 2, 5.1]}>
      {/* Large Window Left */}
      <mesh ref={leftWindowRef} position={[-2.5, 0, 0]} castShadow>
        <boxGeometry args={[3, 3.5, 0.05]} />
        <meshPhysicalMaterial
          color="#d4e8f2"
          transparent
          opacity={0.25}
          roughness={0.08}
          metalness={0.02}
          transmission={0.92}
          thickness={0.5}
          envMapIntensity={0.9}
          clearcoat={0.15}
          clearcoatRoughness={0.2}
          ior={1.5}
          reflectivity={0.5}
        />
      </mesh>
      
      {/* Large Window Right */}
      <mesh ref={rightWindowRef} position={[2.5, 0, 0]} castShadow>
        <boxGeometry args={[3, 3.5, 0.05]} />
        <meshPhysicalMaterial
          color="#d4e8f2"
          transparent
          opacity={0.25}
          roughness={0.08}
          metalness={0.02}
          transmission={0.92}
          thickness={0.5}
          envMapIntensity={0.9}
          clearcoat={0.15}
          clearcoatRoughness={0.2}
          ior={1.5}
          reflectivity={0.5}
        />
      </mesh>
      
      {/* Subtle dirt/smudges on glass - adds realism */}
      <mesh position={[-2.5, 1.2, 0.03]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshBasicMaterial
          color="#cccccc"
          transparent
          opacity={0.03}
          blending={THREE.MultiplyBlending}
        />
      </mesh>
      
      <mesh position={[2.5, 0.8, 0.03]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshBasicMaterial
          color="#cccccc"
          transparent
          opacity={0.04}
          blending={THREE.MultiplyBlending}
        />
      </mesh>
      
      {/* Window Frames - slightly worn metal */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={i} position={[x, 0, 0.03]}>
          {/* Vertical frame left */}
          <mesh position={[-1.5, 0, 0]}>
            <boxGeometry args={[0.08, 3.6, 0.08]} />
            <meshStandardMaterial 
              color="#1a1410" 
              roughness={0.38} 
              metalness={0.55}
            />
          </mesh>
          {/* Vertical frame right */}
          <mesh position={[1.5, 0, 0]}>
            <boxGeometry args={[0.08, 3.6, 0.08]} />
            <meshStandardMaterial 
              color="#1a1410" 
              roughness={0.38} 
              metalness={0.55}
            />
          </mesh>
          {/* Horizontal frame top */}
          <mesh position={[0, 1.75, 0]}>
            <boxGeometry args={[3.08, 0.08, 0.08]} />
            <meshStandardMaterial 
              color="#1a1410" 
              roughness={0.38} 
              metalness={0.55}
            />
          </mesh>
          {/* Horizontal frame bottom */}
          <mesh position={[0, -1.75, 0]}>
            <boxGeometry args={[3.08, 0.08, 0.08]} />
            <meshStandardMaterial 
              color="#1a1410" 
              roughness={0.38} 
              metalness={0.55}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Entrance Door Component with realistic glass
const EntranceDoor = ({ side }) => {
  const pivotX = side === 'left' ? 0.45 : -0.45;
  
  return (
    <group position={[pivotX, 1.5, 0]}>
      {/* Door Panel - slightly worn wood */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 3, 0.05]} />
        <meshStandardMaterial
          color="#3a2f28"
          roughness={0.55} // Worn finish
          metalness={0.25}
        />
      </mesh>
      
      {/* Door Glass Insert - realistic glass */}
      <mesh position={[0, 0.3, 0.03]}>
        <boxGeometry args={[0.5, 1.8, 0.03]} />
        <meshPhysicalMaterial
          color="#d4e8f2"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.02}
          transmission={0.88}
          thickness={0.3}
          envMapIntensity={0.7}
          clearcoat={0.1}
          ior={1.5}
          reflectivity={0.4}
        />
      </mesh>
      
      {/* Door Handle - worn brass */}
      <mesh position={[side === 'left' ? -0.35 : 0.35, -0.3, 0.05]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#d4af37" 
          roughness={0.28} // Slightly tarnished
          metalness={0.85}
        />
      </mesh>
    </group>
  );
};

// Cafe Signage
const CafeSignage = () => {
  return (
    <group position={[0, 4.2, 5.3]}>
      {/* Sign Background */}
      <mesh castShadow>
        <boxGeometry args={[5, 0.8, 0.15]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* 3D Text Sign */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.4}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        fontWeight="bold"
      >
        CAFÉ BLISS
      </Text>
      
      {/* Accent Lighting on Sign */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={2}
        distance={3}
        color="#FFD700"
        castShadow
      />
    </group>
  );
};

// Exterior Decoration
const ExteriorDecoration = () => {
  return (
    <group>
      {/* Potted Plants Left */}
      <group position={[-4, 0.4, 5.5]}>
        <PottedPlant />
      </group>
      
      {/* Potted Plants Right */}
      <group position={[4, 0.4, 5.5]}>
        <PottedPlant />
      </group>
      
      {/* Window Sill Decorations */}
      <group position={[-2.5, 0.5, 5.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#228B22" roughness={0.6} />
        </mesh>
      </group>
      
      <group position={[2.5, 0.5, 5.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#228B22" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// Potted Plant Component
const PottedPlant = () => {
  return (
    <group>
      {/* Pot */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.4, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      
      {/* Plant */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#2d5016" roughness={0.8} />
      </mesh>
      
      {/* Leaves */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 4) * Math.PI * 2) * 0.2,
            0.4 + i * 0.1,
            Math.cos((i / 4) * Math.PI * 2) * 0.2
          ]}
          rotation={[0, (i / 4) * Math.PI * 2, Math.PI / 4]}
          castShadow
        >
          <boxGeometry args={[0.15, 0.05, 0.3]} />
          <meshStandardMaterial color="#3d7018" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// Pavement
const Pavement = () => {
  return (
    <group>
      {/* Entry Pavement */}
      <mesh position={[0, 0.01, 9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#4a4a4a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Welcome Mat */}
      <mesh position={[0, 0.02, 5.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
};

export default CafeBuilding;
