// src/components/ui/ThreeScene.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Artifact mesh: shape varies per artifact type ─────────────── */
function ArtifactMesh({ shape, wireframe = false }) {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.35;
      meshRef.current.position.y = Math.sin(t * 0.7) * 0.06;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.35;
      wireRef.current.position.y = Math.sin(t * 0.7) * 0.06;
    }
  });

  const Geo = () => {
    switch (shape) {
      case 'bust':   return <cylinderGeometry args={[0.5, 0.75, 1.6, 14, 5]} />;
      case 'statue': return <coneGeometry args={[0.58, 2.1, 9, 5]} />;
      case 'slab':   return <boxGeometry args={[1.9, 1.25, 0.14]} />;
      case 'dome':   return <sphereGeometry args={[0.95, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />;
      case 'horse':  return <torusKnotGeometry args={[0.55, 0.18, 80, 18]} />;
      case 'figure': return <octahedronGeometry args={[0.75, 3]} />;
      default:       return <icosahedronGeometry args={[0.8, 2]} />;
    }
  };

  if (wireframe) {
    return (
      <mesh ref={meshRef}>
        <Geo />
        <meshBasicMaterial color="#c9a84c" wireframe />
      </mesh>
    );
  }

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <Geo />
        <meshStandardMaterial
          color="#c9a84c"
          metalness={0.65}
          roughness={0.35}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* subtle wireframe overlay */}
      <mesh ref={wireRef}>
        <Geo />
        <meshBasicMaterial color="#4a3a1c" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/* ─── Floating particles ─────────────────────────────────────────── */
function Particles({ count = 180 }) {
  const points = useRef();
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 6;
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (points.current) points.current.rotation.y = clock.elapsedTime * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#c9a84c" size={0.012} transparent opacity={0.35} />
    </points>
  );
}

/* ─── Main scene ─────────────────────────────────────────────────── */
const ThreeScene = ({ shape = 'figure', compact = false, viewMode = '3d' }) => {
  const wireframe = viewMode === 'wireframe';
  const hologram  = viewMode === 'hologram';

  return (
    <Canvas
      camera={{ position: [0, 0, compact ? 2.8 : 3.2], fov: 42 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting */}
      <ambientLight color="#ffd080" intensity={hologram ? 0.1 : 0.28} />
      <directionalLight color={hologram ? '#00ffcc' : '#ffd700'} intensity={hologram ? 1.2 : 0.75} position={[5, 5, 5]} />
      <directionalLight color={hologram ? '#0044ff' : '#8b5cf6'} intensity={0.45} position={[-5, -2, -5]} />
      <pointLight color="#c9a84c" intensity={0.3} position={[0, 3, 0]} />

      {/* 3D model */}
      <ArtifactMesh shape={shape} wireframe={wireframe} />

      {/* Hologram scanlines effect via a transparent cylinder */}
      {hologram && (
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 3.5, 32, 60, true]} />
          <meshBasicMaterial color="#00ffcc" wireframe transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
      )}

      {/* Ambient particles */}
      <Particles count={compact ? 80 : 200} />

      {/* Stars only in full viewer */}
      {!compact && <Stars radius={12} depth={6} count={400} factor={2} fade />}

      {/* Orbit controls: full viewer only */}
      {!compact && (
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={false}
          minDistance={1.5}
          maxDistance={6}
        />
      )}
    </Canvas>
  );
};

export default ThreeScene;