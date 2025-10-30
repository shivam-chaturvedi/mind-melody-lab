import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AudioBars() {
  const groupRef = useRef<THREE.Group>(null);
  const barsCount = 32;

  const bars = useMemo(() => {
    return Array.from({ length: barsCount }, (_, i) => {
      const angle = (i / barsCount) * Math.PI * 2;
      const radius = 3;
      return {
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        color: i % 2 === 0 ? '#7C4DFF' : '#FF4081',
      };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const scale = 0.5 + Math.sin(state.clock.getElapsedTime() * 2 + i * 0.5) * 0.5;
      mesh.scale.y = scale;
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.position}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color={bar.color} emissive={bar.color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export const MusicVisualizer3D = () => {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#7C4DFF" intensity={0.8} />
        <pointLight position={[10, -10, 10]} color="#FF4081" intensity={0.8} />
        
        <AudioBars />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};
