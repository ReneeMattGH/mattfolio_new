import { ContactShadows, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getPointer } from '../lib/pointer';

interface HeroSceneProps {
  highQuality: boolean;
}

interface BlockDef {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
}

const blocks: BlockDef[] = [
  {
    position: [-2.55, 0.28, 0.35],
    rotation: [0.12, 0.32, 0.16],
    size: [0.92, 0.76, 0.24],
  },
  {
    position: [-1.28, -0.16, 0.02],
    rotation: [-0.06, -0.2, -0.1],
    size: [0.78, 0.94, 0.22],
  },
  {
    position: [0.02, 0.2, 0.16],
    rotation: [0.05, 0.14, 0.06],
    size: [1.02, 0.84, 0.26],
  },
  {
    position: [1.32, -0.2, -0.04],
    rotation: [-0.1, 0.22, -0.12],
    size: [0.8, 1, 0.22],
  },
  {
    position: [2.58, 0.24, 0.3],
    rotation: [0.08, -0.26, 0.1],
    size: [0.9, 0.74, 0.24],
  },
];

function Connector({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const direction = new THREE.Vector3().subVectors(to, from);
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    );
    return { midpoint: mid, quaternion: quat, length: direction.length() };
  }, [from, to]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.008, 0.008, length, 6]} />
      <meshStandardMaterial
        color="#7a7f89"
        roughness={0.46}
        metalness={0.6}
      />
    </mesh>
  );
}

function Chain({ highQuality }: { highQuality: boolean }) {
  const group = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Points>(null);
  const idle = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const canvasWidth = useThree((state) => state.size.width);
  const showAccentRim = canvasWidth >= 900;

  const anchors = useMemo(
    () =>
      blocks.map(
        (block) =>
          new THREE.Vector3(
            block.position[0],
            block.position[1],
            block.position[2],
          ),
      ),
    [],
  );

  const particlePositions = useMemo(() => {
    const count = highQuality ? 220 : 80;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 11;
      array[i * 3 + 1] = (Math.random() - 0.35) * 5;
      array[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return array;
  }, [highQuality]);

  useFrame((state, delta) => {
    const scroll =
      typeof window === 'undefined'
        ? 0
        : Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));

    if (!group.current) return;
    idle.current += delta * 0.055;

    const globalPointer = getPointer();
    pointer.current.x += (globalPointer.nx - pointer.current.x) * 0.05;
    pointer.current.y += (globalPointer.ny - pointer.current.y) * 0.05;

    const targetRotationY = idle.current + pointer.current.x * 0.16 + scroll * 0.24;
    const targetRotationX = -pointer.current.y * 0.075;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotationY,
      0.045,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotationX,
      0.04,
    );

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      0.1 + scroll * 0.75,
      0.04,
    );

    const targetX = 0.72 + pointer.current.x * 0.24 + scroll * 0.9;
    const targetY = 0.32 - pointer.current.y * 0.18 + scroll * 0.42;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.045);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.045);
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      6.7 - scroll * 0.5,
      0.045,
    );
    state.camera.lookAt(0.05, -0.02 + scroll * 0.16, 0);

    if (particles.current) {
      particles.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#141414', 8, 15]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4.5, 5.5, 3.5]} intensity={1.55} color="#ffffff" />
      <directionalLight position={[-5, 1.4, -2.5]} intensity={1.15} color="#8fb4ff" />
      <pointLight position={[0.4, -0.8, 2.6]} intensity={4} color="#8fb4ff" distance={7} />
      <pointLight position={[-2, 1.4, 2]} intensity={2.2} color="#ffffff" distance={8} />

      <group ref={group} position={[0, 0.1, 0]} scale={0.8}>
        {blocks.map((block, index) => (
          <group
            key={index}
            position={block.position}
            rotation={block.rotation}
          >
            <RoundedBox
              args={block.size}
              radius={0.055}
              smoothness={4}
              castShadow={false}
              receiveShadow={false}
            >
              <meshStandardMaterial
                color="#252525"
                roughness={0.52}
                metalness={0.58}
              />
            </RoundedBox>
            {index === 2 && showAccentRim ? (
              <mesh
                position={[
                  -block.size[0] / 2 + 0.002,
                  block.size[1] * 0.16,
                  block.size[2] / 2 + 0.001,
                ]}
              >
                <boxGeometry args={[0.006, block.size[1] * 0.62, 0.006]} />
                <meshBasicMaterial color="#8fb4ff" toneMapped={false} />
              </mesh>
            ) : null}
          </group>
        ))}

        {anchors.slice(0, -1).map((anchor, index) => (
          <Connector key={index} from={anchor} to={anchors[index + 1]} />
        ))}
      </group>

      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.016}
          color="#ffffff"
          transparent
          opacity={0.32}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, -0.4]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#111111" roughness={0.95} metalness={0.15} />
      </mesh>
      <ContactShadows
        position={[0, -1.4, -0.3]}
        opacity={0.5}
        scale={13}
        blur={2.8}
        far={4.5}
        resolution={highQuality ? 512 : 256}
        frames={1}
        color="#000000"
      />

      {highQuality ? (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.12}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
          <Vignette offset={0.22} darkness={0.55} />
        </EffectComposer>
      ) : null}
    </>
  );
}

export default function HeroScene({ highQuality }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, highQuality ? 1.7 : 1.2]}
      camera={{ position: [1.05, 0.45, 6.1], fov: 32 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Chain highQuality={highQuality} />
    </Canvas>
  );
}
