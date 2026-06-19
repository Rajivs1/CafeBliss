import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CafeCounter = ({ scrollProgress }) => {
  const steamRef1 = useRef();
  const steamRef2 = useRef();

  // Animate steam from espresso machines
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (steamRef1.current) {
      steamRef1.current.position.y = 1.2 + Math.sin(time * 2) * 0.1;
      steamRef1.current.scale.y = 1 + Math.sin(time * 3) * 0.2;
      steamRef1.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
    }
    
    if (steamRef2.current) {
      steamRef2.current.position.y = 1.2 + Math.sin(time * 2 + 1) * 0.1;
      steamRef2.current.scale.y = 1 + Math.sin(time * 3 + 1) * 0.2;
      steamRef2.current.material.opacity = 0.3 + Math.sin(time * 2 + 1) * 0.1;
    }
  });

  return (
    <group position={[-3.5, 0, -2]}>
      {/* Main Counter */}
      <CounterStructure />
      
      {/* Espresso Machines */}
      <group position={[0.5, 1, -0.3]}>
        <EspressoMachine position={[0, 0, 0]} steamRef={steamRef1} />
        <EspressoMachine position={[0.8, 0, 0]} steamRef={steamRef2} />
      </group>
      
      {/* Display Case */}
      <DisplayCase position={[-1.2, 0, 0.3]} />
      
      {/* Coffee Grinder */}
      <CoffeeGrinder position={[1.5, 1, -0.3]} />
      
      {/* Bar Stools */}
      <BarStool position={[0, 0, 1.2]} rotation={0} />
      <BarStool position={[1, 0, 1.2]} rotation={0.3} />
      <BarStool position={[-1, 0, 1.2]} rotation={-0.2} />
    </group>
  );
};

// Counter Structure
const CounterStructure = () => {
  return (
    <group>
      {/* Counter Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 0.6]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Counter Top */}
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 0.08, 0.7]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Front Panel */}
      <mesh position={[0, 0.5, 0.35]} castShadow>
        <boxGeometry args={[3, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.7}
        />
      </mesh>
      
      {/* Back Panel */}
      <mesh position={[0, 0.5, -0.35]} receiveShadow>
        <boxGeometry args={[3, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.7}
        />
      </mesh>
      
      {/* Side Panels */}
      <mesh position={[-1.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.7}
        />
      </mesh>
      
      <mesh position={[1.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// Espresso Machine
const EspressoMachine = ({ position, steamRef }) => {
  return (
    <group position={position}>
      {/* Machine Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      
      {/* Top Section */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.35, 0.2, 0.25]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Steam Wand */}
      <mesh position={[-0.15, 0.1, 0.1]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.25, 12]} />
        <meshStandardMaterial
          color="#d4d4d4"
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>
      
      {/* Portafilter Handle */}
      <mesh position={[0.15, 0, 0.15]} rotation={[Math.PI / 4, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.15, 12]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.4}
        />
      </mesh>
      
      {/* Cup on drip tray */}
      <mesh position={[0, -0.28, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.3}
        />
      </mesh>
      
      {/* Steam Effect */}
      <mesh ref={steamRef} position={[-0.2, 0.5, 0.15]}>
        <cylinderGeometry args={[0.03, 0.01, 0.3, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>
      
      {/* Machine Glow Light */}
      <pointLight
        position={[0, 0, 0.2]}
        intensity={0.5}
        distance={0.8}
        color="#ff4400"
      />
    </group>
  );
};

// Display Case
const DisplayCase = ({ position }) => {
  return (
    <group position={position}>
      {/* Case Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.6, 0.5]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      
      {/* Glass Top */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.95, 0.1, 0.45]} />
        <meshPhysicalMaterial
          color="#b8e5f5"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          transmission={0.95}
          thickness={0.5}
        />
      </mesh>
      
      {/* Pastries Inside */}
      {/* Croissant */}
      <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0.5, 0]} castShadow>
        <torusGeometry args={[0.06, 0.03, 8, 12, Math.PI]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.6}
        />
      </mesh>
      
      {/* Muffin */}
      <mesh position={[0, 0.35, 0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.06, 16]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.7}
        />
      </mesh>
      
      {/* Cookie */}
      <mesh position={[0.25, 0.33, -0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial
          color="#c19a6b"
          roughness={0.8}
        />
      </mesh>
      
      {/* Slice of Cake */}
      <mesh position={[0.15, 0.35, 0.05]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.08]} />
        <meshStandardMaterial
          color="#f4e4d7"
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};

// Coffee Grinder
const CoffeeGrinder = ({ position }) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.3, 24]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Hopper */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.2, 24]} />
        <meshPhysicalMaterial
          color="#444444"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      
      {/* Coffee Beans Inside */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#4a2f1a"
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// Bar Stool
const BarStool = ({ position, rotation }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.08, 24]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.6}
        />
      </mesh>
      
      {/* Cushion */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 24]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.9}
        />
      </mesh>
      
      {/* Central Pole */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 16]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Foot Rest Ring */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <torusGeometry args={[0.15, 0.015, 12, 24]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 6]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
};

export default CafeCounter;
