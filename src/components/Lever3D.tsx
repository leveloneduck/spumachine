
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import type { Group } from 'three';

export type MintStage = 'idle' | 'prepping' | 'minting' | 'success' | 'error';

interface Lever3DProps {
  stage: MintStage;
  onPullEnd: () => void;
  onEngage?: () => void;
}

function useModelAvailability(url: string) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => !cancelled && setAvailable(false));
    return () => {
      cancelled = true;
    };
  }, [url]);
  return available;
}

function ProceduralLever({ stage, onPullEnd }: { stage: MintStage; onPullEnd: () => void }) {
  const armRef = useRef<Group>(null);
  const [target, setTarget] = useState(0); // radians
  const velocity = useRef(0);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (stage === 'prepping') {
      setTarget(-0.75);
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setTimeout(() => onPullEnd(), 350);
        setTimeout(() => setTarget(0), 800);
      }
    } else if (stage === 'idle') {
      hasTriggeredRef.current = false;
      setTarget(0);
    } else if (stage === 'success' || stage === 'error') {
      setTarget(0);
    }
  }, [stage, onPullEnd]);

  useFrame((state, delta) => {
    const arm = armRef.current;
    if (!arm) return;

    // Idle jiggle
    const idleOffset = stage === 'idle' ? Math.sin(state.clock.elapsedTime * 1.2) * 0.03 : 0;

    // Critically damped spring toward target
    const current = arm.rotation.z;
    const stiffness = 18;
    const damping = 6;
    const accel = stiffness * (target - current - idleOffset) - damping * velocity.current;
    velocity.current += accel * delta;
    arm.rotation.z += velocity.current * delta;
  });

  const knobColor = useMemo(() => {
    if (stage === 'success') return '#22c55e';
    if (stage === 'error') return '#ef4444';
    return '#93c5fd';
  }, [stage]);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Base */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 24]} />
        <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Hinge block */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Arm group pivots around hinge */}
      <group ref={armRef} position={[0, -0.35, 0]}>
        {/* Arm rod */}
        <mesh rotation={[0, 0, 0]} position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 20]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Knob */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.14, 28, 28]} />
          <meshStandardMaterial color={knobColor} emissive={knobColor} emissiveIntensity={0.35} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={0.9} castShadow />
      <directionalLight position={[-2, 3, -2]} intensity={0.4} />
    </group>
  );
}

function GLTFLever({ stage, onPullEnd }: { stage: MintStage; onPullEnd: () => void }) {
  const { scene } = useGLTF('/models/lever.glb');
  const groupRef = useRef<Group>(null);
  const [target, setTarget] = useState(0);
  const velocity = useRef(0);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (stage === 'prepping') {
      setTarget(-0.75);
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setTimeout(() => onPullEnd(), 350);
        setTimeout(() => setTarget(0), 800);
      }
    } else if (stage === 'idle') {
      hasTriggeredRef.current = false;
      setTarget(0);
    } else if (stage === 'success' || stage === 'error') {
      setTarget(0);
    }
  }, [stage, onPullEnd]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const idleOffset = stage === 'idle' ? Math.sin(state.clock.elapsedTime * 1.2) * 0.03 : 0;
    const current = g.rotation.z;
    const stiffness = 18;
    const damping = 6;
    const accel = stiffness * (target - current - idleOffset) - damping * velocity.current;
    velocity.current += accel * delta;
    g.rotation.z += velocity.current * delta;
  });

  return (
    <group position={[0, -0.5, 0]}>
      <primitive object={scene} ref={groupRef} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={0.9} castShadow />
      <directionalLight position={[-2, 3, -2]} intensity={0.4} />
    </group>
  );
}

const Lever3D = ({ stage, onPullEnd, onEngage }: Lever3DProps) => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modelAvailable = useModelAvailability('/models/lever.glb');
  const canEngage = stage === 'idle';

  return (
    <div
      role="button"
      aria-label="Pull the 3D lever to mint"
      tabIndex={0}
      onClick={() => canEngage && onEngage?.()}
      onKeyDown={(e) => {
        if (canEngage && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onEngage?.();
        }
      }}
      className={`mx-auto w-full max-w-md rounded-xl border bg-background/40 p-4 outline-none transition-shadow ${canEngage ? 'cursor-pointer hover-scale focus-visible:ring-2 focus-visible:ring-primary/60' : 'cursor-default'}`}
    >
      <div style={{ width: '100%', height: 260 }}>
        <Canvas shadows camera={{ position: [0.8, 0.8, 2.2], fov: 45 }} dpr={[1, 2]}>
          {!prefersReducedMotion && <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />}
          {modelAvailable ? (
            <GLTFLever stage={stage} onPullEnd={onPullEnd} />
          ) : (
            <ProceduralLever stage={stage} onPullEnd={onPullEnd} />
          )}
        </Canvas>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {stage === 'idle' && 'Click or press Enter to pull the lever'}
        {stage === 'prepping' && 'Lever engaged...'}
        {stage === 'minting' && 'Processing mint...'}
        {stage === 'success' && 'Success!'}
        {stage === 'error' && 'Error — try again'}
      </p>
    </div>
  );
};

export default Lever3D;

// Removed useGLTF.preload('/models/lever.glb') to prevent fetching a missing model at startup.
