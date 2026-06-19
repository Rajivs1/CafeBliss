import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CafeInterior = () => {
  return (
    <group>
      {/* Wooden Floor */}
      <Floor />
      
      {/* Decorative Ceiling with Plants (like in the image) */}
      <DecorativeCeiling />
      
      {/* Seating Area */}
      <SeatingArea />
      
      {/* Window Seating */}
      <WindowSeating />
      
      {/* Wall Art and Posters */}
      <WallArt />
      
      {/* Indoor Plants */}
      <IndoorPlants />
      
      {/* Product Shelves */}
      <ProductShelves />
      
      {/* Menu Board */}
      <MenuBoard />
      
      {/* Bar Seating Area */}
      <BarSeating />
      
      {/* Lived-in Details */}
      <LivedInDetails />
      
      {/* Enhanced Lighting */}
      <InteriorLighting />
    </group>
  );
};

// Wooden Floor with pattern
const Floor = () => {
  return (
    <mesh position={[0, 0, -2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 14]} />
      <meshStandardMaterial
        color="#8B6F47"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

// Decorative Ceiling with Wood Slats and Hanging Plants (like the image)
const DecorativeCeiling = () => {
  const vineRefs = useRef([]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    vineRefs.current.forEach((vine, index) => {
      if (vine) {
        const offset = index * 0.5;
        vine.rotation.z = Math.sin(time * 0.3 + offset) * 0.02;
      }
    });
  });
  
  return (
    <group position={[0, 4.8, -2]}>
      {/* Wooden Slat Ceiling */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={`slat-${i}`}
          position={[0, 0, -6 + i * 0.9]}
          rotation={[0, 0, Math.PI / 2]}
          receiveShadow
        >
          <boxGeometry args={[12, 0.12, 0.08]} />
          <meshStandardMaterial
            color="#5a4a3a"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}
      
      {/* Hanging Vines and Plants from Ceiling */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = -4 + i * 1.2;
        const z = -4 + (i % 3) * 1.5;
        return (
          <group
            key={`vine-${i}`}
            ref={(el) => (vineRefs.current[i] = el)}
            position={[x, -0.2, z]}
          >
            {/* Hanging Pot */}
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.1, 0.15, 16]} />
              <meshStandardMaterial
                color="#3d2817"
                roughness={0.75}
              />
            </mesh>
            
            {/* Trailing Vines */}
            {Array.from({ length: 4 }).map((_, j) => {
              const angle = (j / 4) * Math.PI * 2;
              return (
                <group key={`trail-${j}`} rotation={[0, angle, 0]}>
                  <mesh
                    position={[0.08, -0.15, 0]}
                    rotation={[0.2, 0, 0]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.006, 0.004, 0.35, 6]} />
                    <meshStandardMaterial
                      color="#2d5016"
                      roughness={0.8}
                    />
                  </mesh>
                  
                  {/* Leaves on vines */}
                  {Array.from({ length: 5 }).map((_, k) => (
                    <mesh
                      key={`leaf-${k}`}
                      position={[
                        0.08 + Math.sin(k * 0.6) * 0.02,
                        -0.07 - k * 0.065,
                        Math.cos(k * 0.6) * 0.02
                      ]}
                      rotation={[0.5, angle + k * 0.8, 0]}
                      castShadow
                    >
                      <boxGeometry args={[0.035, 0.002, 0.05]} />
                      <meshStandardMaterial
                        color="#3d7018"
                        roughness={0.75}
                      />
                    </mesh>
                  ))}
                </group>
              );
            })}
            
            {/* Flowers */}
            <mesh position={[0, -0.08, 0]} castShadow>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.6}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Seating Area with natural imperfections
const SeatingArea = () => {
  // Pre-defined table positions with slight variations
  const tables = [
    { pos: [-3, 0, -3], rot: 0.05 },
    { pos: [3, 0, -3], rot: -0.08 },
    { pos: [-3, 0, -6], rot: 0.03 },
    { pos: [3, 0, -6], rot: 0.06 },
  ];

  return (
    <group>
      {tables.map((table, i) => (
        <TableWithChairs key={i} position={table.pos} rotation={table.rot} tableIndex={i} />
      ))}
    </group>
  );
};

// Table with Chairs Component - chairs not perfectly aligned
const TableWithChairs = ({ position, rotation, tableIndex }) => {
  // Pre-defined chair offsets for each table (no Math.random during render)
  const chairConfigurations = useMemo(() => {
    const configs = [
      // Table 0
      [
        { angle: 0.05, distance: 0.82, rotation: Math.PI + 0.1, pulled: false },
        { angle: Math.PI / 2 + 0.08, distance: 0.78, rotation: Math.PI * 1.5 - 0.15, pulled: true },
        { angle: Math.PI - 0.06, distance: 0.81, rotation: 0.12, pulled: false },
        { angle: -Math.PI / 2 - 0.04, distance: 0.79, rotation: Math.PI / 2 + 0.08, pulled: false }
      ],
      // Table 1
      [
        { angle: -0.08, distance: 0.83, rotation: Math.PI - 0.12, pulled: false },
        { angle: Math.PI / 2 - 0.06, distance: 0.80, rotation: Math.PI * 1.5 + 0.1, pulled: false },
        { angle: Math.PI + 0.04, distance: 0.81, rotation: 0.08, pulled: true },
        { angle: -Math.PI / 2 + 0.09, distance: 0.78, rotation: Math.PI / 2 - 0.14, pulled: false }
      ],
      // Table 2
      [
        { angle: 0.02, distance: 0.81, rotation: Math.PI + 0.08, pulled: true },
        { angle: Math.PI / 2 + 0.12, distance: 0.79, rotation: Math.PI * 1.5 - 0.09, pulled: false },
        { angle: Math.PI - 0.09, distance: 0.82, rotation: -0.06, pulled: false },
        { angle: -Math.PI / 2 + 0.05, distance: 0.80, rotation: Math.PI / 2 + 0.11, pulled: false }
      ],
      // Table 3
      [
        { angle: 0.07, distance: 0.80, rotation: Math.PI - 0.15, pulled: false },
        { angle: Math.PI / 2 - 0.09, distance: 0.82, rotation: Math.PI * 1.5 + 0.12, pulled: false },
        { angle: Math.PI + 0.06, distance: 0.79, rotation: 0.1, pulled: false },
        { angle: -Math.PI / 2 - 0.08, distance: 0.81, rotation: Math.PI / 2 - 0.07, pulled: true }
      ]
    ];
    return configs[tableIndex] || configs[0];
  }, [tableIndex]);
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Table Top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
      
      {/* Table Leg */}
      <mesh position={[0, 0.375, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.75, 16]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.4}
          metalness={0.55}
        />
      </mesh>
      
      {/* Coffee Cup on Table */}
      <CoffeeCup 
        position={[
          0.15 + (tableIndex * 0.05) % 0.1, 
          0.78, 
          0.1 + (tableIndex * 0.03) % 0.08
        ]} 
        rotation={[0, tableIndex * 0.7, 0]}
      />
      
      {/* Chairs around table */}
      {chairConfigurations.map((offset, i) => {
        const distance = offset.pulled ? offset.distance + 0.15 : offset.distance;
        return (
          <Chair
            key={i}
            position={[
              Math.sin(offset.angle) * distance,
              0,
              Math.cos(offset.angle) * distance
            ]}
            rotation={offset.rotation}
          />
        );
      })}
    </group>
  );
};

// Chair Component
const Chair = ({ position, rotation }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.6}
        />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.7, -0.175]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.6}
        />
      </mesh>
      
      {/* Legs */}
      {[
        [-0.15, 0.225, 0.15],
        [0.15, 0.225, 0.15],
        [-0.15, 0.225, -0.15],
        [0.15, 0.225, -0.15]
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial
            color="#1a1410"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// Coffee Cup Component
const CoffeeCup = ({ position }) => {
  return (
    <group position={position}>
      {/* Cup */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Coffee inside */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.01, 16]} />
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* Handle */}
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.025, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// Window Seating
const WindowSeating = () => {
  return (
    <group>
      {/* Left Window Bench */}
      <group position={[-5.5, 0, 2]}>
        <WindowBench />
      </group>
      
      {/* Right Window Bench */}
      <group position={[5.5, 0, 2]}>
        <WindowBench />
      </group>
    </group>
  );
};

// Window Bench Component
const WindowBench = () => {
  return (
    <group>
      {/* Bench Seat */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 2]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.7}
        />
      </mesh>
      
      {/* Cushion */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.75, 0.15, 1.9]} />
        <meshStandardMaterial
          color="#a0826d"
          roughness={0.9}
        />
      </mesh>
      
      {/* Small Table */}
      <mesh position={[0.5, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 24]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      
      {/* Table Leg */}
      <mesh position={[0.5, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 0.6, 12]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      
      {/* Laptop on table */}
      <mesh position={[0.5, 0.63, 0]} rotation={[-Math.PI / 2, 0, 0.3]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.015]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

// Wall Art and Posters (like in the image)
const WallArt = () => {
  return (
    <group>
      {/* Vintage Coffee Posters - Left Wall */}
      <group position={[-5.8, 2.2, 2]}>
        <WallPoster color="#f5deb3" text="ESPRESSO" />
      </group>
      
      <group position={[-5.8, 2.2, 0]}>
        <WallPoster color="#d4a574" text="CAPPUCCINO" />
      </group>
      
      <group position={[-5.8, 2.2, -2]}>
        <WallPoster color="#c19a6b" text="LATTE" />
      </group>
      
      {/* Wall Lights */}
      <WallLight position={[-5.7, 2.8, 1]} />
      <WallLight position={[-5.7, 2.8, -1]} />
      
      {/* Right Wall Art */}
      <group position={[5.8, 2.2, 2]}>
        <WallPoster color="#f5e6d3" text="CAFÉ" />
      </group>
      
      <group position={[5.8, 2.2, 0]}>
        <WallPoster color="#d2b48c" text="MOCHA" />
      </group>
      
      <WallLight position={[5.7, 2.8, 1]} />
      <WallLight position={[5.7, 2.8, -1]} />
      
      {/* Clock on Back Wall */}
      <group position={[0, 3.2, -8.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial
            color="#1a1410"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        
        <mesh position={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          <meshStandardMaterial
            color="#f5f5f5"
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};

// Wall Poster Component
const WallPoster = ({ color, text }) => {
  return (
    <group>
      {/* Frame */}
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.5}
        />
      </mesh>
      
      {/* Poster */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

// Wall Mounted Light
const WallLight = ({ position }) => {
  return (
    <group position={position}>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <coneGeometry args={[0.12, 0.18, 16]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={3}
        color="#FFD700"
        castShadow
      />
    </group>
  );
};

// Indoor Plants with Subtle Natural Movement
const IndoorPlants = () => {
  return (
    <group>
      {/* Corner Plant Left */}
      <group position={[-5, 0, -7.5]}>
        <LargePottedPlant swayOffset={0} />
      </group>
      
      {/* Corner Plant Right */}
      <group position={[5, 0, -7.5]}>
        <LargePottedPlant swayOffset={2.1} />
      </group>
      
      {/* Near Counter Plant */}
      <group position={[-2, 0, -1]}>
        <SmallPottedPlant swayOffset={4.3} />
      </group>
    </group>
  );
};

// Large Potted Plant with natural leaf movement
const LargePottedPlant = ({ swayOffset = 0 }) => {
  const leavesRefs = useRef([]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() + swayOffset;
    
    // Each leaf sways slightly - like gentle air circulation
    leavesRefs.current.forEach((leaf, index) => {
      if (leaf) {
        const leafTime = time + index * 0.5;
        const sway = Math.sin(leafTime * 0.6) * 0.015 +
                    Math.sin(leafTime * 0.35 + 1) * 0.01;
        const tilt = Math.sin(leafTime * 0.4 + 2) * 0.012;
        
        leaf.rotation.z = sway;
        leaf.rotation.x = Math.PI / 3 + tilt;
      }
    });
  });
  
  return (
    <group>
      {/* Pot */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.5, 16]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      
      {/* Main Stem */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.1, 12]} />
        <meshStandardMaterial 
          color="#2d5016" 
          roughness={0.75}
        />
      </mesh>
      
      {/* Leaves with refs for animation */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          ref={(el) => (leavesRefs.current[i] = el)}
          position={[
            Math.sin((i / 6) * Math.PI * 2) * 0.4,
            0.6 + i * 0.15,
            Math.cos((i / 6) * Math.PI * 2) * 0.4
          ]}
          rotation={[Math.PI / 3, (i / 6) * Math.PI * 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.3, 0.05, 0.5]} />
          <meshStandardMaterial 
            color="#3d7018" 
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// Small Potted Plant with gentle movement
const SmallPottedPlant = ({ swayOffset = 0 }) => {
  const bushesRef = useRef([]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() + swayOffset;
    
    bushesRef.current.forEach((bush, index) => {
      if (bush) {
        const bushTime = time + index;
        const breathe = Math.sin(bushTime * 0.5) * 0.008;
        bush.scale.y = 1 + breathe;
        bush.scale.x = 1 - breathe * 0.5;
        bush.scale.z = 1 - breathe * 0.5;
      }
    });
  });
  
  return (
    <group>
      {/* Pot */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.25, 16]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.85}
        />
      </mesh>
      
      {/* Plant bushes */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => (bushesRef.current[i] = el)}
          position={[
            Math.sin((i / 3) * Math.PI * 2) * 0.1,
            0.25,
            Math.cos((i / 3) * Math.PI * 2) * 0.1
          ]}
          castShadow
        >
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial 
            color="#228B22" 
            roughness={0.75}
          />
        </mesh>
      ))}
    </group>
  );
};

// Product Shelves
const ProductShelves = () => {
  return (
    <group position={[4, 0, -8.5]}>
      {/* Shelving Unit */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.3]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={0.6}
        />
      </mesh>
      
      {/* Shelf Items */}
      {[0.5, 1.2, 1.9].map((y, i) => (
        <group key={i} position={[0, y, 0.2]}>
          {/* Coffee bags */}
          {[-0.6, -0.2, 0.2, 0.6].map((x, j) => (
            <mesh key={j} position={[x, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 0.25, 0.1]} />
              <meshStandardMaterial
                color={['#8B4513', '#654321', '#3d2817', '#5a4632'][j]}
                roughness={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Bar Seating Area (like in the image with turquoise stools)
const BarSeating = () => {
  return (
    <group position={[-3, 0, -1.5]}>
      {/* Bar Counter */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 0.5]} />
        <meshStandardMaterial
          color="#2a2420"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      
      {/* Front Panel with slats (like image) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`slat-${i}`}
          position={[-0.85 + i * 0.15, 0.5, 0.28]}
          castShadow
        >
          <boxGeometry args={[0.03, 0.8, 0.05]} />
          <meshStandardMaterial
            color="#3d2817"
            roughness={0.7}
          />
        </mesh>
      ))}
      
      {/* Turquoise Bar Stools (3 stools like in image) */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <group key={`stool-${i}`} position={[x, 0, 0.7]}>
          {/* Stool Top */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.16, 0.08, 24]} />
            <meshStandardMaterial
              color="#20B2AA"
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
          
          {/* Cushion */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.05, 24]} />
            <meshStandardMaterial
              color="#40E0D0"
              roughness={0.85}
            />
          </mesh>
          
          {/* Metal Base */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.65, 16]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
          
          {/* Footrest */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <torusGeometry args={[0.14, 0.015, 12, 24]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
          
          {/* Base Plate */}
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Enhanced Interior Lighting
const InteriorLighting = () => {
  return (
    <group>
      {/* Pendant Lights over tables */}
      {[
        [-3, 3.5, -3],
        [3, 3.5, -3],
        [-3, 3.5, -6],
        [3, 3.5, -6]
      ].map((pos, i) => (
        <group key={`pendant-${i}`} position={pos}>
          {/* Light Fixture */}
          <mesh castShadow>
            <coneGeometry args={[0.15, 0.25, 16]} />
            <meshStandardMaterial
              color="#1a1410"
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
          
          {/* Hanging Wire */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.7, 8]} />
            <meshStandardMaterial
              color="#1a1410"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
          
          {/* Light Source */}
          <pointLight
            position={[0, -0.15, 0]}
            intensity={2}
            distance={3.5}
            color="#FFA500"
            castShadow
          />
        </group>
      ))}
      
      {/* Ambient Ceiling Lights */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = -4 + (i % 3) * 4;
        const z = -2 - Math.floor(i / 3) * 4;
        return (
          <pointLight
            key={`ambient-${i}`}
            position={[x, 4.5, z]}
            intensity={1.2}
            distance={5}
            color="#FFDAB9"
          />
        );
      })}
    </group>
  );
};

// Menu Board
const MenuBoard = () => {
  return (
    <group position={[-3, 2.5, -2.3]} rotation={[0, Math.PI / 6, 0]}>
      {/* Board Background */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.2, 0.08]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.5}
        />
      </mesh>
      
      {/* Board Surface */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.4, 1.1]} />
        <meshStandardMaterial
          color="#2d2d2d"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

// Lived-In Details - Make the cafe feel occupied and used
const LivedInDetails = () => {
  return (
    <group>
      {/* Extra coffee cups on various tables - slight rotations for natural placement */}
      <CoffeeCup position={[-3.2, 0.78, -3.15]} rotation={[0, 0.3, 0]} />
      <CoffeeCup position={[3.15, 0.78, -6.1]} rotation={[0, -0.2, 0]} />
      <CoffeeCup position={[-2.8, 0.78, -6.2]} rotation={[0, 0.5, 0]} />
      
      {/* Open laptops on tables - not perfectly aligned */}
      <mesh position={[3.05, 0.78, -3.1]} rotation={[-Math.PI / 2.5, 0, 0.25]} castShadow>
        <boxGeometry args={[0.28, 0.38, 0.015]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.25}
          metalness={0.75}
        />
      </mesh>
      
      {/* Books on tables - slightly askew */}
      <mesh position={[-2.95, 0.78, -6.05]} rotation={[-Math.PI / 3.5, 0, -0.15]} castShadow>
        <boxGeometry args={[0.16, 0.22, 0.025]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.88}
        />
      </mesh>
      
      {/* Phones on tables */}
      <mesh position={[-3.35, 0.78, -2.9]} rotation={[-Math.PI / 2, 0, 0.6]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.008]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      
      {/* Backpacks on floor near chairs - not perfectly positioned */}
      <Backpack position={[3.6, 0.15, -3.3]} rotation={[0, -0.4, 0.1]} />
      <Backpack position={[-2.2, 0.18, -6.5]} rotation={[0, 1.2, -0.08]} />
      
      {/* Sugar containers and napkin holders on tables */}
      <SugarContainer position={[-3.1, 0.78, -2.85]} />
      <SugarContainer position={[2.9, 0.78, -2.92]} />
      <NapkinHolder position={[3.12, 0.78, -5.88]} />
      <NapkinHolder position={[-3.15, 0.78, -6.12]} />
      
      {/* Menu cards on some tables - slightly tilted */}
      <MenuCard position={[-3.3, 0.78, -3.2]} rotation={[-Math.PI / 2.2, 0, 0.35]} />
      <MenuCard position={[2.85, 0.78, -6.15]} rotation={[-Math.PI / 2.3, 0, -0.25]} />
      
      {/* Small decorative items */}
      <SmallVase position={[-2.5, 0.78, -2.88]} />
      <SmallVase position={[3.2, 0.78, -3.15]} />
      
      {/* Hanging plants near windows with subtle sway */}
      <HangingPlant position={[-5, 3.2, 3]} />
      <HangingPlant position={[5, 3.2, 3]} />
      <HangingPlant position={[-4, 3.2, -1]} />
      
      {/* Window condensation/light effects spots */}
      <WindowCondensation position={[-2.5, 2, 5.12]} />
      <WindowCondensation position={[2.5, 1.5, 5.12]} />
    </group>
  );
};

// Backpack component
const Backpack = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Main bag body */}
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.35, 0.15]} />
        <meshStandardMaterial
          color="#2d3748"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      
      {/* Front pocket */}
      <mesh position={[0, 0, 0.09]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.04]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.88}
        />
      </mesh>
      
      {/* Straps */}
      <mesh position={[-0.08, 0.1, -0.06]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.03, 0.25, 0.015]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0.08, 0.1, -0.06]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.03, 0.25, 0.015]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

// Sugar container
const SugarContainer = ({ position }) => {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.03, 0.035, 0.06, 16]} />
      <meshStandardMaterial
        color="#e0e0e0"
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
};

// Napkin holder
const NapkinHolder = ({ position }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.05, 0.08]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.7}
        />
      </mesh>
      {/* Napkins inside */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.07, 0.03, 0.07]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
};

// Menu card on table
const MenuCard = ({ position, rotation }) => {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.12, 0.18, 0.002]} />
      <meshStandardMaterial
        color="#f5f5dc"
        roughness={0.9}
      />
    </mesh>
  );
};

// Small decorative vase
const SmallVase = ({ position }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.08, 16]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Small flower/stem */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
        <meshStandardMaterial
          color="#2d5016"
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.11, 0]} castShadow>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// Hanging plant with subtle sway
const HangingPlant = ({ position }) => {
  const plantRef = useRef();
  
  // Stable sway offset using useMemo instead of useRef with Math.random
  const swayOffset = useMemo(() => {
    // Generate a stable offset based on position
    const hash = position[0] * 100 + position[1] * 10 + position[2];
    return (hash % 6.28); // 0 to 2π
  }, [position]);
  
  useFrame(({ clock }) => {
    if (!plantRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Very subtle swaying motion - like gentle air movement
    const swayX = Math.sin(time * 0.4 + swayOffset) * 0.02;
    const swayZ = Math.sin(time * 0.3 + swayOffset + 1) * 0.015;
    const twist = Math.sin(time * 0.5 + swayOffset) * 0.03;
    
    plantRef.current.rotation.x = swayX;
    plantRef.current.rotation.z = swayZ;
    plantRef.current.rotation.y = twist;
  });
  
  return (
    <group position={position}>
      {/* Hanging pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.15, 16]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.75}
        />
      </mesh>
      
      {/* Rope/wire */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.6, 12]} />
        <meshStandardMaterial
          color="#5a4a3a"
          roughness={0.9}
        />
      </mesh>
      
      {/* Trailing plant - has movement */}
      <group ref={plantRef} position={[0, -0.08, 0]}>
        {/* Multiple trailing vines */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.1, -0.1, 0]} rotation={[0.3, 0, 0]} castShadow>
                <cylinderGeometry args={[0.01, 0.008, 0.25, 8]} />
                <meshStandardMaterial
                  color="#3d7018"
                  roughness={0.8}
                />
              </mesh>
              {/* Leaves along vine */}
              {[0, 1, 2].map((j) => (
                <mesh
                  key={j}
                  position={[
                    0.1 + Math.sin(j * 0.5) * 0.03,
                    -0.05 - j * 0.08,
                    Math.cos(j * 0.5) * 0.03
                  ]}
                  rotation={[0.5, angle + j * 0.8, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.04, 0.002, 0.06]} />
                  <meshStandardMaterial
                    color="#4a8520"
                    roughness={0.75}
                  />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>
    </group>
  );
};

// Window condensation effect (subtle texture variation)
const WindowCondensation = ({ position }) => {
  const condRef = useRef();
  
  useFrame(({ clock }) => {
    if (!condRef.current) return;
    
    const time = clock.getElapsedTime();
    // Very subtle opacity variation - like condensation slowly changing
    condRef.current.material.opacity = 0.08 + Math.sin(time * 0.08) * 0.02;
  });
  
  return (
    <mesh ref={condRef} position={position}>
      <planeGeometry args={[0.4, 0.6]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export default CafeInterior;
