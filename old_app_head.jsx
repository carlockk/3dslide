import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox, Text, useProgress, useTexture } from "@react-three/drei";
import * as THREE from "three";

const CARD_ITEMS = [
  {
    title: "Aurora Layer",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
    image: "https://picsum.photos/id/1015/900/1200",
    accent: "#38bdf8",
  },
  {
    title: "Signal Bloom",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam pellentesque ornare.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam pellentesque ornare sem lacinia quam venenatis vestibulum. Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Sed posuere consectetur est at lobortis.",
    image: "https://picsum.photos/id/1025/900/1200",
    accent: "#fb7185",
  },
  {
    title: "Echo Frame",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis. Nullam quis risus eget urna mollis ornare vel eu leo. Donec sed odio dui. Curabitur blandit tempus porttitor. Donec ullamcorper nulla non metus auctor fringilla.",
    image: "https://picsum.photos/id/1035/900/1200",
    accent: "#f59e0b",
  },
  {
    title: "North Drift",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Integer posuere erat a ante venenatis.",
    image: "https://picsum.photos/id/1043/900/1200",
    accent: "#a3e635",
  },
  {
    title: "Quiet Pulse",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.",
    image: "https://picsum.photos/id/1050/900/1200",
    accent: "#2dd4bf",
  },
  {
    title: "Static Tide",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras justo odio dapibus ac facilisis.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec sed odio dui. Vestibulum id ligula porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.",
    image: "https://picsum.photos/id/1062/900/1200",
    accent: "#c084fc",
  },
  {
    title: "Vector Mist",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget urna mollis.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget urna mollis ornare vel eu leo. Donec sed odio dui. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod.",
    image: "https://picsum.photos/id/1074/900/1200",
    accent: "#f97316",
  },
  {
    title: "Solar Thread",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna vel.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas faucibus mollis interdum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.",
    image: "https://picsum.photos/id/1084/900/1200",
    accent: "#60a5fa",
  },
  {
    title: "Drift Echo",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum. Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
    image: "https://picsum.photos/id/1080/900/1200",
    accent: "#22c55e",
  },
  {
    title: "Glass Harbor",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.",
    image: "https://picsum.photos/id/1069/900/1200",
    accent: "#e879f9",
  },
  {
    title: "Night Current",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus porta ac consectetur ac.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Sed posuere consectetur est at lobortis. Aenean eu leo quam.",
    image: "https://picsum.photos/id/1057/900/1200",
    accent: "#14b8a6",
  },
  {
    title: "Field Static",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.",
    image: "https://picsum.photos/id/1041/900/1200",
    accent: "#f43f5e",
  },
  {
    title: "Clear Horizon",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis est non commodo luctus.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Vestibulum id ligula porta felis euismod semper. Cras justo odio, dapibus ac facilisis in.",
    image: "https://picsum.photos/id/1039/900/1200",
    accent: "#facc15",
  },
  {
    title: "Pulse Archive",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum. Nullam quis risus eget urna mollis ornare vel eu leo. Sed posuere consectetur est at lobortis.",
    image: "https://picsum.photos/id/1020/900/1200",
    accent: "#38bdf8",
  },
  {
    title: "Soft Vector",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero a pharetra augue.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus. Aenean lacinia bibendum nulla sed consectetur.",
    image: "https://picsum.photos/id/1011/900/1200",
    accent: "#fb7185",
  },
  {
    title: "Copper Sky",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Curabitur blandit tempus porttitor. Maecenas faucibus mollis interdum. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in.",
    image: "https://picsum.photos/id/1003/900/1200",
    accent: "#f97316",
  },
];

const HELIX_SETTINGS = {
  centerX: 0.32,
  radius: 2.18,
  verticalGap: 0.8,
  angleStep: Math.PI * 0.44,
  travelTurns: Math.PI * 2.6,
};

const CARD_LAYOUT = {
  width: 1.62,
  height: 0.94,
  depth: 0.001,
  radius: 0.046,
  mediaWidth: 1.46,
  mediaHeight: 0.59,
};

const GALAXY_SETTINGS = {
  enabled: true,
  showLegacyAxisSystem: false,
  position: [0.04, 0.12, -1.45],
  rotation: [0.24, 0.1, -0.18],
  scale: 0.94,
  starCount: 6200,
  starSize: 0.042,
  radius: 4.8,
  branches: 4,
  spin: 1.2,
  randomness: 0.42,
  randomnessPower: 2.8,
  verticalThickness: 0.34,
  coreRadius: 0.88,
  coreIntensity: 1.35,
  coreFlattening: 0.46,
  nebulaCount: 18,
  nebulaRadius: 5.6,
  nebulaOpacity: 0.17,
  scrollResponseSpeed: 1.12,
  idleRotationSpeed: 0.028,
  innerColor: "#f8fbff",
  midColor: "#7dd3fc",
  outerColor: "#7c3aed",
  accentColor: "#22d3ee",
  warmCoreColor: "#ffd39e",
};

const CAMERA_SETTINGS = {
  desktop: {
    position: [0.8, 0.06, 8.95],
    fov: 25,
    lookAt: [0.48, -0.05, 0],
  },
  mobile: {
    position: [0.95, 0.12, 9.6],
    fov: 31,
    lookAt: [0.42, -0.04, 0],
  },
};

function useScrollMetrics() {
  const [metrics, setMetrics] = useState({ progress: 0, velocity: 0 });

  useEffect(() => {
    let rafId = 0;
    let idleTimeoutId = 0;
    const state = {
      lastY: window.scrollY,
      lastTime: performance.now(),
    };

    const updateMetrics = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
      const now = performance.now();
      const deltaY = window.scrollY - state.lastY;
      const deltaTime = Math.max((now - state.lastTime) / 1000, 1 / 240);
      const nextVelocity = THREE.MathUtils.clamp((deltaY / deltaTime) / 1600, -1, 1);

      state.lastY = window.scrollY;
      state.lastTime = now;

      setMetrics((current) => {
        const clampedProgress = THREE.MathUtils.clamp(nextProgress, 0, 1);
        const progressChanged = Math.abs(current.progress - clampedProgress) > 0.0005;
        const velocityChanged = Math.abs(current.velocity - nextVelocity) > 0.0005;

        if (!progressChanged && !velocityChanged) {
          return current;
        }

        return {
          progress: clampedProgress,
          velocity: nextVelocity,
        };
      });
    };

    const scheduleMetricsUpdate = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateMetrics);
    };

    const handleScroll = () => {
      scheduleMetricsUpdate();
      window.clearTimeout(idleTimeoutId);
      idleTimeoutId = window.setTimeout(() => {
        setMetrics((current) => (Math.abs(current.velocity) < 0.0005 ? current : { ...current, velocity: 0 }));
      }, 120);
    };

    scheduleMetricsUpdate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleMetricsUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(idleTimeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleMetricsUpdate);
    };
  }, []);

  return metrics;
}

function useVisibleCardIndex(scrollProgress, itemCount, damping = 7) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let previousTime = performance.now();
    let currentProgress = scrollProgress;

    const updateIndex = (now) => {
      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      currentProgress = THREE.MathUtils.damp(currentProgress, scrollProgress, damping, delta);

      const nextIndex = Math.round(currentProgress * (itemCount - 1));
      setVisibleIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));

      if (Math.abs(currentProgress - scrollProgress) > 0.0005) {
        frameId = requestAnimationFrame(updateIndex);
      }
    };

    frameId = requestAnimationFrame(updateIndex);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [scrollProgress, itemCount, damping]);

  return visibleIndex;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, [breakpoint]);

  return isMobile;
}

function CenteredCamera({ isMobile }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const settings = isMobile ? CAMERA_SETTINGS.mobile : CAMERA_SETTINGS.desktop;
    camera.position.set(...settings.position);
    camera.fov = settings.fov;
    target.set(...settings.lookAt);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera, isMobile, target]);

  return null;
}

function AxisGuide({ scrollProgress }) {
  const axisRef = useRef(null);
  const glowTexture = useMemo(() => createNebulaTexture(), []);
  const particleTexture = useMemo(() => createStarTexture(), []);
  const sunSurfaceRef = useRef(null);
  const moonRefs = useRef([]);
  const tempSunWorld = useRef(new THREE.Vector3());
  const tempMoonWorld = useRef(new THREE.Vector3());
  const tempSunCamera = useRef(new THREE.Vector3());
  const tempMoonCamera = useRef(new THREE.Vector3());
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(54 * 3);

    for (let index = 0; index < 54; index += 1) {
      const stride = index * 3;
      const radius = 0.58 + Math.random() * 0.42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[stride] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[stride + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.82;
      positions[stride + 2] = Math.cos(phi) * radius;
    }

    return positions;
  }, []);

  const moons = useMemo(
    () => [
      {
        orbitRadiusX: 0.3,
        orbitRadiusZ: 0.22,
        orbitHeight: 0.055,
        orbitTilt: [0.48, 0.12, 0.18],
        size: 0.03,
        color: "#b8c4d3",
        phase: 0.15,
        speed: 1,
      },
      {
        orbitRadiusX: 0.4,
        orbitRadiusZ: 0.27,
        orbitHeight: 0.07,
        orbitTilt: [-0.35, -0.18, 0.42],
        size: 0.022,
        color: "#94a3b8",
        phase: 2.15,
        speed: 1.18,
      },
      {
        orbitRadiusX: 0.5,
        orbitRadiusZ: 0.34,
        orbitHeight: 0.08,
        orbitTilt: [0.22, 0.3, -0.34],
        size: 0.026,
        color: "#cbd5e1",
        phase: 4.05,
        speed: 0.86,
      },
    ],
    [],
  );
  const moonBaseColors = useMemo(() => moons.map((moon) => new THREE.Color(moon.color)), [moons]);
  const silhouetteColor = useMemo(() => new THREE.Color("#000000"), []);

  useFrame((state, delta) => {
    if (!sunSurfaceRef.current || !axisRef.current) {
      return;
    }

    const targetRotationY = scrollProgress * HELIX_SETTINGS.travelTurns * 0.9;
    const targetRotationZ = (scrollProgress - 0.5) * 0.18;

    sunSurfaceRef.current.rotation.y = THREE.MathUtils.damp(
      sunSurfaceRef.current.rotation.y,
      targetRotationY,
      4.6,
      delta,
    );
    sunSurfaceRef.current.rotation.z = THREE.MathUtils.damp(
      sunSurfaceRef.current.rotation.z,
      targetRotationZ,
      4,
      delta,
    );

    moons.forEach((moon, index) => {
      const moonRef = moonRefs.current[index];
      if (!moonRef) {
        return;
      }

      const angle = state.clock.elapsedTime * moon.speed + moon.phase;
      moonRef.position.set(
        Math.cos(angle) * moon.orbitRadiusX,
        Math.sin(angle * 2) * moon.orbitHeight,
        Math.sin(angle) * moon.orbitRadiusZ,
      );

      axisRef.current.getWorldPosition(tempSunWorld.current);
      moonRef.getWorldPosition(tempMoonWorld.current);

      tempSunCamera.current.copy(tempSunWorld.current);
      tempMoonCamera.current.copy(tempMoonWorld.current);
      state.camera.worldToLocal(tempSunCamera.current);
      state.camera.worldToLocal(tempMoonCamera.current);

      const deltaX = tempMoonCamera.current.x - tempSunCamera.current.x;
      const deltaY = tempMoonCamera.current.y - tempSunCamera.current.y;
      const screenDistance = Math.hypot(deltaX, deltaY);
      const isInFront = tempMoonCamera.current.z > tempSunCamera.current.z;
      const overlap = 1 - THREE.MathUtils.smoothstep(screenDistance, 0.1, 0.22);
      const silhouetteStrength = isInFront ? overlap : 0;
      const moonMaterial = moonRef.material;

      if (moonMaterial) {
        moonMaterial.color.copy(moonBaseColors[index]).lerp(silhouetteColor, silhouetteStrength);
        moonMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.05, 0, silhouetteStrength);
      }
    });
  });

  return (
    <group ref={axisRef}>
      <pointLight position={[0, 0, 0]} intensity={10} distance={7.5} color="#ffb347" />

      <mesh scale={[1.08, 1.08, 1.08]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture ?? undefined}
          color="#ffb347"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={[0.82, 0.82, 0.82]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture ?? undefined}
          color="#ffcf75"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points scale={[0.58, 0.58, 0.58]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={particleTexture ?? undefined}
          color="#ffd27a"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={sunSurfaceRef}>
        <mesh>
          <sphereGeometry args={[0.155, 40, 40]} />
          <meshStandardMaterial
            color="#f7a53a"
            emissive="#ff8c1a"
            emissiveIntensity={1.15}
            roughness={0.96}
            metalness={0.01}
          />
        </mesh>

        <mesh position={[0.06, 0.025, 0.135]}>
          <sphereGeometry args={[0.026, 18, 18]} />
          <meshStandardMaterial
            color="#050505"
            emissive="#000000"
            emissiveIntensity={0}
            roughness={1}
            metalness={0}
          />
        </mesh>

        <mesh position={[-0.035, -0.03, 0.145]}>
          <sphereGeometry args={[0.014, 14, 14]} />
          <meshStandardMaterial
            color="#0c0c0c"
            emissive="#000000"
            emissiveIntensity={0}
            roughness={1}
            metalness={0}
          />
        </mesh>
      </group>

      <group>
        {moons.map((moon, index) => (
          <group key={index} rotation={moon.orbitTilt}>
            <mesh ref={(node) => (moonRefs.current[index] = node)}>
              <sphereGeometry args={[moon.size, 18, 18]} />
              <meshStandardMaterial
                color={moon.color}
                emissive="#101828"
                emissiveIntensity={0.05}
                roughness={0.95}
                metalness={0.02}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function buildSpiralGalaxy({
  count,
  radius,
  branches,
  spin,
  randomness,
  randomnessPower,
  verticalThickness,
  coreRadius,
  innerColor,
  midColor,
  outerColor,
  accentColor,
}) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const depthFactors = new Float32Array(count);
  const starTypes = new Uint8Array(count);
  const color = new THREE.Color();
  const inner = new THREE.Color(innerColor);
  const mid = new THREE.Color(midColor);
  const outer = new THREE.Color(outerColor);
  const accent = new THREE.Color(accentColor);
  const yellow = new THREE.Color("#ffd86b");
  const red = new THREE.Color("#ff5a4f");

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radiusRatio = Math.pow(Math.random(), 1.55);
    const particleRadius = radiusRatio * radius;
    const branchAngle = ((index % branches) / branches) * Math.PI * 2;
    const spinAngle = particleRadius * spin;
    const randomScale = Math.pow(Math.random(), randomnessPower) * randomness * radiusRatio;
    const randomX = (Math.random() < 0.5 ? -1 : 1) * randomScale * radius;
    const randomY = (Math.random() - 0.5) * verticalThickness * radius * (0.3 + radiusRatio * 1.2);
    const randomZ = (Math.random() < 0.5 ? -1 : 1) * randomScale * radius;
    const angle = branchAngle + spinAngle;
    const layerDepth = THREE.MathUtils.clamp((Math.random() - 0.5) * 2.35 + randomZ / Math.max(radius * 0.8, 0.001), -1, 1);

    positions[stride] = Math.cos(angle) * particleRadius + randomX;
    positions[stride + 1] = randomY;
    positions[stride + 2] = Math.sin(angle) * particleRadius + randomZ + layerDepth * 1.45;

    const coreMix = 1 - THREE.MathUtils.smoothstep(particleRadius, 0, coreRadius);
    const midMix = THREE.MathUtils.smoothstep(particleRadius, coreRadius * 0.7, radius * 0.58);
    color.copy(inner).lerp(mid, midMix).lerp(outer, radiusRatio * 0.9);

    if (Math.random() > 0.78) {
      color.lerp(accent, 0.25 + Math.random() * 0.35);
    }

    const typeRoll = Math.random();
    if (typeRoll > 0.965) {
      color.lerp(red, 0.62 + Math.random() * 0.18);
      starTypes[index] = 2;
    } else if (typeRoll > 0.89) {
      color.lerp(yellow, 0.52 + Math.random() * 0.16);
      starTypes[index] = 1;
    }

    color.offsetHSL(0, 0, coreMix * 0.12 + Math.random() * 0.04);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
    depthFactors[index] = layerDepth;
  }

  return { positions, colors, depthFactors, starTypes };
}

function splitGalaxyLayers({ positions, colors, depthFactors, starTypes }) {
  const buckets = {
    near: {
      normal: { positions: [], colors: [] },
      yellow: { positions: [], colors: [] },
      red: { positions: [], colors: [] },
    },
    mid: {
      normal: { positions: [], colors: [] },
      yellow: { positions: [], colors: [] },
      red: { positions: [], colors: [] },
    },
    far: {
      normal: { positions: [], colors: [] },
      yellow: { positions: [], colors: [] },
      red: { positions: [], colors: [] },
    },
  };

  for (let index = 0; index < depthFactors.length; index += 1) {
    const stride = index * 3;
    const depth = depthFactors[index];
    const depthBucket = depth > 0.2 ? buckets.near : depth < -0.2 ? buckets.far : buckets.mid;
    const typeBucket =
      starTypes[index] === 2 ? depthBucket.red : starTypes[index] === 1 ? depthBucket.yellow : depthBucket.normal;

    typeBucket.positions.push(positions[stride], positions[stride + 1], positions[stride + 2]);
    typeBucket.colors.push(colors[stride], colors[stride + 1], colors[stride + 2]);
  }

  const toLayer = (bucket) => ({
    positions: new Float32Array(bucket.positions),
    colors: new Float32Array(bucket.colors),
  });

  return {
    near: {
      normal: toLayer(buckets.near.normal),
      yellow: toLayer(buckets.near.yellow),
      red: toLayer(buckets.near.red),
    },
    mid: {
      normal: toLayer(buckets.mid.normal),
      yellow: toLayer(buckets.mid.yellow),
      red: toLayer(buckets.mid.red),
    },
    far: {
      normal: toLayer(buckets.far.normal),
      yellow: toLayer(buckets.far.yellow),
      red: toLayer(buckets.far.red),
    },
  };
}

function buildCoreCloud({ count, radius, colorA, colorB, flattening = 1 }) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  const warm = new THREE.Color(colorA);
  const bright = new THREE.Color(colorB);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const distance = Math.pow(Math.random(), 2.2) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[stride] = Math.sin(phi) * Math.cos(theta) * distance;
    positions[stride + 1] = (Math.random() - 0.5) * radius * 0.42 * flattening;
    positions[stride + 2] = Math.cos(phi) * distance;

    color.copy(warm).lerp(bright, Math.random() * 0.7);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  return { positions, colors };
}

function createStarTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.02,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  );

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.16, "rgba(255,255,255,0.98)");
  gradient.addColorStop(0.42, "rgba(255,255,255,0.42)");
  gradient.addColorStop(0.72, "rgba(255,255,255,0.1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createStarFlareTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const center = size * 0.5;
  const halo = context.createRadialGradient(center, center, 0, center, center, center * 0.5);
  halo.addColorStop(0, "rgba(255,255,255,0.95)");
  halo.addColorStop(0.12, "rgba(255,255,255,0.75)");
  halo.addColorStop(0.32, "rgba(255,255,255,0.18)");
  halo.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = halo;
  context.fillRect(0, 0, size, size);

  context.save();
  context.translate(center, center);
  context.globalCompositeOperation = "lighter";

  const drawSpike = (rotation, width, height, alpha) => {
    context.save();
    context.rotate(rotation);
    const spikeGradient = context.createLinearGradient(0, -height * 0.5, 0, height * 0.5);
    spikeGradient.addColorStop(0, "rgba(255,255,255,0)");
    spikeGradient.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    spikeGradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = spikeGradient;
    context.fillRect(-width * 0.5, -height * 0.5, width, height);
    context.restore();
  };

  drawSpike(0, size * 0.06, size * 0.84, 0.62);
  drawSpike(Math.PI * 0.5, size * 0.06, size * 0.84, 0.62);
  drawSpike(Math.PI * 0.25, size * 0.032, size * 0.5, 0.22);
  drawSpike(-Math.PI * 0.25, size * 0.032, size * 0.5, 0.22);
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createNebulaTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.08,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.92)");
  gradient.addColorStop(0.18, "rgba(255,255,255,0.65)");
  gradient.addColorStop(0.42, "rgba(255,255,255,0.22)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0.06)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function buildNebulaClouds({ count, radius }) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + Math.random() * 0.55;
    const distance = THREE.MathUtils.lerp(radius * 0.24, radius, Math.random());
    const scale = THREE.MathUtils.lerp(1.8, 4.8, Math.random());
    const height = (Math.random() - 0.5) * radius * 0.22;

    return {
      position: [
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance * 0.72,
      ],
      rotation: [Math.PI / 2, Math.random() * Math.PI, Math.random() * Math.PI],
      scale,
      color:
        index % 5 === 0 ? "#f4b37d" : index % 3 === 0 ? "#7c3aed" : index % 2 === 0 ? "#38bdf8" : "#dbeafe",
      opacity: THREE.MathUtils.lerp(0.06, 0.18, Math.random()),
    };
  });
}

function buildFlareLayer(layer, ratio) {
  const positions = [];
  const colors = [];

  for (let index = 0; index < layer.positions.length / 3; index += 1) {
    const keepSeed = ((index * 37) % 100) / 100;
    if (keepSeed > ratio) {
      continue;
    }

    const stride = index * 3;
    positions.push(layer.positions[stride], layer.positions[stride + 1], layer.positions[stride + 2]);
    colors.push(layer.colors[stride], layer.colors[stride + 1], layer.colors[stride + 2]);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

function SpiralGalaxy({ scrollProgress, scrollVelocity, isMobile, revealTarget = 1, config = GALAXY_SETTINGS }) {
  const galaxyRef = useRef(null);
  const starsRef = useRef(null);
  const nebulaRef = useRef(null);
  const coreRef = useRef(null);
  const revealProgress = useRef(0);
  const baseMaterials = useRef([]);
  const tempStartPosition = useRef(new THREE.Vector3());
  const tempEndPosition = useRef(new THREE.Vector3());
  const tempStarsOffset = useRef(new THREE.Vector3());
  const tempNebulaOffset = useRef(new THREE.Vector3());
  const tempCoreOffset = useRef(new THREE.Vector3());
  const starTexture = useMemo(() => createStarTexture(), []);
  const flareTexture = useMemo(() => createStarFlareTexture(), []);
  const nebulaTexture = useMemo(() => createNebulaTexture(), []);
  const rotationVelocity = useRef(0);
  const rotationOffset = useRef(0);
  const resolvedConfig = useMemo(
    () => ({
      ...config,
      starCount: Math.floor(config.starCount * (isMobile ? 0.55 : 1)),
      nebulaCount: Math.floor(config.nebulaCount * (isMobile ? 0.75 : 1)),
      starSize: config.starSize * (isMobile ? 0.84 : 1),
      radius: config.radius * (isMobile ? 0.88 : 1),
    }),
    [
      config,
      isMobile,
    ],
  );
  const starLayers = useMemo(() => {
    const base = buildSpiralGalaxy({
      count: resolvedConfig.starCount,
      radius: resolvedConfig.radius,
      branches: resolvedConfig.branches,
      spin: resolvedConfig.spin,
      randomness: resolvedConfig.randomness,
      randomnessPower: resolvedConfig.randomnessPower,
      verticalThickness: resolvedConfig.verticalThickness,
      coreRadius: resolvedConfig.coreRadius,
      innerColor: resolvedConfig.innerColor,
      midColor: resolvedConfig.midColor,
      outerColor: resolvedConfig.outerColor,
      accentColor: resolvedConfig.accentColor,
    });
    const layered = splitGalaxyLayers(base);

    return [
      {
        positions: layered.far.normal.positions,
        colors: layered.far.normal.colors,
        size: resolvedConfig.starSize * 0.5,
        opacity: 0.16,
        rotation: [0, -0.06, -0.015],
      },
      {
        positions: layered.mid.normal.positions,
        colors: layered.mid.normal.colors,
        size: resolvedConfig.starSize * 0.94,
        opacity: 0.5,
        rotation: [0, 0.08, 0.018],
      },
      {
        positions: layered.near.normal.positions,
        colors: layered.near.normal.colors,
        size: resolvedConfig.starSize * 1.92,
        opacity: 1,
        rotation: [0, 0.15, 0.04],
      },
      {
        positions: layered.far.yellow.positions,
        colors: layered.far.yellow.colors,
        size: resolvedConfig.starSize * 0.72,
        opacity: 0.22,
        rotation: [0, -0.06, -0.015],
      },
      {
        positions: layered.mid.yellow.positions,
        colors: layered.mid.yellow.colors,
        size: resolvedConfig.starSize * 1.3,
        opacity: 0.68,
        rotation: [0, 0.08, 0.018],
      },
      {
        positions: layered.near.yellow.positions,
        colors: layered.near.yellow.colors,
        size: resolvedConfig.starSize * 2.45,
        opacity: 1.08,
        rotation: [0, 0.15, 0.04],
      },
      {
        positions: layered.far.red.positions,
        colors: layered.far.red.colors,
        size: resolvedConfig.starSize * 0.92,
        opacity: 0.18,
        rotation: [0, -0.06, -0.015],
      },
      {
        positions: layered.mid.red.positions,
        colors: layered.mid.red.colors,
        size: resolvedConfig.starSize * 1.62,
        opacity: 0.58,
        rotation: [0, 0.08, 0.018],
      },
      {
        positions: layered.near.red.positions,
        colors: layered.near.red.colors,
        size: resolvedConfig.starSize * 3.1,
        opacity: 0.98,
        rotation: [0, 0.15, 0.04],
      },
      {
        ...buildFlareLayer(layered.far.yellow, 0.16),
        size: resolvedConfig.starSize * 0.72,
        opacity: 0.18,
        rotation: [0, -0.06, -0.015],
        texture: "flare",
      },
      {
        ...buildFlareLayer(layered.mid.yellow, 0.2),
        size: resolvedConfig.starSize * 1.3,
        opacity: 0.36,
        rotation: [0, 0.08, 0.018],
        texture: "flare",
      },
      {
        ...buildFlareLayer(layered.near.yellow, 0.24),
        size: resolvedConfig.starSize * 2.45,
        opacity: 0.52,
        rotation: [0, 0.15, 0.04],
        texture: "flare",
      },
      {
        ...buildFlareLayer(layered.far.red, 0.12),
        size: resolvedConfig.starSize * 0.92,
        opacity: 0.18,
        rotation: [0, -0.06, -0.015],
        texture: "flare",
      },
      {
        ...buildFlareLayer(layered.mid.red, 0.16),
        size: resolvedConfig.starSize * 1.62,
        opacity: 0.34,
        rotation: [0, 0.08, 0.018],
        texture: "flare",
      },
      {
        ...buildFlareLayer(layered.near.red, 0.2),
        size: resolvedConfig.starSize * 3.1,
        opacity: 0.46,
        rotation: [0, 0.15, 0.04],
        texture: "flare",
      },
    ];
  }, [
    resolvedConfig.accentColor,
    resolvedConfig.branches,
    resolvedConfig.coreRadius,
    resolvedConfig.innerColor,
    resolvedConfig.midColor,
    resolvedConfig.outerColor,
    resolvedConfig.radius,
    resolvedConfig.randomness,
    resolvedConfig.randomnessPower,
    resolvedConfig.spin,
    resolvedConfig.starCount,
    resolvedConfig.starSize,
    resolvedConfig.verticalThickness,
  ]);
  const coreCloud = useMemo(
    () =>
      buildCoreCloud({
        count: isMobile ? 220 : 380,
        radius: resolvedConfig.coreRadius,
        colorA: resolvedConfig.warmCoreColor,
        colorB: resolvedConfig.innerColor,
        flattening: resolvedConfig.coreFlattening,
      }),
    [
      isMobile,
      resolvedConfig.coreFlattening,
      resolvedConfig.coreRadius,
      resolvedConfig.innerColor,
      resolvedConfig.warmCoreColor,
    ],
  );
  const nebulaClouds = useMemo(
    () => buildNebulaClouds({ count: resolvedConfig.nebulaCount, radius: resolvedConfig.nebulaRadius }),
    [resolvedConfig.nebulaCount, resolvedConfig.nebulaRadius],
  );

  useEffect(() => {
    return () => {
      starTexture?.dispose();
      flareTexture?.dispose();
      nebulaTexture?.dispose();
    };
  }, [flareTexture, nebulaTexture, starTexture]);

  useEffect(() => {
    baseMaterials.current = [];

    if (!galaxyRef.current) {
      return undefined;
    }

    galaxyRef.current.traverse((object) => {
      const material = object.material;

      if (material && typeof material.opacity === "number") {
        material.userData.baseOpacity = material.opacity;
        baseMaterials.current.push(material);
      }
    });

    return () => {
      baseMaterials.current = [];
    };
  }, [coreCloud, nebulaClouds, starLayers]);

  useFrame((state, delta) => {
    if (!galaxyRef.current) {
      return;
    }

    revealProgress.current = THREE.MathUtils.damp(revealProgress.current, revealTarget, 3.2, delta);
    const reveal = THREE.MathUtils.smootherstep(revealProgress.current, 0, 1);
    const revealOpacity = THREE.MathUtils.smootherstep(revealProgress.current, 0.08, 1);
    const startPosition = tempStartPosition.current.set(
      isMobile ? 0.18 : 0.26,
      isMobile ? 0.34 : 0.42,
      isMobile ? 1.4 : 1.15,
    );
    const endPosition = tempEndPosition.current.set(...resolvedConfig.position);

    const targetVelocity = scrollVelocity * resolvedConfig.scrollResponseSpeed;
    rotationVelocity.current = THREE.MathUtils.damp(rotationVelocity.current, targetVelocity, 5.2, delta);
    rotationOffset.current += (rotationVelocity.current + resolvedConfig.idleRotationSpeed) * delta;

    galaxyRef.current.position.copy(startPosition.lerp(endPosition, reveal));
    galaxyRef.current.scale.setScalar(
      THREE.MathUtils.lerp(resolvedConfig.scale * 1.85, resolvedConfig.scale, reveal),
    );
    galaxyRef.current.rotation.y = rotationOffset.current;
    galaxyRef.current.rotation.x =
      resolvedConfig.rotation[0] +
      Math.sin(state.clock.elapsedTime * 0.12) * 0.035 +
      (1 - reveal) * 0.22;
    galaxyRef.current.rotation.z =
      resolvedConfig.rotation[2] +
      Math.cos(state.clock.elapsedTime * 0.08) * 0.018 +
      (1 - reveal) * -0.16;

    if (starsRef.current) {
      starsRef.current.rotation.z = THREE.MathUtils.damp(
        starsRef.current.rotation.z,
        resolvedConfig.rotation[1] + scrollProgress * 0.08,
        2.8,
        delta,
      );
      starsRef.current.scale.setScalar(THREE.MathUtils.lerp(1.32, 1, reveal));
      starsRef.current.position.copy(
        tempStarsOffset.current.set(
          THREE.MathUtils.lerp(isMobile ? -1.6 : -2.2, 0, reveal),
          THREE.MathUtils.lerp(isMobile ? 0.24 : 0.3, 0, reveal),
          THREE.MathUtils.lerp(0.55, 0, reveal),
        ),
      );
    }

    if (nebulaRef.current) {
      nebulaRef.current.rotation.y -= delta * 0.016;
      nebulaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.06) * 0.05;
      nebulaRef.current.scale.setScalar(THREE.MathUtils.lerp(1.42, 1, reveal));
      nebulaRef.current.position.copy(
        tempNebulaOffset.current.set(
          THREE.MathUtils.lerp(isMobile ? 1.3 : 1.85, 0, reveal),
          THREE.MathUtils.lerp(isMobile ? -0.18 : -0.24, 0, reveal),
          THREE.MathUtils.lerp(0.45, 0, reveal),
        ),
      );
    }

    if (coreRef.current) {
      coreRef.current.position.copy(
        tempCoreOffset.current.set(
          THREE.MathUtils.lerp(0, 0, reveal),
          THREE.MathUtils.lerp(isMobile ? 0.16 : 0.2, 0, reveal),
          THREE.MathUtils.lerp(0.35, 0, reveal),
        ),
      );
      coreRef.current.scale.setScalar(
        THREE.MathUtils.lerp(1.2, 1.04, reveal) *
          THREE.MathUtils.lerp(1, 1.04, (Math.sin(state.clock.elapsedTime * 1.2) + 1) * 0.5),
      );
    }

    baseMaterials.current.forEach((material) => {
      material.opacity = material.userData.baseOpacity * revealOpacity;
    });
  });

  return (
    <group ref={galaxyRef} position={resolvedConfig.position} scale={resolvedConfig.scale}>
      <group ref={nebulaRef}>
        {nebulaClouds.map((cloud, index) => (
          <sprite
            key={index}
            position={cloud.position}
            scale={[cloud.scale * 1.8, cloud.scale, 1]}
            rotation={cloud.rotation[2]}
          >
            <spriteMaterial
              map={nebulaTexture ?? undefined}
              color={cloud.color}
              transparent
              opacity={cloud.opacity * resolvedConfig.nebulaOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}
      </group>

      <group ref={starsRef}>
        {starLayers.map((layer, index) => (
          <points key={index} rotation={layer.rotation}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={layer.positions.length / 3}
                array={layer.positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={layer.colors.length / 3}
                array={layer.colors}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={layer.size}
              sizeAttenuation
              transparent
              opacity={layer.opacity}
              vertexColors
              map={(layer.texture === "flare" ? flareTexture : starTexture) ?? undefined}
              alphaMap={(layer.texture === "flare" ? flareTexture : starTexture) ?? undefined}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        ))}
      </group>

      <group ref={coreRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={coreCloud.positions.length / 3}
              array={coreCloud.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={coreCloud.colors.length / 3}
              array={coreCloud.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={resolvedConfig.starSize * 2.6}
            sizeAttenuation
            transparent
            opacity={resolvedConfig.coreIntensity}
            vertexColors
            map={starTexture ?? undefined}
            alphaMap={starTexture ?? undefined}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <sprite scale={[1.24, 1.24, 1]}>
          <spriteMaterial
            map={nebulaTexture ?? undefined}
            color={resolvedConfig.warmCoreColor}
            transparent
            opacity={0.55 * resolvedConfig.coreIntensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
        <sprite scale={[1.74, 1.74, 1]}>
          <spriteMaterial
            map={nebulaTexture ?? undefined}
            color="#ffffff"
            transparent
            opacity={0.28 * resolvedConfig.coreIntensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
        <sprite scale={[3.9, 3.9, 1]}>
          <spriteMaterial
            map={nebulaTexture ?? undefined}
            color={resolvedConfig.accentColor}
            transparent
            opacity={0.07 * resolvedConfig.coreIntensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      </group>
    </group>
  );
}

function HelixCards({
  items,
  scrollProgress,
  onSelect,
  focusedIndex,
  detailExpanded,
  detailOpen,
  isMobile,
  revealTarget = 1,
}) {
  return (
    <group>
      {items.map((item, index) => (
        <HelixCard
          key={item.title}
          item={item}
          index={index}
          count={items.length}
          scrollProgress={scrollProgress}
          onSelect={onSelect}
          isFocused={focusedIndex === index}
          detailExpanded={detailExpanded && focusedIndex === index}
          detailOpen={detailOpen}
          isMobile={isMobile}
          revealTarget={revealTarget}
        />
      ))}
    </group>
  );
}

function HelixCard({
  item,
  index,
  count,
  scrollProgress,
  onSelect,
  isFocused,
  detailExpanded,
  detailOpen,
  isMobile,
  revealTarget,
}) {
  const groupRef = useRef(null);
  const shellRef = useRef(null);
  const texture = useTexture(item.image);
  const motion = useRef(scrollProgress);
  const detailProgress = useRef(0);
  const introProgress = useRef(0);
  const tempForward = useRef(new THREE.Vector3());
  const tempMidPosition = useRef(new THREE.Vector3());
  const tempDetailPosition = useRef(new THREE.Vector3());
  const tempTargetPosition = useRef(new THREE.Vector3());
  const tempFinalPosition = useRef(new THREE.Vector3());
  const tempRevealPosition = useRef(new THREE.Vector3());
  const tempCameraSpace = useRef(new THREE.Vector3());
  const tempOrbitPosition = useRef(new THREE.Vector3());
  const orbitEuler = useRef(new THREE.Euler());
  const orbitQuaternion = useRef(new THREE.Quaternion());
  const detailQuaternion = useRef(new THREE.Quaternion());
  const targetQuaternion = useRef(new THREE.Quaternion());
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    motion.current = THREE.MathUtils.damp(motion.current, scrollProgress, 7, delta);
    introProgress.current = THREE.MathUtils.damp(introProgress.current, revealTarget, 3.8, delta);
    const reveal = THREE.MathUtils.smootherstep(introProgress.current, 0, 1);

    const focusIndex = motion.current * (count - 1);
    const localOffset = index - focusIndex;
    const angle = localOffset * HELIX_SETTINGS.angleStep;
    const absOffset = Math.abs(localOffset);
    const offsetRatio = THREE.MathUtils.clamp(absOffset / 4.2, 0, 1);
    const depthFalloff = THREE.MathUtils.smootherstep(offsetRatio, 0, 1);
    const y = -localOffset * HELIX_SETTINGS.verticalGap;
    const orbitalRadius = HELIX_SETTINGS.radius * (1 - depthFalloff * 0.1);
    const leftSpreadOffset = localOffset < 0 ? -absOffset * 0.17 * (1 - depthFalloff * 0.28) : 0;
    const x = HELIX_SETTINGS.centerX + Math.sin(angle) * orbitalRadius + leftSpreadOffset;
    const z = Math.cos(angle) * orbitalRadius * 0.56 - Math.min(absOffset, 4.5) * 0.14;
    const focusStrength = 1 - THREE.MathUtils.clamp(Math.abs(localOffset), 0, 1);
    const centerPull = THREE.MathUtils.smoothstep(focusStrength, 0, 1);
    const depthScale = THREE.MathUtils.lerp(1, 0.58, depthFalloff);

    const focusLaneX = HELIX_SETTINGS.centerX + (isMobile ? 0.2 : 0.26);
    const positionX = THREE.MathUtils.lerp(x, focusLaneX, centerPull);
    const positionZ = z + centerPull * 0.76;
    const targetScale = depthScale + centerPull * 0.11;
    const orbitYaw = Math.atan2(positionX - HELIX_SETTINGS.centerX, positionZ);
    const visibilityScale = detailOpen ? (isFocused ? 1 : 0.68) : 1;
    detailProgress.current = THREE.MathUtils.damp(
      detailProgress.current,
      detailExpanded ? 1 : 0,
      5.2,
      delta,
    );
    const routeProgress = THREE.MathUtils.smootherstep(detailProgress.current, 0, 1);

    const orbitPosition = tempOrbitPosition.current.set(positionX, y, positionZ);
    const cameraForward = tempForward.current.set(0, 0, -1).applyQuaternion(state.camera.quaternion);
    const orbitDistanceToCamera = orbitPosition.distanceTo(state.camera.position);
    const perspectiveCompensation = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(orbitDistanceToCamera, 7.4, 8.9, 0.97, 1.03),
      0.97,
      1.03,
    );
    const midPosition = tempMidPosition.current
      .set(0, 0.04, -2.22)
      .applyMatrix4(state.camera.matrixWorld);
    const detailPosition = tempDetailPosition.current
      .set(0, isMobile ? 0.05 : 0.08, isMobile ? -3.68 : -3.32)
      .applyMatrix4(state.camera.matrixWorld);
    const targetPosition = tempTargetPosition.current
      .copy(orbitPosition)
      .lerp(midPosition, Math.min(routeProgress / 0.62, 1))
      .lerp(detailPosition, THREE.MathUtils.smoothstep(routeProgress, 0.58, 1))
      .addScaledVector(cameraForward, Math.sin(routeProgress * Math.PI) * 0.05);
    const finalPosition = tempFinalPosition.current.copy(targetPosition);
    const revealPosition = tempRevealPosition.current
      .set(positionX * 0.08, y * 0.1, isMobile ? 1.28 : 1.08)
      .applyMatrix4(state.camera.matrixWorld)
      .addScaledVector(cameraForward, 0.55 + (count - index) * 0.01);

    targetPosition.copy(revealPosition).lerp(finalPosition, reveal);

    const cameraSpacePosition = tempCameraSpace.current.copy(targetPosition);
    state.camera.worldToLocal(cameraSpacePosition);
    const frontalProximity = 1 - THREE.MathUtils.clamp(Math.abs(cameraSpacePosition.x) / 2.4, 0, 1);
    const depthProximity = THREE.MathUtils.clamp((-cameraSpacePosition.z - 2.05) / 0.95, 0, 1);
    const centerFocus = frontalProximity * 0.72 + depthProximity * 0.28;
    const faceCameraProgress = Math.max(routeProgress, centerPull * 0.78);

    orbitEuler.current.set(0, orbitYaw, Math.sin(angle * 1.12) * 0.03 * (1 - centerPull * 0.35));
    orbitQuaternion.current.setFromEuler(orbitEuler.current);
    detailQuaternion.current.copy(state.camera.quaternion);
    targetQuaternion.current.copy(orbitQuaternion.current).slerp(detailQuaternion.current, faceCameraProgress);

    groupRef.current.position.copy(targetPosition);
    groupRef.current.quaternion.copy(targetQuaternion.current);

    if (shellRef.current) {
      shellRef.current.position.z = THREE.MathUtils.damp(
        shellRef.current.position.z,
        THREE.MathUtils.lerp(centerPull * 0.04, 0.14, detailProgress.current),
        5.5,
        delta,
      );
      shellRef.current.rotation.x = THREE.MathUtils.damp(
        shellRef.current.rotation.x,
        THREE.MathUtils.lerp((isHovered ? -0.045 : 0) + absOffset * -0.012, 0, detailProgress.current),
        5.5,
        delta,
      );
      shellRef.current.scale.setScalar(
        THREE.MathUtils.damp(
          shellRef.current.scale.x,
          THREE.MathUtils.lerp(0.001, 1, reveal) *
            THREE.MathUtils.lerp(
              (targetScale + (isHovered ? 0.035 : 0)) * visibilityScale * perspectiveCompensation,
              (isMobile ? 0.76 : 0.86) + centerFocus * (isMobile ? 0.018 : 0.026),
              routeProgress,
            ),
          5.2,
          delta,
        ),
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => {
        setIsHovered(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(index);
      }}
    >
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.12}>
        <group ref={shellRef}>
          <RoundedBox
            args={[CARD_LAYOUT.width + 0.018, CARD_LAYOUT.height + 0.018, CARD_LAYOUT.depth]}
            radius={CARD_LAYOUT.radius + 0.004}
            smoothness={4}
            position={[0, 0, 0]}
          >
            <meshBasicMaterial color={item.accent} transparent opacity={0.15} toneMapped={false} />
          </RoundedBox>

          <mesh position={[0, isFocused ? 0.12 : 0.1, 0.05]}>
            <planeGeometry args={[CARD_LAYOUT.mediaWidth, isFocused ? 0.56 : CARD_LAYOUT.mediaHeight]} />
            <meshBasicMaterial
              map={texture}
              toneMapped={false}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>

          <mesh position={[0, isFocused ? 0.12 : 0.1, 0.051]}>
            <planeGeometry args={[CARD_LAYOUT.mediaWidth, isFocused ? 0.56 : CARD_LAYOUT.mediaHeight]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={isFocused ? 0.08 : 0.05} side={THREE.DoubleSide} />
          </mesh>

          {!isFocused ? (
            <Text
              position={[-0.69, -0.255, 0.06]}
              anchorX="left"
              anchorY="middle"
              maxWidth={1.34}
              fontSize={0.086}
              color="#f8fafc"
            >
              {item.title}
            </Text>
          ) : null}

          {!isFocused ? (
            <Text
              position={[-0.69, -0.365, 0.06]}
              anchorX="left"
              anchorY="top"
              maxWidth={1.34}
              fontSize={0.041}
              lineHeight={1.32}
              color="#b8c4d3"
            >
              {item.description}
            </Text>
          ) : null}

          {!isFocused ? (
            <mesh position={[-0.57, -0.255, 0.06]}>
              <planeGeometry args={[0.18, 0.014]} />
              <meshBasicMaterial color={item.accent} toneMapped={false} />
            </mesh>
          ) : null}
        </group>
      </Float>
    </group>
  );
}

function Scene({
  scrollProgress,
  scrollVelocity,
  itemCount,
  onSelect,
  selectedIndex,
  focusedIndex,
  detailOpen,
  isMobile,
  galaxyRevealTarget,
  cardsRevealTarget,
}) {
  const galaxyConfig = useMemo(
    () => ({
      ...GALAXY_SETTINGS,
      scale: isMobile ? 0.92 : 1,
      position: isMobile ? [0.1, 0.06, -1.7] : GALAXY_SETTINGS.position,
    }),
    [isMobile],
  );

  return (
    <>
      <CenteredCamera isMobile={isMobile} />
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 9, 25]} />

      <ambientLight intensity={1.05} />
      <directionalLight position={[6, 7, 8]} intensity={1.35} color="#fff4d6" />
      <pointLight position={[-4, 1, 6]} intensity={20} distance={26} color="#38bdf8" />
      <pointLight position={[4, -2, -3]} intensity={15} distance={20} color="#f97316" />
      <pointLight position={[0, 0.6, -2.4]} intensity={18} distance={18} color="#dbeafe" />

      <group position={[0, -0.05, 0]}>
        {GALAXY_SETTINGS.enabled ? (
          <SpiralGalaxy
            scrollProgress={scrollProgress}
            scrollVelocity={scrollVelocity}
            isMobile={isMobile}
            revealTarget={galaxyRevealTarget}
            config={galaxyConfig}
          />
        ) : null}
        {GALAXY_SETTINGS.showLegacyAxisSystem ? <AxisGuide scrollProgress={scrollProgress} /> : null}
        <HelixCards
          items={CARD_ITEMS}
          scrollProgress={scrollProgress}
          onSelect={onSelect}
          focusedIndex={focusedIndex}
          detailExpanded={selectedIndex !== null}
          detailOpen={detailOpen}
          isMobile={isMobile}
          revealTarget={cardsRevealTarget}
        />
      </group>
    </>
  );
}

function LoadingOverlay({ phase, progress }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const particleField = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => {
        const angle = index * 0.92;
        const radius = 18 + (index % 6) * 11;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle * 1.17) * (14 + (index % 5) * 9);
        const size = 2 + (index % 4) * 1.4;
        const delay = -(index * 0.35);
        const duration = 4.8 + (index % 5) * 0.9;

        return {
          id: index,
          style: {
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            "--drift-x": `${Math.cos(angle) * (54 + (index % 3) * 18)}px`,
            "--drift-y": `${Math.sin(angle * 1.37) * (24 + (index % 4) * 10)}px`,
            "--particle-rotate": `${(index % 2 === 0 ? 1 : -1) * (18 + index * 2)}deg`,
          },
        };
      }),
    [],
  );

  useEffect(() => {
    const nextTarget = phase === "loading" ? progress : 100;
    let frameId = 0;

    const animate = () => {
      setDisplayProgress((current) => {
        const nextValue = THREE.MathUtils.damp(current, nextTarget, 5, 1 / 60);

        if (Math.abs(nextValue - nextTarget) < 0.15) {
          return nextTarget;
        }

        frameId = window.requestAnimationFrame(animate);
        return nextValue;
      });
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [phase, progress]);

  const safeProgress = Math.max(0, Math.min(100, Math.round(displayProgress)));

  return (
    <div
      className={`loading-overlay is-${phase} ${phase === "revealing" ? "is-breaking" : ""}`}
      aria-live="polite"
      aria-busy={phase === "loading" || phase === "breaking" || phase === "revealing"}
    >
      <div className="loading-cosmos" aria-hidden="true">
        <div className="loading-aura loading-aura-outer" />
        <div className="loading-aura loading-aura-inner" />
        <div className="loading-gas loading-gas-a" />
        <div className="loading-gas loading-gas-b" />
        <div className="loading-nebula" />
        <div className="loading-ring loading-ring-a" />
        <div className="loading-ring loading-ring-b" />
        <div className="loading-core" />
        {particleField.map((particle) => (
          <span key={particle.id} className="loading-particle" style={particle.style} />
        ))}
        <div className="loading-progress">
          <strong>{safeProgress}%</strong>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { active: assetsActive, progress: assetsProgress } = useProgress();
  const { progress: scrollProgress, velocity: scrollVelocity } = useScrollMetrics();
  const isMobile = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [closingIndex, setClosingIndex] = useState(null);
  const [isClosingDetail, setIsClosingDetail] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [introPhase, setIntroPhase] = useState("loading");
  const [introUnlocked, setIntroUnlocked] = useState(false);
  const introStarted = useRef(false);
  const uiReady = introPhase === "ready";
  const detailIndex = selectedIndex ?? closingIndex;
  const activeItem = detailIndex !== null ? CARD_ITEMS[detailIndex] : null;
  const canvasDpr = isMobile ? [1, 1.2] : [1, 1.5];
  const cameraConfig = isMobile ? CAMERA_SETTINGS.mobile : CAMERA_SETTINGS.desktop;

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (assetsProgress >= 100 || (!assetsActive && assetsProgress > 0)) {
      setIntroUnlocked(true);
    }
  }, [assetsActive, assetsProgress]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIntroUnlocked(true);
    }, 3600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (introStarted.current || !introUnlocked) {
      return undefined;
    }

    introStarted.current = true;
    setIntroPhase("breaking");

    const revealId = window.setTimeout(() => {
      setIntroPhase("revealing");
    }, 620);
    const hideId = window.setTimeout(() => {
      setLoaderVisible(false);
    }, 1380);
    const readyId = window.setTimeout(() => {
      setIntroPhase("ready");
    }, 1680);

    return () => {
      window.clearTimeout(revealId);
      window.clearTimeout(hideId);
      window.clearTimeout(readyId);
    };
  }, [introUnlocked]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (detailIndex !== null && uiReady) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [detailIndex, uiReady]);

  const handleSelectCard = (index) => {
    if (!uiReady || selectedIndex === index || isClosingDetail) {
      return;
    }

    setClosingIndex(null);
    setIsClosingDetail(false);
    setSelectedIndex(index);
  };

  const handleCloseDetail = () => {
    if (selectedIndex === null) {
      return;
    }

    const indexToClose = selectedIndex;
    setIsClosingDetail(true);
    setClosingIndex(indexToClose);
    setSelectedIndex(null);

    window.setTimeout(() => {
      setClosingIndex(null);
      setIsClosingDetail(false);
    }, 420);
  };

  return (
    <div className="page-shell">
      <section className={`scene-shell ${detailIndex !== null ? "is-detail-open" : ""}`}>
        {loaderVisible ? <LoadingOverlay phase={introPhase} progress={assetsProgress} /> : null}
        <div className="canvas-wrap">
          <Canvas
            camera={{ position: cameraConfig.position, fov: cameraConfig.fov }}
            dpr={canvasDpr}
          >
            <Suspense fallback={null}>
              <Scene
                scrollProgress={scrollProgress}
                scrollVelocity={scrollVelocity}
                itemCount={CARD_ITEMS.length}
                onSelect={handleSelectCard}
                selectedIndex={selectedIndex}
                focusedIndex={detailIndex}
                detailOpen={detailIndex !== null}
                isMobile={isMobile}
                galaxyRevealTarget={introPhase === "loading" ? 0 : introPhase === "breaking" ? 0.42 : 1}
                cardsRevealTarget={introPhase === "ready" ? 1 : introPhase === "revealing" ? 0.18 : 0}
              />
            </Suspense>
          </Canvas>
        </div>

        {uiReady && activeItem ? (
          <div className={`detail-page ${isClosingDetail ? "is-closing" : ""}`} aria-label={`Detalle de ${activeItem.title}`}>
            <div className="detail-controls">
              <button type="button" className="detail-back" onClick={handleCloseDetail}>
                Back
              </button>
            </div>

            <div className="detail-page-inner">
              <header className="detail-header">
                <h1>{activeItem.title}</h1>
              </header>

              <div className="detail-media">
                <img src={activeItem.image} alt={activeItem.title} />
              </div>

              <div className="detail-copy-block">
                <p>{activeItem.details}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <div className="scroll-track" aria-hidden="true" />
    </div>
  );
}
