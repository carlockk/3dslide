import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, MeshTransmissionMaterial, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const MENU_ITEMS = ["Work", "Studio", "Contact"];

const SLIDES = [
  {
    title: "Signal Drift",
    label: "Research system",
    description: "",
    image: "https://picsum.photos/id/1011/1000/1400",
    accent: "#7dd3fc",
  },
  {
    title: "Quantum Work",
    label: "Spatial design",
    description: "SPATIAL LAB presenta experiencias digitales, dirección visual y motion systems con una mirada precisa.",
    image: "https://picsum.photos/id/1018/1000/1400",
    accent: "#9ae6b4",
  },
  {
    title: "Glass Archive",
    label: "Immersive gallery",
    description: "Las imágenes viven dentro del panel con distorsión suave, niebla y borde refractivo.",
    image: "https://picsum.photos/id/1020/1000/1400",
    accent: "#f0abfc",
  },
  {
    title: "Tidal Lab",
    label: "Motion identity",
    description: "La superficie inferior actúa como un piso de agua que separa dos mundos visuales.",
    image: "https://picsum.photos/id/1037/1000/1400",
    accent: "#fdba74",
  },
  {
    title: "North Current",
    label: "Visual prototyping",
    description: "Base lista para sumar más módulos 3D sin cargar el proyecto con GPGPU antes de tiempo.",
    image: "https://picsum.photos/id/1040/1000/1400",
    accent: "#93c5fd",
  },
];

function createRoundedMaskTexture(width = 1024, height = 1536, radius = 92) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(width - radius, 0);
  context.quadraticCurveTo(width, 0, width, radius);
  context.lineTo(width, height - radius);
  context.quadraticCurveTo(width, height, width - radius, height);
  context.lineTo(radius, height);
  context.quadraticCurveTo(0, height, 0, height - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function useViewportState() {
  const [state, setState] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scrollY: window.scrollY,
    maxScroll: Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
  }));

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      frameId = 0;
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollY: window.scrollY,
        maxScroll: Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
      });
    };

    const schedule = () => {
      if (frameId) {
        return;
      }
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return state;
}

function CameraRig({ progress, isMobile }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(0, 0.1, 0), []);

  useFrame((_, delta) => {
    const heroLift = THREE.MathUtils.smoothstep(progress, 0.02, 0.32);
    const descend = THREE.MathUtils.smoothstep(progress, 0.44, 0.82);

    const targetPosition = new THREE.Vector3(
      isMobile ? 0 : 0.24 - descend * 0.05,
      isMobile ? 0.5 - descend * 0.36 : 0.42 - descend * 0.42,
      isMobile ? 7.7 - heroLift * 0.7 : 7.1 - heroLift * 0.72,
    );

    camera.position.lerp(targetPosition, 1 - Math.exp(-delta * 2.8));
    lookAt.set(0, 0.15 - descend * 1.12, descend * 0.55);
    camera.lookAt(lookAt);
  });

  return null;
}

function GlassPanel({ slide, index, count, activeIndex, progress, dragRotation }) {
  const groupRef = useRef(null);
  const imageOverlayRef = useRef(null);
  const baseImageRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, slide.image);
  const roundedMask = useMemo(() => createRoundedMaskTexture(), []);
  const baseAngle = (index / count) * Math.PI * 2;
  const radius = 2.75;
  const active = activeIndex === index ? 1 : 0;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const imageOverlayMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMap: { value: texture },
          uMask: { value: roundedMask },
          uAccent: { value: new THREE.Color(slide.accent) },
          uActive: { value: active },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform sampler2D uMap;
          uniform sampler2D uMask;
          uniform vec3 uAccent;
          uniform float uActive;
          varying vec2 vUv;

          void main() {
            vec2 centered = vUv - 0.5;
            float sideCurve = smoothstep(0.18, 0.48, abs(centered.x));
            float border =
              1.0 -
              smoothstep(0.0, 0.08, vUv.x) *
              smoothstep(0.0, 0.08, vUv.y) *
              smoothstep(0.0, 0.08, 1.0 - vUv.x) *
              smoothstep(0.0, 0.08, 1.0 - vUv.y);
            float radius = length(centered);
            float coreLens = smoothstep(0.38, 0.02, radius);
            float rimLens = smoothstep(0.16, 0.92, max(border, radius * 1.35));
            float edgeGlass = clamp(rimLens * 0.6 + sideCurve * 0.9, 0.0, 1.0);
            float lensField = clamp(coreLens * 0.42 + rimLens * 0.4 + edgeGlass * 0.55, 0.0, 1.0);
            vec2 direction = normalize(centered + vec2(0.0001));
            vec2 drift = vec2(
              sin((vUv.y - 0.5) * 6.0 + uTime * 0.18),
              cos((vUv.x - 0.5) * 6.0 - uTime * 0.18)
            );
            vec2 refractUv =
              vUv +
              direction * (-0.006 * coreLens + 0.01 * rimLens) +
              vec2(sign(centered.x) * edgeGlass * 0.024, 0.0) +
              drift * (0.0008 + edgeGlass * 0.0028);
            refractUv = clamp(refractUv, 0.02, 0.98);

            vec3 sampleA = texture2D(uMap, refractUv).rgb;
            vec3 sampleB = texture2D(uMap, clamp(refractUv + vec2(0.012, -0.008), 0.02, 0.98)).rgb;
            vec3 sampleC = texture2D(uMap, clamp(refractUv + vec2(-0.012, 0.008), 0.02, 0.98)).rgb;
            vec3 sampleD = texture2D(uMap, clamp(refractUv + vec2(0.0, 0.012), 0.02, 0.98)).rgb;
            vec3 sampleE = texture2D(uMap, clamp(refractUv + vec2(-0.008, -0.01), 0.02, 0.98)).rgb;
            vec3 sampleF = texture2D(uMap, clamp(refractUv + vec2(0.008, 0.01), 0.02, 0.98)).rgb;
            vec3 refracted = (sampleA + sampleB + sampleC + sampleD + sampleE + sampleF) / 6.0;

            float chroma = 0.002 + rimLens * 0.004 + uActive * 0.0015;
            vec3 spectral = vec3(
              texture2D(uMap, clamp(refractUv + vec2(chroma, 0.0), 0.02, 0.98)).r,
              texture2D(uMap, refractUv).g,
              texture2D(uMap, clamp(refractUv - vec2(chroma, 0.0), 0.02, 0.98)).b
            );

            float highlightArc = smoothstep(0.62, 0.08, length(centered - vec2(-0.16, -0.18)));
            float sideHighlight =
              smoothstep(0.5, 0.1, abs(abs(centered.x) - 0.33)) *
              smoothstep(0.48, 0.02, 0.5 - abs(centered.y));
            float mask = texture2D(uMask, vUv).r;
            vec3 color = mix(sampleA, refracted, 0.18 + lensField * 0.26);
            color = mix(color, spectral, 0.08 + edgeGlass * 0.18);
            color *= 0.25;
            color += vec3(0.16, 0.18, 0.2) * rimLens * 0.08;
            color += vec3(0.26, 0.3, 0.32) * sideHighlight * (0.18 + edgeGlass * 0.26);
            color += vec3(0.22, 0.24, 0.26) * highlightArc * 0.12;
            color += uAccent * (0.006 + uActive * 0.006) * (0.2 + edgeGlass * 0.7);
            color *= 0.8;
            float alpha = (0.14 + rimLens * 0.04 + edgeGlass * 0.04 + coreLens * 0.025 + uActive * 0.06) * mask;
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [active, roundedMask, slide.accent, texture],
  );

  useEffect(() => {
    imageOverlayRef.current = imageOverlayMaterial;
    return () => {
      imageOverlayMaterial.dispose();
    };
  }, [imageOverlayMaterial]);

  useEffect(() => {
    return () => {
      if (roundedMask) {
        roundedMask.dispose();
      }
    };
  }, [roundedMask]);

  useFrame((state, delta) => {
    if (!groupRef.current || !imageOverlayRef.current || !baseImageRef.current) {
      return;
    }

    const carouselRotation = progress * Math.PI * 0.9 + dragRotation;
    const localAngle = baseAngle + carouselRotation;
    const x = Math.sin(localAngle) * radius;
    const z = Math.cos(localAngle) * radius;
    const emphasis = THREE.MathUtils.clamp(1 - Math.abs(index - activeIndex) / 2.4, 0.32, 1);

    groupRef.current.position.set(x, Math.sin(baseAngle * 2.1) * 0.14, z);
    groupRef.current.lookAt(0, 0.12, 0);
    groupRef.current.rotateY(Math.PI);
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.02;
    groupRef.current.scale.setScalar(0.84 + emphasis * 0.1);
    baseImageRef.current.material.opacity = THREE.MathUtils.damp(
      baseImageRef.current.material.opacity,
      0.5 + active * 0.32,
      4.5,
      delta,
    );
    imageOverlayRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    imageOverlayRef.current.uniforms.uActive.value = THREE.MathUtils.damp(
      imageOverlayRef.current.uniforms.uActive.value,
      active,
      4.5,
      delta,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh ref={baseImageRef} position={[0, 0, 0.008]} renderOrder={1}>
        <planeGeometry args={[1.48, 2.14, 1, 1]} />
        <meshBasicMaterial
          map={texture}
          alphaMap={roundedMask}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
          opacity={0.18}
          alphaTest={0.5}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.014]} renderOrder={2}>
        <planeGeometry args={[1.48, 2.14, 30, 30]} />
        <primitive object={imageOverlayMaterial} attach="material" />
      </mesh>

      <RoundedBox args={[1.6, 2.26, 0.022]} radius={0.16} smoothness={6} renderOrder={0}>
        <MeshTransmissionMaterial
          color="#d7edf2"
          backside
          samples={8}
          resolution={512}
          transmission={1}
          roughness={0.22}
          thickness={0.05}
          ior={1.13}
          chromaticAberration={0.01}
          anisotropy={0.01}
          distortion={0.065}
          distortionScale={0.07}
          temporalDistortion={0}
          backsideThickness={0.04}
        />
      </RoundedBox>

      <Text
        position={[-0.46, -0.7, 0.09]}
        anchorX="left"
        anchorY="middle"
        color="#eff7f3"
        fontSize={0.1}
        letterSpacing={0.02}
        maxWidth={0.92}
      >
        {slide.title.toUpperCase()}
      </Text>
      <Text
        position={[-0.46, -0.86, 0.09]}
        anchorX="left"
        anchorY="middle"
        color={slide.accent}
        fontSize={0.05}
        letterSpacing={0.12}
        maxWidth={0.92}
      >
        {slide.label.toUpperCase()}
      </Text>
    </group>
  );
}

function GroundMist() {
  const nearMistRef = useRef(null);
  const farMistRef = useRef(null);

  const mistMaterials = useMemo(
    () => ({
        far: new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uTint: { value: new THREE.Color("#7cefd0") },
          },
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          vertexShader: `
            uniform float uTime;
            varying vec2 vUv;

            void main() {
              vUv = uv;
              vec3 pos = position;
              float waveA = sin(uv.x * 3.14159 * 2.0 + uTime * 0.22) * 0.04;
              float waveB = cos(uv.y * 3.14159 * 1.5 - uTime * 0.16) * 0.035;
              pos.z += (waveA + waveB) * (0.35 + uv.y * 0.65);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uTint;
            varying vec2 vUv;

            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            float fbm(vec2 p) {
              float value = 0.0;
              float amplitude = 0.5;
              for (int i = 0; i < 4; i++) {
                value += noise(p) * amplitude;
                p *= 2.03;
                amplitude *= 0.5;
              }
              return value;
            }

            void main() {
              vec2 uv = vUv;
              vec2 centered = uv - 0.5;
              float plumeA = fbm(uv * vec2(3.2, 1.5) + vec2(uTime * 0.05, -uTime * 0.025));
              float plumeB = fbm(uv * vec2(5.4, 2.2) + vec2(-uTime * 0.03, uTime * 0.018));
              float plume = mix(plumeA, plumeB, 0.45);
              float pool = smoothstep(0.7, 0.08, length(centered * vec2(1.0, 0.62)));
              float horizon = smoothstep(1.0, 0.12, uv.y);
              float wisps = smoothstep(0.42, 0.82, plume) * horizon * pool;
              float core = smoothstep(0.18, 0.72, plume) * horizon * pool;
              float alpha = core * 0.2 + wisps * 0.22;
              vec3 color = uTint * (0.55 + plume * 0.4);
              color += vec3(0.08, 0.12, 0.11) * wisps;
              gl_FragColor = vec4(color, alpha);
            }
          `,
        }),
        near: new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uTint: { value: new THREE.Color("#a8fff0") },
          },
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          vertexShader: `
            uniform float uTime;
            varying vec2 vUv;

            void main() {
              vUv = uv;
              vec3 pos = position;
              float waveA = sin(uv.x * 3.14159 * 2.0 + uTime * 0.22) * 0.04;
              float waveB = cos(uv.y * 3.14159 * 1.5 - uTime * 0.16) * 0.035;
              pos.z += (waveA + waveB) * (0.35 + uv.y * 0.65);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uTint;
            varying vec2 vUv;

            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            float fbm(vec2 p) {
              float value = 0.0;
              float amplitude = 0.5;
              for (int i = 0; i < 4; i++) {
                value += noise(p) * amplitude;
                p *= 2.03;
                amplitude *= 0.5;
              }
              return value;
            }

            void main() {
              vec2 uv = vUv;
              vec2 centered = uv - 0.5;
              float plumeA = fbm(uv * vec2(3.2, 1.5) + vec2(uTime * 0.05, -uTime * 0.025));
              float plumeB = fbm(uv * vec2(5.4, 2.2) + vec2(-uTime * 0.03, uTime * 0.018));
              float plume = mix(plumeA, plumeB, 0.45);
              float pool = smoothstep(0.7, 0.08, length(centered * vec2(1.0, 0.62)));
              float horizon = smoothstep(1.0, 0.12, uv.y);
              float wisps = smoothstep(0.42, 0.82, plume) * horizon * pool;
              float core = smoothstep(0.18, 0.72, plume) * horizon * pool;
              float alpha = core * 0.2 + wisps * 0.22;
              vec3 color = uTint * (0.55 + plume * 0.4);
              color += vec3(0.08, 0.12, 0.11) * wisps;
              gl_FragColor = vec4(color, alpha);
            }
          `,
        }),
      }),
    [],
  );

  useEffect(() => {
    return () => {
      mistMaterials.far.dispose();
      mistMaterials.near.dispose();
    };
  }, [mistMaterials]);

  useFrame((state, delta) => {
    mistMaterials.far.uniforms.uTime.value = state.clock.elapsedTime;
    mistMaterials.near.uniforms.uTime.value = state.clock.elapsedTime + 1.7;

    if (nearMistRef.current) {
      nearMistRef.current.rotation.z = THREE.MathUtils.damp(
        nearMistRef.current.rotation.z,
        Math.sin(state.clock.elapsedTime * 0.18) * 0.03,
        2.2,
        delta,
      );
      nearMistRef.current.position.y = THREE.MathUtils.damp(
        nearMistRef.current.position.y,
        -2.02 + Math.sin(state.clock.elapsedTime * 0.28) * 0.03,
        2.4,
        delta,
      );
    }

    if (farMistRef.current) {
      farMistRef.current.rotation.z = THREE.MathUtils.damp(
        farMistRef.current.rotation.z,
        -0.08 + Math.cos(state.clock.elapsedTime * 0.16) * 0.025,
        2.2,
        delta,
      );
      farMistRef.current.position.y = THREE.MathUtils.damp(
        farMistRef.current.position.y,
        -2.12 + Math.cos(state.clock.elapsedTime * 0.22) * 0.025,
        2.4,
        delta,
      );
    }
  });

  return (
    <group>
      <mesh ref={farMistRef} rotation={[-Math.PI / 2, 0, -0.08]} position={[0, -2.12, -0.25]} renderOrder={-2}>
        <planeGeometry args={[8.2, 5.4, 1, 1]} />
        <primitive object={mistMaterials.far} attach="material" />
      </mesh>
      <mesh ref={nearMistRef} rotation={[-Math.PI / 2, 0, 0.04]} position={[0, -2.02, 0.28]} renderOrder={-1}>
        <planeGeometry args={[6.2, 4.4, 1, 1]} />
        <primitive object={mistMaterials.near} attach="material" />
      </mesh>
    </group>
  );
}

function Carousel({ progress, activeIndex, isMobile, dragRotation }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      dragRotation * 0.18,
      4,
      delta,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      isMobile ? 0.12 : 0.06,
      3.4,
      delta,
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      0.18 - THREE.MathUtils.smoothstep(progress, 0.45, 0.8) * 1.1,
      3.4,
      delta,
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.2 + Math.sin(state.clock.elapsedTime * 0.65) * 0.08,
      2.4,
      delta,
    );
    groupRef.current.scale.setScalar(1);
  });

  return (
    <group ref={groupRef}>
      {SLIDES.map((slide, index) => (
        <GlassPanel
          key={slide.title}
          slide={slide}
          index={index}
          count={SLIDES.length}
          activeIndex={activeIndex}
          progress={progress}
          dragRotation={dragRotation}
        />
      ))}

      <GroundMist />
    </group>
  );
}

function HeroCopy({ activeIndex }) {
  const slide = SLIDES[activeIndex];

  return (
    <div className="hero-copy">
      {slide.description ? <p className="hero-description">{slide.description}</p> : null}
      <div className="hero-meta">
        <span>{slide.title}</span>
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function CapsuleMenu() {
  return (
    <nav className="capsule-menu" aria-label="Main">
      {MENU_ITEMS.map((item, index) => (
        <button key={item} type="button" className={`capsule-menu__item ${index === 1 ? "is-center" : ""}`}>
          {item}
        </button>
      ))}
    </nav>
  );
}

function Scene({ progress, activeIndex, isMobile, dragRotation, onPointerDown, onPointerMove, onPointerUp, onPointerLeave }) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.4] : [1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 32, position: [0, 0.4, 7.2] }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <fog attach="fog" args={["#020607", 6, 18]} />
      <color attach="background" args={["#041012"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 6]} intensity={1.4} color="#ecfeff" />
      <pointLight position={[-4, 1.5, 2]} intensity={16} color="#8be5b4" distance={14} />
      <pointLight position={[4, -1, 3]} intensity={12} color="#93c5fd" distance={12} />
      <pointLight position={[0, -2.2, 2]} intensity={10} color="#67e8f9" distance={10} />
      <CameraRig progress={progress} isMobile={isMobile} />
      <Carousel progress={progress} activeIndex={activeIndex} isMobile={isMobile} dragRotation={dragRotation} />
      <Html position={[0, 2.7, 0]} center>
        <div className="hero-bloom" />
      </Html>
    </Canvas>
  );
}

export default function App() {
  const viewport = useViewportState();
  const isMobile = viewport.width < 820;
  const [dragRotation, setDragRotation] = useState(0);
  const dragStateRef = useRef({ active: false, x: 0 });
  const progress = THREE.MathUtils.clamp(viewport.scrollY / viewport.maxScroll, 0, 1);
  const activeIndex = Math.min(SLIDES.length - 1, Math.floor(progress * SLIDES.length));

  const handlePointerDown = (event) => {
    dragStateRef.current.active = true;
    dragStateRef.current.x = event.clientX;
  };

  const handlePointerMove = (event) => {
    if (!dragStateRef.current.active) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.x;
    dragStateRef.current.x = event.clientX;
    setDragRotation((current) => current + deltaX * 0.008);
  };

  const handlePointerUp = () => {
    dragStateRef.current.active = false;
  };

  return (
    <main className="app-shell">
      <section className="hero-shell">
        <div className="scene-frame">
          <Scene
            progress={progress}
            activeIndex={activeIndex}
            isMobile={isMobile}
            dragRotation={dragRotation}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          <div className="scene-noise" />
          <div className="scene-vignette" />
        </div>

        <header className="topbar">
          <div className="brand-block">
            <span className="brand-mark">AT</span>
            <span className="brand-copy">spatial lab</span>
          </div>
          <CapsuleMenu />
        </header>

        <HeroCopy activeIndex={activeIndex} />

        <div className="hero-status">
          <span>rotating glass slider</span>
          <span>glass panel image cards</span>
          <span>section parallax split</span>
        </div>
      </section>

      <section className="content-section content-section--upper">
        <div className="section-copy">
          <p className="section-label">Above the surface</p>
          <h2>A dedicated space for new stories, featured moments and what comes next.</h2>
          <p>
            This section will grow into a living layer for launches, updates and the evolving universe of SPATIAL LAB.
          </p>
        </div>
      </section>

      <section className="water-break">
        <div className="water-break__line" />
        <div className="water-break__glow" />
        <div className="water-break__copy">
          <span>Surface split</span>
          <strong>Step into the next layer of SPATIAL LAB</strong>
        </div>
      </section>

      <section className="content-section content-section--lower">
        <div className="section-copy">
          <p className="section-label">Below the surface</p>
          <h2>Selected releases, featured work and new drops live here.</h2>
          <p>
            A curated space for launches, collaborations and the next wave of visual work from SPATIAL LAB.
          </p>
        </div>
      </section>
    </main>
  );
}
