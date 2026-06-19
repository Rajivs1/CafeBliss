import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import CafeBuilding from './CafeBuilding';
import CafeInterior from './CafeInterior';
import CafeCounter from './CafeCounter';
import CafeLighting from './CafeLighting';
import CafeCustomers from './CafeCustomers';
import EnvironmentEffects from './EnvironmentEffects';

const CafeScene = ({ scrollProgress }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const prevScrollRef = useRef(0);
  
  // Camera personality - subtle unique characteristics
  const cameraPersonality = useRef({
    breathRate: 0.75 + Math.random() * 0.3,
    headBobAmount: 0.8 + Math.random() * 0.4,
    swayPhase: Math.random() * Math.PI * 2,
    blinkPhase: Math.random() * Math.PI * 2,
    curiosityFactor: Math.random(),
    steadiness: 0.7 + Math.random() * 0.3
  }).current;
  
  // Natural human-like camera movement with organic imperfections
  useFrame(({ clock }) => {
    const progress = scrollProgress;
    const smoothProgress = THREE.MathUtils.lerp(
      prevScrollRef.current,
      progress,
      0.075 // Slightly heavier inertia - more human
    );
    prevScrollRef.current = smoothProgress;

    const time = clock.getElapsedTime();
    
    // Natural body micro-movements (NOT camera shake - subtle human presence)
    // Breathing cycle - chest rising/falling affects camera height
    const breathCycle = Math.sin(time * cameraPersonality.breathRate + cameraPersonality.swayPhase) * 0.004 +
                       Math.sin(time * cameraPersonality.breathRate * 0.5) * 0.002;
    
    // Heart beat - barely perceptible
    const heartBeat = Math.sin(time * 4.5 + cameraPersonality.blinkPhase) * 0.0003;
    
    // Natural sway - we don't stand perfectly still
    const bodySway = Math.sin(time * 0.32) * 0.005 + Math.sin(time * 0.17 + 1) * 0.003;
    const lateralSway = Math.sin(time * 0.25 + cameraPersonality.swayPhase) * 0.004;
    
    // Micro head bobbing - very subtle
    const headBob = Math.sin(time * 0.9 * cameraPersonality.headBobAmount) * 0.0015 +
                   Math.cos(time * 0.6 * cameraPersonality.headBobAmount + 1) * 0.001;
    
    // Eye saccades - tiny unconscious eye movements
    const eyeMovementX = Math.sin(time * 2.3 + cameraPersonality.curiosityFactor * 5) * 0.0008;
    const eyeMovementY = Math.sin(time * 1.8 + cameraPersonality.curiosityFactor * 3 + 1) * 0.0006;
    
    // Combine all micro-movements
    const totalHeightOffset = breathCycle + headBob + heartBeat;
    const totalLateralOffset = lateralSway + eyeMovementX;
    const totalForwardOffset = bodySway + eyeMovementY;

    // Stage 1: Approach (0-0.25) - Natural walking approach
    if (smoothProgress <= 0.25) {
      const t = smoothProgress / 0.25;
      // Natural acceleration - we don't start moving instantly
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      
      // Walking adds more pronounced movement
      const walkBob = Math.sin(time * 2.2 * 2) * 0.008 * t;
      const walkSway = Math.sin(time * 1.1) * 0.012 * t;
      
      camera.position.set(
        THREE.MathUtils.lerp(0, 0, eased) + totalLateralOffset + walkSway,
        THREE.MathUtils.lerp(1.72, 1.68, eased) + totalHeightOffset + walkBob,
        THREE.MathUtils.lerp(25, 8, eased) + totalForwardOffset
      );
      
      // Natural gaze - looking ahead with slight curiosity
      const lookTarget = new THREE.Vector3(
        eyeMovementX * 3 + Math.sin(time * 0.4 + cameraPersonality.curiosityFactor * 2) * 0.015,
        1.5 + breathCycle * 0.5 + eyeMovementY * 2,
        0
      );
      camera.lookAt(lookTarget);
    }
    // Stage 2: Entrance (0.25-0.4) - Careful entry, slowing down
    else if (smoothProgress <= 0.4) {
      const t = (smoothProgress - 0.25) / 0.15;
      const eased = 1 - Math.pow(1 - t, 3); // Ease out - slowing down
      
      // Reducing walk movement as we slow
      const slowingWalk = (1 - t) * 0.01;
      const cautionPause = Math.sin(time * 0.6) * 0.003;
      
      camera.position.set(
        THREE.MathUtils.lerp(0, 0, eased) + totalLateralOffset + cautionPause,
        THREE.MathUtils.lerp(1.68, 1.65, eased) + totalHeightOffset + slowingWalk,
        THREE.MathUtils.lerp(8, 3, eased) + totalForwardOffset
      );
      
      // Looking around the entrance - natural curiosity
      const curiousLook = Math.sin(time * 0.5 + cameraPersonality.curiosityFactor * 3) * 0.08;
      const lookTarget = new THREE.Vector3(
        eyeMovementX * 4 + curiousLook,
        1.5 + breathCycle + eyeMovementY * 3,
        -3
      );
      camera.lookAt(lookTarget);
    }
    // Stage 3: Interior Discovery (0.4-0.65) - Curious exploration, taking it all in
    else if (smoothProgress <= 0.65) {
      const t = (smoothProgress - 0.4) / 0.25;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      
      // Slower, more deliberate movement - observing
      const observationSway = Math.sin(time * 0.35 + cameraPersonality.swayPhase) * 0.008;
      const weightShift = Math.sin(time * 0.18) * 0.006;
      
      camera.position.set(
        THREE.MathUtils.lerp(0, -2, eased) + totalLateralOffset + observationSway,
        THREE.MathUtils.lerp(1.65, 1.66, eased) + totalHeightOffset + weightShift,
        THREE.MathUtils.lerp(3, 0, eased) + totalForwardOffset
      );
      
      // Natural head turn - drawn to interesting features
      const attentionShift = Math.sin(time * 0.25 + cameraPersonality.curiosityFactor * 4);
      const lookX = THREE.MathUtils.lerp(0, -1, eased) + 
                   attentionShift * 0.12 * cameraPersonality.curiosityFactor + 
                   eyeMovementX * 4;
      const lookZ = THREE.MathUtils.lerp(-3, -2, eased) + Math.sin(time * 0.15) * 0.05;
      const lookY = 1.4 + breathCycle + 
                   Math.sin(time * 0.22 + cameraPersonality.blinkPhase) * 0.04 + 
                   eyeMovementY * 3;
      
      camera.lookAt(lookX, lookY, lookZ);
    }
    // Stage 4: 360 Exploration (0.65-1.0) - Taking in the whole space
    else {
      const t = (smoothProgress - 0.65) / 0.35;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      
      // Organic circular path - not perfectly circular
      const angle = eased * Math.PI * 2;
      const radiusBase = 5;
      const radiusVariation = Math.sin(angle * 2.7) * 0.18 + // Imperfect circle
                             Math.sin(angle * 5.3 + 1.2) * 0.08;
      const radius = radiusBase + radiusVariation;
      
      // Height variation - natural stepping, slight uneven floor
      const heightVariation = Math.sin(angle * 4.1) * 0.04 + 
                             Math.sin(angle * 7.3 + 2) * 0.02;
      
      // Turning speed not constant - we slow down to look at interesting things
      const turnSpeedVariation = 0.95 + Math.sin(angle * 3.2) * 0.05;
      
      const x = Math.sin(angle * turnSpeedVariation) * radius + totalLateralOffset;
      const z = Math.cos(angle * turnSpeedVariation) * radius + totalForwardOffset;
      const y = 1.65 + 
               Math.sin(eased * Math.PI) * 0.08 + // Overall movement arc
               heightVariation + 
               totalHeightOffset;
      
      camera.position.set(x, y, z);
      
      // Gaze follows movement with natural lag and curiosity
      const gazeLag = 0.12; // Head turns slightly after body
      const gazeAngle = angle - gazeLag;
      
      // Points of interest - we naturally look at people, decor, etc.
      const pointOfInterest = Math.sin(time * 0.18 + cameraPersonality.curiosityFactor * 5);
      const lookingAtCustomer = pointOfInterest > 0.7;
      const lookingAtDecor = pointOfInterest < -0.6;
      
      let lookTarget = new THREE.Vector3(
        Math.sin(gazeAngle) * 0.3 + eyeMovementX * 5,
        1.5 + breathCycle + eyeMovementY * 4,
        -2 + Math.cos(gazeAngle) * 0.2
      );
      
      // Occasionally look at specific features
      if (lookingAtCustomer) {
        // Glancing at a customer
        lookTarget.x += Math.sin(time * 2) * 0.15;
        lookTarget.y += Math.sin(time * 1.5) * 0.08;
      } else if (lookingAtDecor) {
        // Looking up at decor or lighting
        lookTarget.y += 0.4 + Math.sin(time * 0.8) * 0.1;
      }
      
      // Add micro saccades even while looking around
      lookTarget.x += Math.sin(time * 3.2) * 0.008;
      lookTarget.y += Math.sin(time * 2.7 + 1) * 0.006;
      
      camera.lookAt(lookTarget);
    }
  });

  return (
    <group ref={groupRef}>
      {/* HDR Environment Lighting */}
      <Environment
        preset="apartment"
        background={false}
        blur={0.8}
      />
      
      {/* Cafe Lighting System */}
      <CafeLighting scrollProgress={scrollProgress} />
      
      {/* Main Cafe Building (Exterior) */}
      <CafeBuilding scrollProgress={scrollProgress} />
      
      {/* Interior Elements */}
      <CafeInterior scrollProgress={scrollProgress} />
      
      {/* Counter and Equipment */}
      <CafeCounter scrollProgress={scrollProgress} />
      
      {/* Animated Customers and Barista */}
      <CafeCustomers scrollProgress={scrollProgress} />
      
      {/* Environmental Effects */}
      <EnvironmentEffects scrollProgress={scrollProgress} />
      
      {/* Contact Shadows - softer, more natural */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.32}
        scale={30}
        blur={2.5}
        far={10}
        resolution={256}
        color="#000000"
      />
      
      {/* Atmospheric fog for depth - warm interior tones */}
      <fog attach="fog" args={['#221c18', 18, 45]} />
    </group>
  );
};

export default CafeScene;
