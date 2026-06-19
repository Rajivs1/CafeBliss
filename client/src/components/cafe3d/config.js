/**
 * 3D Cafe Scene Configuration
 * Centralized settings for easy customization and performance tuning
 */

export const CafeConfig = {
  // Camera Settings
  camera: {
    fov: 55,
    near: 0.1,
    far: 1000,
    initialPosition: [0, 1.8, 25],
    eyeLevel: 1.65,
  },

  // Scroll Animation Stages
  scrollStages: {
    approach: { start: 0, end: 0.25 },
    entrance: { start: 0.25, end: 0.4 },
    interior: { start: 0.4, end: 0.65 },
    exploration: { start: 0.65, end: 1.0 },
  },

  // Lighting Settings
  lighting: {
    ambient: {
      intensity: 0.3,
      color: '#fff5e6',
    },
    sun: {
      intensity: 1.2,
      color: '#fff5e6',
      position: [10, 15, 10],
    },
    pendant: {
      intensity: 1.8,
      distance: 3,
      color: '#fff5e6',
      flickerAmount: 0.02,
    },
    counter: {
      intensity: 1.5,
      angle: 0.6,
      penumbra: 0.5,
    },
  },

  // Shadow Quality
  shadows: {
    main: {
      mapSize: 2048,
      bias: -0.0001,
    },
    secondary: {
      mapSize: 512,
      bias: -0.001,
    },
    contact: {
      opacity: 0.4,
      scale: 30,
      blur: 2,
    },
  },

  // Environment Effects
  effects: {
    dustParticles: {
      count: 150,
      size: 0.015,
      opacity: 0.4,
    },
    sparkles: {
      window: { count: 30, size: 2, speed: 0.3, opacity: 0.3 },
      interior: { count: 20, size: 1.5, speed: 0.2, opacity: 0.2 },
      counter: { count: 15, size: 1, speed: 0.4, opacity: 0.4 },
    },
    fog: {
      color: '#1a1410',
      near: 20,
      far: 50,
    },
  },

  // Materials
  materials: {
    wood: {
      color: '#5a4a3a',
      roughness: 0.8,
      metalness: 0.1,
    },
    metal: {
      color: '#1a1410',
      roughness: 0.3,
      metalness: 0.7,
    },
    glass: {
      color: '#b8e5f5',
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
    },
    fabric: {
      color: '#8B7355',
      roughness: 0.9,
      metalness: 0.05,
    },
  },

  // Customer Positions and Types
  customers: [
    { pos: [-3.5, 0, -3], rot: Math.PI / 6, type: 'talking' },
    { pos: [-2.5, 0, -3], rot: -Math.PI / 6, type: 'listening' },
    { pos: [3, 0, -3], rot: Math.PI, type: 'laptop', props: { hasLaptop: true } },
    { pos: [3, 0, -6], rot: Math.PI / 2, type: 'drinking' },
    { pos: [-3, 0, -6], rot: -Math.PI / 3, type: 'reading', props: { hasBook: true } },
    { pos: [-5, 0.45, 2], rot: Math.PI / 2, type: 'phone', props: { isSeatedLow: true } },
    { pos: [5, 0.45, 2], rot: -Math.PI / 2, type: 'relaxing', props: { isSeatedLow: true } },
  ],

  // Barista Position
  barista: {
    position: [-3.5, 0, -2.8],
    rotation: Math.PI,
  },

  // Walking Customer Settings
  walkingCustomer: {
    scrollStart: 0.5,
    scrollEnd: 0.75,
    startPos: [0, 0, 4],
    endPos: [-2, 0, 0],
    walkSpeed: 4,
  },

  // Animation Settings
  animations: {
    breathing: {
      speed: 1.2,
      amplitude: 0.015,
    },
    talking: {
      headSpeed: 1.5,
      headAmplitude: 0.15,
      bodySpeed: 0.8,
      bodyAmplitude: 0.03,
    },
    typing: {
      speed: 8,
      amplitude: 0.1,
    },
    drinking: {
      threshold: 0.7,
      cycleSpeed: 0.3,
    },
    walking: {
      speed: 4,
      legAmplitude: 0.5,
    },
  },

  // Performance Settings
  performance: {
    shadowQuality: 'high', // 'low', 'medium', 'high'
    particleCount: 'full', // 'minimal', 'reduced', 'full'
    enableEffects: true,
    enableSteam: true,
    enableFlicker: true,
  },

  // Colors Palette
  colors: {
    primary: '#FFD700', // Gold
    secondary: '#FFC107', // Amber
    wood: '#5a4a3a',
    darkWood: '#3d2817',
    metal: '#1a1410',
    wall: '#2a2420',
    warmLight: '#fff5e6',
    accent: '#ff9f5a',
    skin: '#d4a089',
    hair: '#2d1810',
    fabric: '#4a5568',
  },

  // Building Dimensions
  building: {
    width: 12,
    height: 5,
    depth: 14,
    wallThickness: 0.3,
    doorWidth: 0.9,
    doorHeight: 3,
    windowSize: [3, 3.5],
  },

  // Interior Dimensions
  interior: {
    floorSize: [12, 14],
    tableRadius: 0.5,
    tableHeight: 0.75,
    chairSize: 0.4,
    counterSize: [3, 1, 0.6],
  },
};

// Performance Presets
export const PerformancePresets = {
  ultra: {
    shadowQuality: 'high',
    shadowMapSize: 2048,
    particleCount: 150,
    effectsEnabled: true,
    sparklesEnabled: true,
  },
  high: {
    shadowQuality: 'high',
    shadowMapSize: 2048,
    particleCount: 150,
    effectsEnabled: true,
    sparklesEnabled: true,
  },
  medium: {
    shadowQuality: 'medium',
    shadowMapSize: 1024,
    particleCount: 75,
    effectsEnabled: true,
    sparklesEnabled: false,
  },
  low: {
    shadowQuality: 'low',
    shadowMapSize: 512,
    particleCount: 30,
    effectsEnabled: false,
    sparklesEnabled: false,
  },
};

// Helper function to get performance settings
export const getPerformanceSettings = (preset = 'high') => {
  return PerformancePresets[preset] || PerformancePresets.high;
};

// Helper function to adjust settings based on device
export const getAdaptiveSettings = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isLowEnd = navigator.hardwareConcurrency <= 4;

  if (isMobile || isLowEnd) {
    return getPerformanceSettings('medium');
  }

  return getPerformanceSettings('high');
};

export default CafeConfig;
