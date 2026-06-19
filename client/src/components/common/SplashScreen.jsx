import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import './SplashScreen.css';

// ─── MATERIAL HELPERS ────────────────────────────────────────────────────────
const wood   = (c='#8B6F47') => <meshStandardMaterial color={c} roughness={0.85} metalness={0.05}/>;
const metal  = (c='#b0a090') => <meshStandardMaterial color={c} roughness={0.25} metalness={0.9}/>;
const fabric = (c='#5a7a6a') => <meshStandardMaterial color={c} roughness={0.95} metalness={0}/>;
const plaster= (c='#c8b89a') => <meshStandardMaterial color={c} roughness={0.92} metalness={0}/>;
const glass  = ()            => <meshPhysicalMaterial color="#a0d0e8" transparent opacity={0.3}
                                   roughness={0.04} metalness={0} transmission={0.85} thickness={0.3}/>;

// ─── FLOOR — wood planks + single clean rug ──────────────────────────────────
const Floor = () => (
  <group>
    {/* base floor */}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,-1]} receiveShadow>
      <planeGeometry args={[14,20]}/>
      <meshStandardMaterial color="#3e2c18" roughness={0.9} metalness={0.04}/>
    </mesh>
    {/* plank seams */}
    {Array.from({length:9},(_,i)=>(
      <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[(i-4)*1.55,0.002,-1]}>
        <planeGeometry args={[0.035,20]}/>
        <meshStandardMaterial color="#241608" roughness={0.95}/>
      </mesh>
    ))}
    {/* single flat rug under the tables */}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.003,-4]}>
      <planeGeometry args={[9,6]}/>
      <meshStandardMaterial color="#5a281c" roughness={0.95}/>
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.004,-4]}>
      <planeGeometry args={[8.2,5.2]}/>
      <meshStandardMaterial color="#6e3a22" roughness={0.95}/>
    </mesh>
  </group>
);

// ─── WALLS — cozy room (x ±7, z -9..9) ───────────────────────────────────────
const Walls = () => (
  <group>
    {/* BACK wall */}
    <mesh position={[0,3,-9]} receiveShadow castShadow>
      <boxGeometry args={[14,6,0.2]}/>{plaster('#4a3a2c')}
    </mesh>

    {/* LEFT wall — exposed brick */}
    <mesh position={[-7,3,0]} rotation={[0,Math.PI/2,0]} receiveShadow>
      <boxGeometry args={[20,6,0.2]}/>{plaster('#3a281c')}
    </mesh>
    {Array.from({length:7},(_,row)=>
      Array.from({length:11},(_,col)=>{
        const off = row%2===0 ? 0 : 0.95;
        return (
          <mesh key={`${row}-${col}`}
            position={[-6.89, 0.55+row*0.72, -8.5+col*1.9+off]}
            rotation={[0,Math.PI/2,0]} castShadow receiveShadow>
            <boxGeometry args={[1.75,0.62,0.06]}/>
            <meshStandardMaterial color={(row+col)%3===0?'#5a3c2c':'#4a3224'} roughness={0.95}/>
          </mesh>
        );
      })
    )}

    {/* RIGHT wall — plaster + wainscoting */}
    <mesh position={[7,3,0]} rotation={[0,-Math.PI/2,0]} receiveShadow castShadow>
      <boxGeometry args={[20,6,0.2]}/>{plaster('#52402e')}
    </mesh>
    <mesh position={[6.88,1.1,0]} rotation={[0,-Math.PI/2,0]} castShadow>
      <boxGeometry args={[20,0.08,0.12]}/>{wood('#3a2410')}
    </mesh>
    {Array.from({length:10},(_,i)=>(
      <mesh key={i} position={[6.88,0.55,-9+i*2]} rotation={[0,-Math.PI/2,0]} castShadow>
        <boxGeometry args={[1.8,1.05,0.05]}/>{wood('#42301c')}
      </mesh>
    ))}

    {/* FRONT wall (behind camera) */}
    <mesh position={[0,3,9]} receiveShadow castShadow>
      <boxGeometry args={[14,6,0.2]}/>{plaster('#4a3a2c')}
    </mesh>

    {/* CEILING — wood slats running across (horizontal, spaced front-to-back) */}
    {Array.from({length:16},(_,i)=>(
      <mesh key={`slat-${i}`} position={[0,5.93,-9+i*1.15]}>
        <boxGeometry args={[14,0.08,0.5]}/>{wood('#2a1c0e')}
      </mesh>
    ))}
    <mesh position={[0,6,0]} rotation={[Math.PI/2,0,0]}>
      <planeGeometry args={[14,20]}/>{plaster('#3a2c1e')}
    </mesh>

    {/* crown moulding */}
    <mesh position={[0,5.85,-9]} castShadow>
      <boxGeometry args={[14,0.25,0.18]}/>{wood('#2a1c0e')}
    </mesh>
    <mesh position={[-7,5.85,0]} rotation={[0,Math.PI/2,0]} castShadow>
      <boxGeometry args={[20,0.25,0.18]}/>{wood('#2a1c0e')}
    </mesh>
    <mesh position={[7,5.85,0]} rotation={[0,Math.PI/2,0]} castShadow>
      <boxGeometry args={[20,0.25,0.18]}/>{wood('#2a1c0e')}
    </mesh>
  </group>
);

// ─── BACK-WALL FEATURE SIGN (focal point looking into cafe) ──────────────────
const BackSign = () => (
  <group position={[0,4.6,-8.8]}>
    <mesh castShadow>
      <boxGeometry args={[5,1,0.15]}/>{wood('#2a1a0a')}
    </mesh>
    <Text position={[0,0,0.1]} fontSize={0.45} color="#FFD700"
      anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
      CAFÉ BLISS
    </Text>
    <pointLight position={[0,0.2,1]} intensity={2.5} distance={4} color="#FFD700"/>
  </group>
);

// ─── TABLE + CHAIRS — cleaner proportions ────────────────────────────────────
const Chair = ({ angle }) => {
  const x = Math.sin(angle) * 0.82;
  const z = Math.cos(angle) * 0.82;
  return (
    <group position={[x,0,z]} rotation={[0,angle+Math.PI,0]}>
      {/* seat */}
      <mesh position={[0,0.47,0]} castShadow receiveShadow>
        <boxGeometry args={[0.44,0.04,0.44]}/>{wood('#7a5030')}
      </mesh>
      {/* seat cushion */}
      <mesh position={[0,0.50,0]} castShadow>
        <boxGeometry args={[0.40,0.05,0.40]}/>{fabric('#8a6040')}
      </mesh>
      {/* back */}
      <mesh position={[0,0.78,-0.2]} castShadow>
        <boxGeometry args={[0.44,0.52,0.04]}/>{wood('#7a5030')}
      </mesh>
      {/* 4 thin legs */}
      {[[-0.18,-0.25, 0.18],[0.18,-0.25, 0.18],[-0.18,-0.25,-0.18],[0.18,-0.25,-0.18]].map((p,j)=>(
        <mesh key={j} position={[p[0],p[1]+0.49,p[2]]} castShadow>
          <cylinderGeometry args={[0.018,0.018,0.5,8]}/>{metal('#5a4030')}
        </mesh>
      ))}
    </group>
  );
};

const Table = ({ pos }) => (
  <group position={pos}>
    {/* top */}
    <mesh position={[0,0.75,0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.52,0.52,0.05,32]}/>{wood('#7a4f2a')}
    </mesh>
    {/* single central pedestal */}
    <mesh position={[0,0.38,0]} castShadow>
      <cylinderGeometry args={[0.04,0.06,0.76,12]}/>{metal('#5a4030')}
    </mesh>
    {/* base disc */}
    <mesh position={[0,0.02,0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.28,0.28,0.04,20]}/>{metal('#4a3020')}
    </mesh>
    {/* coffee cup */}
    <mesh position={[0.12,0.78,0.08]} castShadow>
      <cylinderGeometry args={[0.042,0.036,0.08,16]}/>{plaster('#f0ece4')}
    </mesh>
    <mesh position={[0.12,0.832,0.08]}>
      <cylinderGeometry args={[0.038,0.038,0.012,16]}/>
      <meshStandardMaterial color="#2a1208"/>
    </mesh>
    {/* saucer */}
    <mesh position={[0.12,0.77,0.08]} castShadow>
      <cylinderGeometry args={[0.08,0.08,0.01,16]}/>{plaster('#f0ece4')}
    </mesh>
    {/* chairs */}
    {[0, Math.PI/2, Math.PI, -Math.PI/2].map((a,i)=>(
      <Chair key={i} angle={a}/>
    ))}
  </group>
);

const Tables = () => (
  <group>
    <Table pos={[-3,0,-3]}/><Table pos={[3,0,-3]}/>
    <Table pos={[-3,0,-5.5]}/><Table pos={[3,0,-5.5]}/>
  </group>
);

// ─── SEATED CUSTOMER — sits on a chair facing the table ──────────────────────
// tablePos = centre of table; angle = which chair (0,π/2,π,-π/2)
const SeatedPerson = ({ tablePos, angle, shirt='#4a6a8a', hair='#2a1a0a' }) => {
  const headRef = useRef();
  const seatX = tablePos[0] + Math.sin(angle) * 0.82;
  const seatZ = tablePos[2] + Math.cos(angle) * 0.82;
  // face the table centre  → local +z points inward
  const faceY = angle + Math.PI;

  useFrame(({ clock }) => {
    if (headRef.current)
      headRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4 + seatX) * 0.1;
  });

  return (
    <group position={[seatX, 0, seatZ]} rotation={[0, faceY, 0]}>
      {/* hips */}
      <mesh position={[0,0.52,0.02]} castShadow>
        <boxGeometry args={[0.36,0.16,0.34]}/>
        <meshStandardMaterial color="#3a3a44" roughness={0.9}/>
      </mesh>
      {/* thighs — horizontal, forward toward table */}
      <mesh position={[0,0.5,0.22]} castShadow>
        <boxGeometry args={[0.34,0.14,0.4]}/>
        <meshStandardMaterial color="#3a3a44" roughness={0.9}/>
      </mesh>
      {/* lower legs — down to floor */}
      {[-0.1,0.1].map((x,i)=>(
        <mesh key={i} position={[x,0.25,0.42]} castShadow>
          <boxGeometry args={[0.12,0.5,0.13]}/>
          <meshStandardMaterial color="#2a2a34" roughness={0.9}/>
        </mesh>
      ))}
      {/* torso — leans back slightly */}
      <mesh position={[0,0.86,-0.05]} rotation={[0.12,0,0]} castShadow>
        <boxGeometry args={[0.38,0.5,0.26]}/>
        <meshStandardMaterial color={shirt} roughness={0.85}/>
      </mesh>
      {/* arms resting on table */}
      <mesh position={[-0.22,0.78,0.18]} rotation={[0.5,0,0]} castShadow>
        <boxGeometry args={[0.1,0.1,0.4]}/>
        <meshStandardMaterial color={shirt} roughness={0.85}/>
      </mesh>
      <mesh position={[0.22,0.78,0.18]} rotation={[0.5,0,0]} castShadow>
        <boxGeometry args={[0.1,0.1,0.4]}/>
        <meshStandardMaterial color={shirt} roughness={0.85}/>
      </mesh>
      {/* neck */}
      <mesh position={[0,1.12,-0.02]} castShadow>
        <cylinderGeometry args={[0.05,0.06,0.1,10]}/>
        <meshStandardMaterial color="#c8956a" roughness={0.8}/>
      </mesh>
      {/* head */}
      <mesh ref={headRef} position={[0,1.24,-0.02]} castShadow>
        <sphereGeometry args={[0.14,18,18]}/>
        <meshStandardMaterial color="#c8956a" roughness={0.8}/>
      </mesh>
      {/* hair cap */}
      <mesh position={[0,1.31,-0.04]} castShadow>
        <sphereGeometry args={[0.145,18,12,0,Math.PI*2,0,Math.PI*0.6]}/>
        <meshStandardMaterial color={hair} roughness={0.95}/>
      </mesh>
    </group>
  );
};

const Customers = () => (
  <group>
    {/* Table -3,-3 */}
    <SeatedPerson tablePos={[-3,0,-3]} angle={Math.PI}    shirt="#9a4a4a"/>
    <SeatedPerson tablePos={[-3,0,-3]} angle={-Math.PI/2} shirt="#4a7a5a" hair="#3a2a10"/>
    {/* Table 3,-3 */}
    <SeatedPerson tablePos={[3,0,-3]}  angle={Math.PI}    shirt="#4a5a8a"/>
    <SeatedPerson tablePos={[3,0,-3]}  angle={Math.PI/2}  shirt="#8a6a40" hair="#2a1808"/>
    {/* Table -3,-5.5 */}
    <SeatedPerson tablePos={[-3,0,-5.5]} angle={Math.PI}  shirt="#7a5a3a" hair="#1a1208"/>
    {/* Table 3,-5.5 */}
    <SeatedPerson tablePos={[3,0,-5.5]}  angle={0}        shirt="#6a4a7a"/>
    <SeatedPerson tablePos={[3,0,-5.5]}  angle={Math.PI}  shirt="#5a7a4a"/>
  </group>
);

// ─── COUNTER — richer detail ─────────────────────────────────────────────────
const Counter = () => (
  <group position={[-3.4,0,-8.1]}>
    {/* main body */}
    <mesh position={[0,0.55,0]} castShadow receiveShadow>
      <boxGeometry args={[3.2,1.1,0.72]}/>{wood('#4a2e12')}
    </mesh>
    {/* front decorative panels */}
    {[-1.1,-0.35,0.4,1.15].map((x,i)=>(
      <mesh key={i} position={[x,0.5,0.38]} castShadow>
        <boxGeometry args={[0.62,0.85,0.04]}/>{wood('#5a3a1a')}
      </mesh>
    ))}
    {/* marble-look counter top */}
    <mesh position={[0,1.09,0]} castShadow receiveShadow>
      <boxGeometry args={[3.3,0.09,0.8]}/>
      <meshStandardMaterial color="#e8e0d0" roughness={0.15} metalness={0.05}/>
    </mesh>
    {/* counter edge trim */}
    <mesh position={[0,1.04,0.41]} castShadow>
      <boxGeometry args={[3.3,0.07,0.04]}/>{metal('#8a7060')}
    </mesh>
    {/* espresso machine */}
    <group position={[0.6,1.12,0]}>
      <mesh castShadow><boxGeometry args={[0.48,0.58,0.34]}/>{metal('#1a1a1a')}</mesh>
      <mesh position={[0,0.33,0]} castShadow><boxGeometry args={[0.4,0.18,0.28]}/>{metal('#111')}</mesh>
      {/* portafilter */}
      <mesh position={[0.1,0.05,0.18]} rotation={[0.3,0,0]} castShadow>
        <cylinderGeometry args={[0.04,0.04,0.22,12]}/>{metal('#3a2a1a')}
      </mesh>
      {/* steam wand */}
      <mesh position={[-0.18,0.12,0.16]} rotation={[0,0,-0.5]} castShadow>
        <cylinderGeometry args={[0.012,0.012,0.28,10]}/>{metal('#d0d0d0')}
      </mesh>
      <pointLight position={[0,0.35,0.2]} intensity={1.8} distance={1.5} color="#ff5500"/>
    </group>
    {/* coffee grinder */}
    <group position={[-0.8,1.12,0]}>
      <mesh castShadow><cylinderGeometry args={[0.14,0.16,0.32,20]}/>{metal('#1a1a1a')}</mesh>
      <mesh position={[0,0.22,0]} castShadow>
        <cylinderGeometry args={[0.12,0.08,0.2,20]}/>
        <meshPhysicalMaterial color="#333" transparent opacity={0.5} roughness={0.05}/>
      </mesh>
    </group>
    {/* pastry display case glass */}
    <mesh position={[-1.2,1.22,0]} castShadow>
      <boxGeometry args={[0.9,0.26,0.62]}/>{glass()}
    </mesh>
    {/* pastries */}
    {[[-1.35,1.18,-0.1],[-1.1,1.18,0.1],[-1.2,1.18,0]].map((p,i)=>(
      <mesh key={i} position={p} castShadow>
        <cylinderGeometry args={[0.06,0.05,0.06,16]}/>
        <meshStandardMaterial color={['#d4a574','#c87050','#e8c080'][i]} roughness={0.8}/>
      </mesh>
    ))}
    {/* back shelf with bottles */}
    <mesh position={[0,2.0,-0.5]} castShadow>
      <boxGeometry args={[3.2,0.06,0.3]}/>{wood('#3a2010')}
    </mesh>
    {[-1.1,-0.55,0,0.55,1.1].map((x,i)=>(
      <group key={i} position={[x,2.06,-0.48]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06,0.07,0.32,14]}/>
          <meshStandardMaterial color={['#8B4513','#4a3050','#2a5040','#7a5030','#3a4a60'][i]}
            transparent opacity={0.75} roughness={0.15} metalness={0.1}/>
        </mesh>
        <mesh position={[0,0.2,0]} castShadow>
          <cylinderGeometry args={[0.03,0.03,0.08,10]}/>{metal('#8a8080')}
        </mesh>
      </group>
    ))}
    {/* bar stools — teal velvet */}
    {[-0.9,0,0.9].map((x,i)=>(
      <group key={i} position={[x,0,0.82]}>
        <mesh position={[0,0.68,0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.21,0.19,0.09,24]}/>{fabric('#2a8a80')}
        </mesh>
        <mesh position={[0,0.64,0]} castShadow>
          <torusGeometry args={[0.19,0.04,8,24]}/>{fabric('#1a6a60')}
        </mesh>
        <mesh position={[0,0.33,0]} castShadow>
          <cylinderGeometry args={[0.025,0.025,0.65,12]}/>{metal('#9a9090')}
        </mesh>
        <mesh position={[0,0.25,0]} castShadow>
          <torusGeometry args={[0.14,0.015,8,20]}/>{metal('#8a8080')}
        </mesh>
        <mesh position={[0,0.02,0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.24,0.24,0.05,6]}/>{metal('#3a3030')}
        </mesh>
      </group>
    ))}
  </group>
);

// ─── SOFA + COFFEE TABLE ─────────────────────────────────────────────────────
const Sofa = ({ pos, rot=0 }) => (
  <group position={pos} rotation={[0,rot,0]}>
    {/* seat */}
    <mesh position={[0,0.4,0]} castShadow receiveShadow>
      <boxGeometry args={[2.2,0.25,0.85]}/>{fabric('#5a4a38')}
    </mesh>
    {/* back */}
    <mesh position={[0,0.78,-0.35]} castShadow>
      <boxGeometry args={[2.2,0.65,0.2]}/>{fabric('#5a4a38')}
    </mesh>
    {/* arms */}
    <mesh position={[-1.05,0.55,0]} castShadow>
      <boxGeometry args={[0.22,0.55,0.85]}/>{fabric('#4a3a2a')}
    </mesh>
    <mesh position={[1.05,0.55,0]} castShadow>
      <boxGeometry args={[0.22,0.55,0.85]}/>{fabric('#4a3a2a')}
    </mesh>
    {/* legs */}
    {[[-1,-0.38,-0.4],[1,-0.38,-0.4],[-1,-0.38,0.4],[1,-0.38,0.4]].map((p,i)=>(
      <mesh key={i} position={p} castShadow>
        <boxGeometry args={[0.08,0.28,0.08]}/>{wood('#2a1a0a')}
      </mesh>
    ))}
    {/* throw cushions */}
    <mesh position={[-0.6,0.56,0.1]} rotation={[0,0.3,0.1]} castShadow>
      <boxGeometry args={[0.35,0.3,0.12]}/>{fabric('#8a6a50')}
    </mesh>
    <mesh position={[0.5,0.56,-0.05]} rotation={[0,-0.2,0.08]} castShadow>
      <boxGeometry args={[0.32,0.28,0.12]}/>{fabric('#c8a060')}
    </mesh>
  </group>
);

// ─── BOOKSHELF ───────────────────────────────────────────────────────────────
const Bookshelf = ({ pos, rot=0 }) => {
  const bookColors = ['#8B4513','#2a5a8a','#4a8a3a','#8a3a3a','#5a5a8a','#8a7a30','#3a6a6a','#7a3a6a'];
  return (
    <group position={pos} rotation={[0,rot,0]}>
      {/* frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6,2.4,0.35]}/>{wood('#3a2010')}
      </mesh>
      {/* shelves */}
      {[0.3,0.85,1.4,1.95].map((y,s)=>(
        <mesh key={s} position={[0,y,0.1]} castShadow>
          <boxGeometry args={[1.5,0.05,0.28]}/>{wood('#4a2818')}
        </mesh>
      ))}
      {/* books */}
      {[0.3,0.85,1.4,1.95].map((y,s)=>
        Array.from({length:6},(_,b)=>(
          <mesh key={`${s}-${b}`}
            position={[-0.62+b*0.22, y+0.15, 0.1]}
            rotation={[0,0,(Math.abs(b-2.5))*0.04]}
            castShadow>
            <boxGeometry args={[0.16,0.26+b*0.02,0.22]}/>
            <meshStandardMaterial color={bookColors[(s*6+b)%8]} roughness={0.9}/>
          </mesh>
        ))
      )}
    </group>
  );
};

// ─── PENDANT LIGHTS ──────────────────────────────────────────────────────────
const PendantLight = ({ pos, phase=0 }) => {
  const bulbRef = useRef();
  useFrame(({ clock }) => {
    if (bulbRef.current) {
      const f = 1 + Math.sin(clock.getElapsedTime()*9.5+phase)*0.015;
      bulbRef.current.intensity = 3.6 * f;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0,-0.55,0]} castShadow>
        <cylinderGeometry args={[0.18,0.22,0.28,20,1,true]}/>
        <meshStandardMaterial color="#1a1410" roughness={0.4} metalness={0.6} side={THREE.DoubleSide}/>
      </mesh>
      <mesh position={[0,-0.06,0]}>
        <sphereGeometry args={[0.055,14,14]}/>
        <meshStandardMaterial color="#fff5e6" emissive="#fff5e6" emissiveIntensity={2} roughness={0.2}/>
      </mesh>
      <pointLight ref={bulbRef} position={[0,-0.06,0]} intensity={3.6} distance={5.5} decay={2} color="#ffcf8a" castShadow/>
    </group>
  );
};

const Pendants = () => (
  <group>
    <PendantLight pos={[-3,5,-3]}   phase={0}/>
    <PendantLight pos={[3,5,-3]}    phase={1.3}/>
    <PendantLight pos={[-3,5,-5.5]} phase={2.6}/>
    <PendantLight pos={[3,5,-5.5]}  phase={3.9}/>
    <PendantLight pos={[-3.4,5,-7.4]} phase={1.7}/>
    <PendantLight pos={[0,5,-1]}    phase={0.8}/>
  </group>
);

// ─── WALL DECORATIONS — real images from Unsplash ─────────────────────────────
// Each photo has its own sub-component so useTexture rules are followed
const Photo1 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};
const Photo2 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};
const Photo3 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};
const Photo4 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};
const Photo5 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};
const Photo6 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};
const Photo7 = ({ pos, rot }) => {
  const tex = useTexture('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80');
  return <WallFrame pos={pos} rot={rot} tex={tex}/>;
};

// Reusable framed photo mesh
const WallFrame = ({ pos, rot=0, tex }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    {/* outer frame — dark walnut */}
    <mesh castShadow>
      <boxGeometry args={[1.05, 0.82, 0.06]}/>
      <meshStandardMaterial color="#2a1a0a" roughness={0.6} metalness={0.2}/>
    </mesh>
    {/* inner mat — cream */}
    <mesh position={[0, 0, 0.032]}>
      <boxGeometry args={[0.96, 0.74, 0.01]}/>
      <meshStandardMaterial color="#f0e8d8" roughness={0.95}/>
    </mesh>
    {/* photo */}
    <mesh position={[0, 0, 0.042]}>
      <planeGeometry args={[0.84, 0.63]}/>
      <meshStandardMaterial map={tex} roughness={0.6} toneMapped={false}/>
    </mesh>
    {/* subtle frame glow */}
    <pointLight position={[0, 0, 0.4]} intensity={0.6} distance={1.8} color="#ffe8c0"/>
  </group>
);

// Vintage poster component (no texture needed — styled with colour + text)
const VintagePoster = ({ pos, rot=0, label, accent='#D4A574', bg='#2a1a10' }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <mesh castShadow>
      <boxGeometry args={[0.9, 1.2, 0.06]}/>{wood('#2a1a0a')}
    </mesh>
    <mesh position={[0, 0, 0.034]}>
      <boxGeometry args={[0.82, 1.12, 0.01]}/>
      <meshStandardMaterial color={bg} roughness={0.9}/>
    </mesh>
    <Text position={[0, 0.3, 0.045]} fontSize={0.11} color={accent}
      anchorX="center" anchorY="middle" maxWidth={0.7} textAlign="center"
      letterSpacing={0.1}>
      {label}
    </Text>
    <Text position={[0, -0.1, 0.045]} fontSize={0.07} color="#c8b89a"
      anchorX="center" anchorY="middle" maxWidth={0.65} textAlign="center">
      CAFÉ BLISS
    </Text>
    {/* decorative rule */}
    <mesh position={[0, 0.12, 0.045]}>
      <boxGeometry args={[0.5, 0.008, 0.005]}/>
      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4}/>
    </mesh>
  </group>
);

// ─── LED MENU BOARD — glowing illuminated sign ───────────────────────────────
const LEDMenu = ({ pos }) => {
  const glowRef = useRef();
  useFrame(({ clock }) => {
    if (glowRef.current) {
      // subtle LED flicker / breathing
      glowRef.current.intensity = 1.4 + Math.sin(clock.getElapsedTime()*2.5)*0.15;
    }
  });
  return (
    <group position={pos}>
      {/* dark glossy panel */}
      <mesh castShadow>
        <boxGeometry args={[2.6,1.9,0.1]}/>
        <meshStandardMaterial color="#0a0a0c" roughness={0.25} metalness={0.5}/>
      </mesh>
      {/* glowing cyan LED frame */}
      <mesh position={[0,0,0.055]}>
        <boxGeometry args={[2.55,1.85,0.02]}/>
        <meshStandardMaterial color="#0a1418" emissive="#22d3ee" emissiveIntensity={1.4} roughness={0.3}/>
      </mesh>
      {/* inner black screen */}
      <mesh position={[0,0,0.07]}>
        <boxGeometry args={[2.4,1.7,0.02]}/>
        <meshStandardMaterial color="#050608" roughness={0.2} metalness={0.3}/>
      </mesh>
      {/* header */}
      <Text position={[0,0.68,0.09]} fontSize={0.22} color="#ffd24a"
        anchorX="center" anchorY="middle" letterSpacing={0.08}
        outlineWidth={0.004} outlineColor="#ff9a00">
        — MENU —
      </Text>
      {/* glowing menu lines */}
      <Text position={[0,0.18,0.09]} fontSize={0.155} color="#7df9ff"
        anchorX="center" anchorY="middle" maxWidth={2.2} lineHeight={1.7}
        outlineWidth={0.003} outlineColor="#0a4a55">
        {'ESPRESSO          ₹120\nCAPPUCCINO        ₹150\nCROISSANT          ₹80\nCHEESECAKE       ₹150\nCHAI LATTE         ₹110'}
      </Text>
      {/* LED glow light spilling onto wall */}
      <pointLight ref={glowRef} position={[0,0,0.8]} intensity={1.4} distance={4} color="#3ad8ee"/>
    </group>
  );
};

const WallDecor = () => (
  <group>
    {/* ── BACK wall — photos high above counter + chalkboard ── */}
    <Photo1 pos={[-4,3.4,-8.85]}/>
    <Photo2 pos={[-1.5,3.4,-8.85]}/>
    <Photo4 pos={[1,3.5,-8.85]}/>
    {/* LED illuminated menu board (right of counter) */}
    <LEDMenu pos={[3,3,-8.84]}/>

    {/* ── LEFT brick wall — framed photos ── */}
    <Photo3 pos={[-6.86,2.9,-2]}  rot={Math.PI/2}/>
    <Photo5 pos={[-6.86,2.9,1]}   rot={Math.PI/2}/>
    <VintagePoster pos={[-6.86,2.7,4]} rot={Math.PI/2} label={"ESPRESSO\nPERFECTION"} accent="#D4A574"/>

    {/* ── RIGHT wall — photos in the back half (windows fill the front) ── */}
    <Photo6 pos={[6.86,2.9,-3]} rot={-Math.PI/2}/>
    <Photo7 pos={[6.86,2.9,-6]} rot={-Math.PI/2}/>
    <VintagePoster pos={[6.86,2.7,-8]} rot={-Math.PI/2} label={"FRESH BAKED\nDAILY"} accent="#f0c060" bg="#1a1208"/>

    {/* ── "OPEN" sign on left brick wall, near front ── */}
    <mesh position={[-6.84,3.6,6.5]} rotation={[0,Math.PI/2,0]} castShadow>
      <boxGeometry args={[1.4,0.5,0.05]}/><meshStandardMaterial color="#1a1410" roughness={0.4}/>
    </mesh>
    <Text position={[-6.78,3.6,6.5]} rotation={[0,Math.PI/2,0]} fontSize={0.26} color="#ff9a3c"
      anchorX="center" anchorY="middle" letterSpacing={0.12}>
      OPEN
    </Text>
    <pointLight position={[-6.4,3.6,6.5]} intensity={2} distance={3} color="#ff9a3c"/>
  </group>
);

// ─── POTTED PLANT — fuller ────────────────────────────────────────────────────
const Plant = ({ pos, scale=1 }) => {
  const leavesRef = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    leavesRef.current.forEach((l,i)=>{
      if(l) l.rotation.z = Math.sin(t*0.4+i*0.8)*0.04;
    });
  });
  return (
    <group position={pos} scale={scale}>
      {/* terracotta pot */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22,0.17,0.42,20]}/>
        <meshStandardMaterial color="#b05a30" roughness={0.85}/>
      </mesh>
      {/* soil */}
      <mesh position={[0,0.21,0]}>
        <cylinderGeometry args={[0.21,0.21,0.02,20]}/>
        <meshStandardMaterial color="#2a1a0a" roughness={0.98}/>
      </mesh>
      {/* stem */}
      <mesh position={[0,0.55,0]} castShadow>
        <cylinderGeometry args={[0.04,0.04,0.55,10]}/>{wood('#2d5016')}
      </mesh>
      {/* leaves */}
      {Array.from({length:8},(_,i)=>(
        <mesh key={i} ref={el=>leavesRef.current[i]=el}
          position={[Math.sin(i/8*Math.PI*2)*0.38, 0.45+i*0.1, Math.cos(i/8*Math.PI*2)*0.38]}
          rotation={[Math.PI/3.5, i/8*Math.PI*2, 0]} castShadow>
          <boxGeometry args={[0.32,0.04,0.52]}/>
          <meshStandardMaterial color={i%2===0?'#3a8a1a':'#2a6a12'} roughness={0.72}/>
        </mesh>
      ))}
    </group>
  );
};

// ─── HANGING PLANTS FROM CEILING ─────────────────────────────────────────────
const HangingPlant = ({ pos }) => {
  const vineRef = useRef();
  useFrame(({ clock }) => {
    if(vineRef.current) vineRef.current.rotation.z = Math.sin(clock.getElapsedTime()*0.3)*0.025;
  });
  return (
    <group position={pos} ref={vineRef}>
      {/* wire */}
      <mesh castShadow>
        <cylinderGeometry args={[0.008,0.008,1.1,8]}/>{metal('#3a3030')}
      </mesh>
      {/* pot */}
      <mesh position={[0,-0.7,0]} castShadow>
        <cylinderGeometry args={[0.14,0.1,0.2,16]}/>
        <meshStandardMaterial color="#b05a30" roughness={0.85}/>
      </mesh>
      {/* trailing leaves */}
      {Array.from({length:6},(_,i)=>(
        <mesh key={i}
          position={[Math.sin(i/6*Math.PI*2)*0.18, -0.75-i*0.15, Math.cos(i/6*Math.PI*2)*0.18]}
          rotation={[0.4,i/6*Math.PI*2,0]} castShadow>
          <boxGeometry args={[0.12,0.03,0.22]}/>
          <meshStandardMaterial color={i%2===0?'#3a8a1a':'#2d6010'} roughness={0.75}/>
        </mesh>
      ))}
    </group>
  );
};

// ─── WINDOWS (right wall — daylight streaming in) ────────────────────────────
const Windows = () => (
  <group>
    {[0,3,6].map((z,i)=>(
      <group key={i} position={[10.88,2.6,z]}>
        {/* glass pane */}
        <mesh rotation={[0,-Math.PI/2,0]}>
          <boxGeometry args={[1.6,2.4,0.06]}/>{glass()}
        </mesh>
        {/* frame */}
        <mesh rotation={[0,-Math.PI/2,0]} position={[0,0,-0.02]}>
          <boxGeometry args={[1.75,2.55,0.05]}/>{wood('#3a2810')}
        </mesh>
        {/* mullion cross */}
        <mesh rotation={[0,-Math.PI/2,0]} position={[0,0,0.02]}>
          <boxGeometry args={[1.6,0.05,0.04]}/>{wood('#3a2810')}
        </mesh>
        <mesh rotation={[0,-Math.PI/2,0]} position={[0,0,0.02]}>
          <boxGeometry args={[0.05,2.4,0.04]}/>{wood('#3a2810')}
        </mesh>
        {/* sun light */}
        <pointLight position={[-1,0,0]} intensity={2.2} distance={9} color="#ffe7b8"/>
      </group>
    ))}
  </group>
);

// ─── FLOATING DUST ───────────────────────────────────────────────────────────
const Dust = () => {
  const ref = useRef();
  const pts = useMemo(() => {
    const a = new Float32Array(120*3);
    for (let i=0;i<120;i++){
      const s=i*17.3;
      a[i*3]  =((s*127.1)%1-0.5)*18;
      a[i*3+1]=((s*311.7)%1)*5;
      a[i*3+2]=((s*74.9) %1-0.5)*16-3;
    }
    return a;
  },[]);
  useFrame(({clock})=>{
    if(!ref.current) return;
    const a=ref.current.geometry.attributes.position.array;
    const t=clock.getElapsedTime();
    for(let i=0;i<120;i++){
      a[i*3+1]+=0.003;
      a[i*3]+=Math.sin(t*0.3+i)*0.0004;
      if(a[i*3+1]>5) a[i*3+1]=0;
    }
    ref.current.geometry.attributes.position.needsUpdate=true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={120} array={pts} itemSize={3}/>
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#fff5e6" transparent opacity={0.5}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/>
    </points>
  );
};

// ─── SHARED INPUT STATE (module-level, no re-renders) ────────────────────────
const inputState = {
  // Pointer: full 360° accumulated yaw + pitch
  yaw:         0,   // radians — accumulated horizontal rotation
  pitch:       0,   // radians — vertical tilt, clamped
  lastX:       null,
  lastY:       null,
  // Scroll: drives camera Z depth into the cafe
  scrollDepth: 0,   // 0 = entrance, 1 = back of cafe
};

// ─── INTERACTIVE CAMERA — scroll depth + 360° look ───────────────────────────
// Camera Z range: +3 (entrance) → -8 (near back wall)
const Z_START =  3;
const Z_END   = -8;

const InteractiveCamera = () => {
  const { camera } = useThree();
  const camPos  = useRef(new THREE.Vector3(0, 1.7, Z_START));
  const lookTgt = useRef(new THREE.Vector3(0, 1.7, -4));
  const flRef   = useRef();

  useFrame(() => {
    // ── 1. Target Z from scroll ──
    const targetZ = THREE.MathUtils.lerp(Z_START, Z_END, inputState.scrollDepth);
    const targetPos = new THREE.Vector3(0, 1.7, targetZ);
    camPos.current.lerp(targetPos, 0.05);

    // ── 2. Look direction from accumulated yaw/pitch ──
    const dist = 6;
    const tx = camPos.current.x + Math.sin(inputState.yaw)   * Math.cos(inputState.pitch) * dist;
    const ty = camPos.current.y + Math.sin(inputState.pitch) * dist * 0.7;
    const tz = camPos.current.z - Math.cos(inputState.yaw)   * Math.cos(inputState.pitch) * dist;
    lookTgt.current.lerp(new THREE.Vector3(tx, ty, tz), 0.08);

    camera.position.copy(camPos.current);
    camera.lookAt(lookTgt.current);

    if (flRef.current) {
      flRef.current.position.set(camPos.current.x, camPos.current.y + 1, camPos.current.z);
    }
  });

  return <pointLight ref={flRef} intensity={2.5} distance={20} decay={1.4} color="#ffe8c0"/>;
};

// ─── FULL CAFE SCENE ─────────────────────────────────────────────────────────
const CafeScene = () => (
  <>
    <color attach="background" args={['#100a06']}/>
    <fog attach="fog" args={['#100a06',22,68]}/>

    {/* ── LIGHTING — dark moody cafe, pendants do the work ── */}
    <ambientLight intensity={0.5} color="#ffe8cc"/>
    <hemisphereLight args={['#ffe0b0','#1a1008',0.35]}/>
    <directionalLight position={[5,12,10]} intensity={0.55} color="#fff0e0" castShadow
      shadow-mapSize={[2048,2048]} shadow-camera-far={40}
      shadow-camera-left={-14} shadow-camera-right={14}
      shadow-camera-top={14} shadow-camera-bottom={-14}/>
    <directionalLight position={[-8,8,-5]} intensity={0.25} color="#ffd9a0"/>
    {/* warm accent from right windows — evening light */}
    <pointLight position={[6,3,2]} intensity={1.8} distance={11} color="#ffb066"/>

    <Suspense fallback={null}>
      <Floor/>
      <Walls/>
      <Windows/>
      <BackSign/>
      <Tables/>
      <Customers/>
      <Counter/>
      <Pendants/>
      <WallDecor/>

      {/* ── SOFA NOOK — right-back corner ── */}
      <Sofa pos={[4.8,0,-7.9]} rot={0}/>
      <group position={[4.8,0,-6.6]}>
        <mesh position={[0,0.42,0]} castShadow receiveShadow>
          <boxGeometry args={[1.1,0.05,0.6]}/>{wood('#3a2010')}
        </mesh>
        <mesh position={[0,0.22,0]} castShadow>
          <cylinderGeometry args={[0.03,0.03,0.42,8]}/>{metal()}
        </mesh>
      </group>

      {/* ── BOOKSHELF — left-back corner against back wall ── */}
      <Bookshelf pos={[-6.0,0,-8.4]} rot={0}/>

      {/* ── POTTED PLANTS in corners ── */}
      <Plant pos={[-6.3,0,5]}    scale={1.1}/>
      <Plant pos={[6.3,0,5]}     scale={1.0}/>
      <Plant pos={[6.3,0,-8.3]}  scale={1.05}/>

      {/* ── HANGING PLANTS from ceiling ── */}
      <HangingPlant pos={[-4,5.8,-3]}/>
      <HangingPlant pos={[4,5.8,-4]}/>
      <HangingPlant pos={[0,5.8,-6.5]}/>

      <Dust/>
      <ContactShadows position={[0,-.01,0]} opacity={0.4} scale={22}
        blur={2.2} far={8} resolution={512} color="#000000"/>
    </Suspense>

    <InteractiveCamera/>
  </>
);

// ─── NARRATION (static tagline while user explores) ──────────────────────────
const TAGLINE = 'Drag to look around · Scroll to walk inside';

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const SplashScreen = ({ onComplete }) => {
  const splashRef     = useRef();
  const wrapRef       = useRef();   // the outer div that receives pointer / scroll

  useEffect(() => {
    // ── Cinematic entrance: fade + subtle scale up from slightly zoomed-in ──
    gsap.fromTo(
      splashRef.current,
      { opacity: 0, scale: 1.06, filter: 'blur(8px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out' }
    );

    // ── Desktop: drag (mousedown+move) for full 360° ──────────────────────────
    let dragging = false;

    const onMouseDown = () => { dragging = true; };
    const onMouseUp   = () => {
      dragging = false;
      inputState.lastX = null;
      inputState.lastY = null;
    };

    const onMouseMove = (e) => {
      if (!dragging) return;
      if (inputState.lastX !== null) {
        const dx = e.clientX - inputState.lastX;
        const dy = e.clientY - inputState.lastY;
        inputState.yaw   -= dx * 0.006;               // full 360° horizontal
        inputState.pitch  = THREE.MathUtils.clamp(
          inputState.pitch + dy * 0.004, -0.55, 0.55  // ~±31° vertical
        );
      }
      inputState.lastX = e.clientX;
      inputState.lastY = e.clientY;
    };

    // ── Mobile/tablet: drag via touch ────────────────────────────────────────
    const onTouchStart = (e) => {
      inputState.lastX = e.touches[0].clientX;
      inputState.lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (inputState.lastX === null) return;
      const dx = e.touches[0].clientX - inputState.lastX;
      const dy = e.touches[0].clientY - inputState.lastY;
      inputState.yaw   -= dx * 0.006;
      inputState.pitch  = THREE.MathUtils.clamp(inputState.pitch + dy * 0.004, -0.55, 0.55);
      inputState.lastX  = e.touches[0].clientX;
      inputState.lastY  = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      inputState.lastX = null;
      inputState.lastY = null;
    };

    // ── Scroll: walk deeper into the cafe ────────────────────────────────────
    // We intercept wheel events on the splash container so the page doesn't scroll
    const onWheel = (e) => {
      e.preventDefault();
      inputState.scrollDepth = THREE.MathUtils.clamp(
        inputState.scrollDepth + e.deltaY * 0.0005, 0, 1
      );
    };

    const el = wrapRef.current;
    window.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('mouseup',    onMouseUp);
    window.addEventListener('mousemove',  onMouseMove, { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    el.addEventListener('wheel',      onWheel,      { passive: false });

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup',   onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
      el.removeEventListener('wheel',      onWheel);
    };
  }, []);

  const handleEnter = () => {
    gsap.to(splashRef.current, {
      opacity: 0,
      scale: 0.97,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power3.inOut',
      onComplete: () => { if (onComplete) onComplete(); },
    });
  };

  return (
    <div ref={splashRef} className="splash-screen">
      {/* Pointer / scroll capture layer */}
      <div ref={wrapRef} style={{ position:'absolute', inset:0, zIndex:2, cursor:'grab' }}>
        <Canvas
          style={{ position:'absolute', inset:0 }}
          shadows
          gl={{
            antialias: true, alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.4,
          }}
          camera={{ position:[0,1.7,3], fov:65 }}
        >
          <CafeScene />
        </Canvas>
      </div>

      {/* Top branding — sits above the canvas */}
      <div className="splash-text" style={{ zIndex:10, pointerEvents:'none' }}>
        <p className="splash-title">WELCOME TO</p>
        <h1 className="splash-cafe-name">Café Bliss</h1>
        <p className="splash-subtitle">{TAGLINE}</p>
      </div>

      {/* Enter button */}
      <button className="splash-enter-btn" style={{ zIndex:10 }} onClick={handleEnter}>
        Enter Café &nbsp;→
      </button>
    </div>
  );
};

export default SplashScreen;
