import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ isDark }: { isDark: boolean }) => {
  const count = 150;
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
      meshRef.current.rotation.x += 0.0002;
      
      // Gentle follow mouse
      meshRef.current.position.x += (mouse.current.x * 0.5 - meshRef.current.position.x) * 0.01;
      meshRef.current.position.y += (mouse.current.y * 0.5 - meshRef.current.position.y) * 0.01;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={isDark ? "#C28E4A" : "#1A1A18"}
        transparent
        opacity={0.2}
        sizeAttenuation
      />
    </points>
  );
};

const GeometricShapes = ({ isDark }: { isDark: boolean }) => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const shapes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 5
      ] as [number, number, number],
      scale: Math.random() * 0.4 + 0.15,
      speed: Math.random() * 0.3 + 0.3
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x += (mouse.current.x * 0.2 - groupRef.current.position.x) * 0.005;
      groupRef.current.position.y += (mouse.current.y * 0.2 - groupRef.current.position.y) * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={shape.speed}
          rotationIntensity={1.5}
          floatIntensity={1.5}
          position={shape.position}
        >
          <Sphere args={[1, 32, 32]} scale={shape.scale}>
            <MeshDistortMaterial
              color={isDark ? "#E6B980" : "#C28E4A"}
              speed={1.5}
              distort={0.45}
              radius={1}
              transparent
              opacity={0.08}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

export const ThreeBackground = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleField isDark={isDark} />
        <GeometricShapes isDark={isDark} />
      </Canvas>
    </div>
  );
};
