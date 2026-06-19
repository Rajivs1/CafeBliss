import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CafeCustomers = ({ scrollProgress }) => {
  return (
    <group>
      {/* Seated Customers - Each with unique timing offsets for natural independence */}
      <Customer
        position={[-3.5, 0, -3]}
        rotation={Math.PI / 6 + 0.05}
        animationType="talking"
        timeOffset={0}
        personalitySpeed={1.1}
      />
      <Customer
        position={[-2.5, 0, -3]}
        rotation={-Math.PI / 6 - 0.03}
        animationType="listening"
        timeOffset={2.4}
        personalitySpeed={0.9}
      />
      
      <Customer
        position={[3, 0, -3]}
        rotation={Math.PI + 0.08}
        animationType="laptop"
        hasLaptop
        timeOffset={5.1}
        personalitySpeed={0.7}
      />
      
      <Customer
        position={[3, 0, -6]}
        rotation={Math.PI / 2 - 0.07}
        animationType="drinking"
        timeOffset={3.8}
        personalitySpeed={1.05}
      />
      
      <Customer
        position={[-3, 0, -6]}
        rotation={-Math.PI / 3 + 0.04}
        animationType="reading"
        hasBook
        timeOffset={7.2}
        personalitySpeed={0.85}
      />
      
      {/* Window Seat Customers */}
      <Customer
        position={[-5, 0.45, 2]}
        rotation={Math.PI / 2 + 0.1}
        animationType="phone"
        isSeatedLow
        timeOffset={1.5}
        personalitySpeed={1.15}
      />
      
      <Customer
        position={[5, 0.45, 2]}
        rotation={-Math.PI / 2 - 0.06}
        animationType="relaxing"
        isSeatedLow
        timeOffset={4.7}
        personalitySpeed={0.8}
      />
      
      {/* Barista Behind Counter */}
      <Barista position={[-3.5, 0, -2.8]} />
      
      {/* Walking Customer (optional) */}
      <WalkingCustomer scrollProgress={scrollProgress} />
    </group>
  );
};

// Individual Customer Component with Natural Human Realism
const Customer = ({ 
  position, 
  rotation, 
  animationType, 
  hasLaptop, 
  hasBook,
  isSeatedLow,
  timeOffset = 0,
  personalitySpeed = 1.0
}) => {
  const headRef = useRef();
  const bodyRef = useRef();
  const armLeftRef = useRef();
  const armRightRef = useRef();
  
  // Random subtle variations per customer for uniqueness
  const idleVariation = useRef({
    headTiltX: (Math.random() - 0.5) * 0.04,
    headTiltY: (Math.random() - 0.5) * 0.06,
    shoulderHeight: (Math.random() - 0.5) * 0.02,
    postureSlump: Math.random() * 0.05,
    breathPhase: Math.random() * Math.PI * 2,
    blinkRate: 3 + Math.random() * 2,
    fidgetChance: Math.random()
  }).current;

  useFrame(({ clock }) => {
    const baseTime = clock.getElapsedTime();
    const time = baseTime + timeOffset;
    const speed = personalitySpeed;
    
    if (!headRef.current || !bodyRef.current) return;

    // Universal natural breathing - slightly irregular
    const breathCycle = Math.sin(time * 0.8 * speed + idleVariation.breathPhase) * 0.012 +
                       Math.sin(time * 0.3 * speed) * 0.008;
    bodyRef.current.scale.y = 1 + breathCycle;
    bodyRef.current.scale.z = 1 + breathCycle * 0.5;
    
    // Micro posture adjustments - very subtle, everyone shifts weight
    const postureShift = Math.sin(time * 0.15 * speed) * 0.015 + 
                        Math.sin(time * 0.08 * speed + 1.5) * 0.01;
    bodyRef.current.rotation.z = postureShift + idleVariation.postureSlump * 0.3;
    
    // Natural idle head drift - nobody stays perfectly still
    const headDriftY = Math.sin(time * 0.12 * speed + 0.5) * 0.03 + idleVariation.headTiltY;
    const headDriftX = Math.sin(time * 0.18 * speed + 1.2) * 0.02 + idleVariation.headTiltX;

    switch (animationType) {
      case 'talking': {
        // Natural conversation - varied head movements, emphasis gestures
        const talkEmphasis = Math.sin(time * 0.7 * speed);
        const talkIntensity = talkEmphasis > 0.6 ? 1.5 : 0.8;
        
        headRef.current.rotation.y = Math.sin(time * 1.3 * speed) * 0.15 * talkIntensity + headDriftY;
        headRef.current.rotation.x = Math.sin(time * 1.8 * speed) * 0.08 + headDriftX;
        headRef.current.rotation.z = Math.sin(time * 0.9 * speed) * 0.04;
        
        // Occasional hand gestures
        if (armLeftRef.current) {
          const gesture = Math.sin(time * 0.6 * speed);
          armLeftRef.current.rotation.x = -0.3 + (gesture > 0.7 ? gesture * 0.4 : 0);
          armLeftRef.current.rotation.z = 0.3 + (gesture > 0.7 ? gesture * 0.2 : 0);
        }
        
        // Body lean during conversation
        bodyRef.current.rotation.x = Math.sin(time * 0.5 * speed) * 0.04;
        break;
      }
        
      case 'listening': {
        // Attentive but not static - subtle nods, occasional looks around
        const nodCycle = Math.sin(time * 0.8 * speed);
        const lookAway = Math.sin(time * 0.15 * speed);
        
        headRef.current.rotation.x = (nodCycle > 0.5 ? nodCycle * 0.12 : 0.02) + headDriftX;
        headRef.current.rotation.y = (lookAway > 0.85 ? lookAway * 0.2 : 0.05) + headDriftY;
        
        // Occasional thoughtful touches to face
        if (armLeftRef.current && Math.sin(time * 0.12) > 0.93) {
          armLeftRef.current.rotation.x = -0.8;
          armLeftRef.current.rotation.z = 0.6;
        } else if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.2 + Math.sin(time * 0.3) * 0.05;
          armLeftRef.current.rotation.z = 0.3;
        }
        break;
      }
        
      case 'laptop': {
        // Working - head down but shifts occasionally, realistic typing
        const lookUpMoment = Math.sin(time * 0.1 * speed);
        const thinkingPause = lookUpMoment > 0.88;
        
        headRef.current.rotation.x = thinkingPause ? -0.1 : (-0.35 + Math.sin(time * 0.4) * 0.06 + headDriftX);
        headRef.current.rotation.y = (thinkingPause ? Math.sin(time * 2) * 0.15 : Math.sin(time * 0.3) * 0.05) + headDriftY;
        
        // Realistic typing - varied rhythm, pauses
        const typingIntensity = Math.abs(Math.sin(time * 0.25 * speed));
        const typingPause = typingIntensity < 0.3;
        
        if (armRightRef.current) {
          armRightRef.current.rotation.x = typingPause ? -0.6 : (-0.5 + Math.sin(time * 7.5 * speed) * 0.12 * typingIntensity);
          armRightRef.current.rotation.z = -0.1 + Math.sin(time * 4 * speed) * 0.05;
        }
        
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = typingPause ? -0.6 : (-0.5 + Math.sin(time * 7.5 * speed + Math.PI) * 0.12 * typingIntensity);
          armLeftRef.current.rotation.z = 0.1 + Math.sin(time * 4 * speed + 1) * 0.05;
        }
        
        // Occasional stretch or posture adjust
        if (lookUpMoment > 0.95) {
          bodyRef.current.rotation.x = -0.15; // Lean back
        }
        break;
      }
        
      case 'drinking': {
        // Natural drinking pattern - not robotic
        const drinkCycle = Math.sin(time * 0.25 * speed);
        const isDrinking = drinkCycle > 0.82;
        const reachingForCup = drinkCycle > 0.75 && drinkCycle < 0.82;
        const settingDown = drinkCycle > 0.55 && drinkCycle < 0.62;
        
        if (isDrinking) {
          headRef.current.rotation.x = -0.45;
          if (armRightRef.current) {
            armRightRef.current.rotation.x = -1.3;
            armRightRef.current.rotation.z = -0.3;
          }
        } else if (reachingForCup || settingDown) {
          headRef.current.rotation.x = -0.2 + headDriftX;
          if (armRightRef.current) {
            armRightRef.current.rotation.x = -0.8;
            armRightRef.current.rotation.z = -0.2;
          }
        } else {
          headRef.current.rotation.x = Math.sin(time * 0.6) * 0.08 + headDriftX;
          headRef.current.rotation.y = Math.sin(time * 0.3) * 0.1 + headDriftY;
          if (armRightRef.current) {
            armRightRef.current.rotation.x = -0.25 + Math.sin(time * 0.4) * 0.08;
            armRightRef.current.rotation.z = -0.1;
          }
        }
        break;
      }
        
      case 'reading': {
        // Reading with occasional page turns and looks up
        const pageTurnCycle = Math.sin(time * 0.18 * speed);
        const lookUpFromBook = Math.sin(time * 0.08 * speed);
        const turningPage = pageTurnCycle > 0.92;
        const lookingUp = lookUpFromBook > 0.9;
        
        if (lookingUp) {
          headRef.current.rotation.x = 0.05 + headDriftX;
          headRef.current.rotation.y = Math.sin(time * 2) * 0.2 + headDriftY;
        } else {
          headRef.current.rotation.x = -0.52 + Math.sin(time * 0.35 * speed) * 0.08 + headDriftX;
          headRef.current.rotation.y = Math.sin(time * 0.2 * speed) * 0.06 + headDriftY;
        }
        
        // Page turning animation
        if (turningPage && armRightRef.current) {
          const turnProgress = (pageTurnCycle - 0.92) / 0.08;
          armRightRef.current.rotation.z = turnProgress * 0.5;
          armRightRef.current.rotation.x = -0.6 + turnProgress * 0.3;
        } else if (armRightRef.current) {
          armRightRef.current.rotation.z = 0;
          armRightRef.current.rotation.x = -0.4 + Math.sin(time * 0.5) * 0.05;
        }
        break;
      }
        
      case 'phone': {
        // Phone usage - scrolling, occasional typing, looking focused
        const scrollCycle = Math.sin(time * 0.4 * speed);
        const typing = scrollCycle < -0.7;
        
        headRef.current.rotation.x = -0.48 + Math.sin(time * 0.3) * 0.04 + headDriftX;
        headRef.current.rotation.y = Math.sin(time * 0.15) * 0.05 + headDriftY;
        
        // Thumb scrolling/typing
        if (armRightRef.current) {
          if (typing) {
            armRightRef.current.rotation.x = -0.85 + Math.sin(time * 12 * speed) * 0.03;
          } else {
            armRightRef.current.rotation.x = -0.82 + Math.sin(time * 1.8 * speed) * 0.06;
          }
        }
        
        // Other arm resting
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.3 + Math.sin(time * 0.4) * 0.05;
        }
        break;
      }
        
      case 'relaxing': {
        // Relaxed posture - leaned back, occasional sips, looking around
        const lookAroundCycle = Math.sin(time * 0.1 * speed);
        const sipCycle = Math.sin(time * 0.15 * speed);
        const takingSip = sipCycle > 0.88;
        
        bodyRef.current.rotation.x = -0.12 + Math.sin(time * 0.25) * 0.03;
        
        if (takingSip) {
          headRef.current.rotation.x = -0.35;
          if (armRightRef.current) {
            armRightRef.current.rotation.x = -1.1;
          }
        } else {
          headRef.current.rotation.x = 0.08 + Math.sin(time * 0.25 * speed) * 0.06 + headDriftX;
          headRef.current.rotation.y = lookAroundCycle * 0.25 + headDriftY;
          if (armRightRef.current) {
            armRightRef.current.rotation.x = -0.2 + Math.sin(time * 0.3) * 0.05;
          }
        }
        break;
      }
        
      default:
        // Default natural idle
        headRef.current.rotation.y = Math.sin(time * 0.4 * speed) * 0.1 + headDriftY;
        headRef.current.rotation.x = Math.sin(time * 0.5 * speed) * 0.06 + headDriftX;
        bodyRef.current.rotation.z = Math.sin(time * 0.6 * speed) * 0.02;
    }
    
    // Random micro-fidgets for all customers
    if (idleVariation.fidgetChance > 0.7 && Math.sin(time * 0.07) > 0.96) {
      bodyRef.current.rotation.y = Math.sin(time * 3) * 0.02;
    }
  });

  const seatHeight = isSeatedLow ? 0.45 : 0.5;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body (Torso) */}
      <mesh ref={bodyRef} position={[0, seatHeight + 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.4, 16]} />
        <meshStandardMaterial
          color="#4a5568"
          roughness={0.8}
        />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, seatHeight + 0.65, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.7}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, seatHeight + 0.72, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.9}
        />
      </mesh>
      
      {/* Arms */}
      <mesh 
        ref={armLeftRef}
        position={[-0.18, seatHeight + 0.4, 0]}
        rotation={[0, 0, 0.3]}
        castShadow
      >
        <cylinderGeometry args={[0.035, 0.03, 0.35, 12]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.7}
        />
      </mesh>
      
      <mesh
        ref={armRightRef}
        position={[0.18, seatHeight + 0.4, 0]}
        rotation={[0, 0, -0.3]}
        castShadow
      >
        <cylinderGeometry args={[0.035, 0.03, 0.35, 12]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.7}
        />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.08, seatHeight - 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.5, 12]} />
        <meshStandardMaterial
          color="#2d3748"
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0.08, seatHeight - 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.5, 12]} />
        <meshStandardMaterial
          color="#2d3748"
          roughness={0.8}
        />
      </mesh>
      
      {/* Props */}
      {hasLaptop && (
        <mesh position={[0, seatHeight + 0.18, 0.25]} rotation={[-Math.PI / 3, 0, 0]} castShadow>
          <boxGeometry args={[0.25, 0.35, 0.015]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      )}
      
      {hasBook && (
        <mesh position={[0, seatHeight + 0.15, 0.2]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.02]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.9}
          />
        </mesh>
      )}
      
      {/* Coffee Cup */}
      {(animationType === 'drinking' || animationType === 'relaxing') && (
        <mesh position={[0.2, seatHeight + 0.1, 0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.028, 0.07, 16]} />
          <meshStandardMaterial
            color="#f5f5dc"
            roughness={0.4}
          />
        </mesh>
      )}
    </group>
  );
};

// Barista Component - Natural Working Behavior
const Barista = ({ position }) => {
  const headRef = useRef();
  const bodyRef = useRef();
  const armRightRef = useRef();
  const armLeftRef = useRef();
  
  // Barista's work rhythm variations
  const workPattern = useRef({
    lookAtCustomerPhase: Math.random() * Math.PI * 2,
    wipeCounterPhase: Math.random() * Math.PI * 2,
    adjustEquipmentPhase: Math.random() * Math.PI * 2,
    restPhase: Math.random() * Math.PI * 2,
    breathPhase: Math.random() * Math.PI * 2,
    baseEnergyLevel: 0.8 + Math.random() * 0.2
  }).current;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (headRef.current && bodyRef.current) {
      // Breathing - slightly heavier due to standing/working
      const breath = Math.sin(time * 1.1 + workPattern.breathPhase) * 0.018 +
                    Math.sin(time * 0.4) * 0.01;
      bodyRef.current.scale.y = 1 + breath;
      bodyRef.current.scale.z = 1 + breath * 0.6;
      
      // Weight shifting while standing
      const weightShift = Math.sin(time * 0.14) * 0.04 +
                         Math.sin(time * 0.07 + 1) * 0.025;
      bodyRef.current.rotation.z = weightShift;
      bodyRef.current.position.x = Math.sin(time * 0.11) * 0.02;
      
      // Work activity cycle - different tasks throughout
      const workCycle = (time * 0.25) % (Math.PI * 2);
      
      // Looking at customers / greeting behavior
      const lookAtCustomers = Math.sin(time * 0.12 + workPattern.lookAtCustomerPhase);
      const isGreeting = lookAtCustomers > 0.85;
      
      // Making coffee - focused on machine
      const makingCoffee = workCycle > 0 && workCycle < Math.PI / 2;
      
      // Wiping counter
      const wipingCounter = workCycle > Math.PI && workCycle < Math.PI * 1.3;
      
      // Organizing/restocking
      const organizing = workCycle > Math.PI * 1.5 && workCycle < Math.PI * 1.8;
      
      // Brief rest moment
      const resting = workCycle > Math.PI * 1.9;
      
      if (isGreeting) {
        // Look toward entrance/customers with welcoming posture
        headRef.current.rotation.y = 0.6 + Math.sin(time * 2) * 0.1;
        headRef.current.rotation.x = 0.05 + Math.sin(time * 1.5) * 0.05;
        
        // Slight wave or welcoming gesture
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.6 + Math.sin(time * 3) * 0.2;
          armLeftRef.current.rotation.z = 0.4 + Math.sin(time * 3) * 0.1;
        }
      } else if (makingCoffee) {
        // Focused on espresso machine
        headRef.current.rotation.y = 0.3 + Math.sin(time * 0.6) * 0.08;
        headRef.current.rotation.x = -0.15 + Math.sin(time * 0.8) * 0.05;
        
        // Operating machine with right hand
        if (armRightRef.current) {
          const operationCycle = Math.sin(time * 1.8);
          armRightRef.current.rotation.x = -0.9 + operationCycle * 0.35;
          armRightRef.current.rotation.z = -0.25 + operationCycle * 0.15;
        }
        
        // Left hand adjusting/supporting
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.7 + Math.sin(time * 1.3) * 0.2;
          armLeftRef.current.rotation.z = 0.2;
        }
        
        // Leaning slightly toward work
        bodyRef.current.rotation.x = 0.05;
      } else if (wipingCounter) {
        // Wiping motion - back and forth
        headRef.current.rotation.y = 0.15;
        headRef.current.rotation.x = -0.25 + Math.sin(time * 0.5) * 0.05;
        
        if (armRightRef.current) {
          const wipeMotion = Math.sin(time * 2.5 + workPattern.wipeCounterPhase);
          armRightRef.current.rotation.x = -0.8;
          armRightRef.current.rotation.z = -0.3 + wipeMotion * 0.4;
        }
        
        // Body moves slightly with wiping
        bodyRef.current.rotation.y = Math.sin(time * 2.5) * 0.08;
      } else if (organizing) {
        // Looking at shelf/organizing items
        headRef.current.rotation.y = -0.3 + Math.sin(time * 0.7) * 0.1;
        headRef.current.rotation.x = -0.1 + Math.sin(time * 0.5) * 0.06;
        
        // Reaching, placing items
        if (armRightRef.current) {
          armRightRef.current.rotation.x = -0.5 + Math.sin(time * 1.2) * 0.3;
          armRightRef.current.rotation.y = 0.2;
        }
        
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.4 + Math.sin(time * 0.9 + 1) * 0.25;
        }
      } else if (resting) {
        // Brief pause - checking phone, looking around, or just breathing
        headRef.current.rotation.y = Math.sin(time * 0.3) * 0.25;
        headRef.current.rotation.x = 0.08 + Math.sin(time * 0.4) * 0.06;
        
        // Hands resting on counter or hip
        if (armRightRef.current) {
          armRightRef.current.rotation.x = -0.3;
          armRightRef.current.rotation.z = -0.15;
        }
        
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.25;
          armLeftRef.current.rotation.z = 0.3; // Hand on hip
        }
        
        // Slight lean back - relaxed moment
        bodyRef.current.rotation.x = -0.04;
      } else {
        // Default working posture
        headRef.current.rotation.y = 0.25 + Math.sin(time * 0.4) * 0.12;
        headRef.current.rotation.x = -0.05 + Math.sin(time * 0.7) * 0.06;
        
        // General working hand movements
        if (armRightRef.current) {
          armRightRef.current.rotation.x = -0.65 + Math.sin(time * 1.1) * 0.25;
          armRightRef.current.rotation.z = -0.2 + Math.sin(time * 0.9) * 0.1;
        }
        
        if (armLeftRef.current) {
          armLeftRef.current.rotation.x = -0.4 + Math.sin(time * 0.8) * 0.15;
          armLeftRef.current.rotation.z = 0.25;
        }
      }
      
      // Micro adjustments - nobody stands perfectly still
      const microAdjust = Math.sin(time * 3.7) * 0.008 + Math.cos(time * 4.2) * 0.006;
      bodyRef.current.position.y = microAdjust;
    }
  });

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.14, 0.45, 16]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>
      
      {/* Apron */}
      <mesh position={[0, 0.8, 0.15]} castShadow>
        <boxGeometry args={[0.28, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.85}
        />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.22, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#2d1810"
          roughness={0.92}
        />
      </mesh>
      
      {/* Cap/Hat */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.11, 0.08, 16]} />
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.8}
        />
      </mesh>
      
      {/* Arms */}
      <mesh
        ref={armLeftRef}
        position={[-0.2, 0.9, 0]}
        rotation={[-0.5, 0, 0.4]}
        castShadow
      >
        <cylinderGeometry args={[0.04, 0.035, 0.4, 12]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>
      
      <mesh
        ref={armRightRef}
        position={[0.2, 0.9, 0]}
        rotation={[-0.8, 0, -0.3]}
        castShadow
      >
        <cylinderGeometry args={[0.04, 0.035, 0.4, 12]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>
      
      {/* Legs (partially visible behind counter) */}
      <mesh position={[-0.08, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.7, 12]} />
        <meshStandardMaterial
          color="#2d3748"
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0.08, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.7, 12]} />
        <meshStandardMaterial
          color="#2d3748"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

// Walking Customer (appears occasionally)
const WalkingCustomer = ({ scrollProgress }) => {
  const groupRef = useRef();
  const legLeftRef = useRef();
  const legRightRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (!groupRef.current) return;
    
    // Walking animation - only visible during certain scroll ranges
    const walkProgress = (scrollProgress - 0.5) * 4; // Walk between 50-75% scroll
    
    if (walkProgress > 0 && walkProgress < 1) {
      // Walking path from entrance toward counter
      const x = THREE.MathUtils.lerp(0, -2, walkProgress);
      const z = THREE.MathUtils.lerp(4, 0, walkProgress);
      groupRef.current.position.set(x, 0, z);
      
      // Rotation to face walking direction
      groupRef.current.rotation.y = Math.PI;
      
      // Walking leg animation
      if (legLeftRef.current && legRightRef.current) {
        const walkSpeed = 4;
        legLeftRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.5;
        legRightRef.current.rotation.x = Math.sin(time * walkSpeed + Math.PI) * 0.5;
      }
      
      // Visible
      groupRef.current.visible = true;
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Body */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.4, 16]} />
        <meshStandardMaterial
          color="#6b7280"
          roughness={0.8}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#d4a089"
          roughness={0.7}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.22, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#4a3520"
          roughness={0.9}
        />
      </mesh>
      
      {/* Arms (swinging while walking) */}
      <mesh position={[-0.18, 0.9, 0]} rotation={[0.3, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.35, 12]} />
        <meshStandardMaterial color="#d4a089" roughness={0.7} />
      </mesh>
      
      <mesh position={[0.18, 0.9, 0]} rotation={[-0.3, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.35, 12]} />
        <meshStandardMaterial color="#d4a089" roughness={0.7} />
      </mesh>
      
      {/* Legs (animated) */}
      <mesh ref={legLeftRef} position={[-0.08, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.7, 12]} />
        <meshStandardMaterial color="#2d3748" roughness={0.8} />
      </mesh>
      
      <mesh ref={legRightRef} position={[0.08, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.7, 12]} />
        <meshStandardMaterial color="#2d3748" roughness={0.8} />
      </mesh>
    </group>
  );
};

export default CafeCustomers;
