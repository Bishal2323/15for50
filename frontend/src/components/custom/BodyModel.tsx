import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";

export type BodyPartKey =
  | "chest"
  | "leftHip"
  | "rightHip"
  | "leftThigh"
  | "rightThigh"
  | "leftHamstring"
  | "rightHamstring"
  | "leftGlute"
  | "rightGlute"
  | "leftKnee"
  | "rightKnee"
  | "leftArm"
  | "rightArm"
  | "leftFoot"
  | "rightFoot";

export type BodyPartAttributes = {
  soreness: number | null; // 0-10, null if not set
  redness: number | null; // 0-10, null if not set
  swelling: number | null; // 0-10, null if not set
  notes?: string;
};

export type AttributesState = Record<BodyPartKey, BodyPartAttributes>;

type BodyModelProps = {
  selected?: BodyPartKey | null;
  attributes: AttributesState;
  onSelect: (part: BodyPartKey) => void;
};

const colorFromRedness = (redness: number | null) => {
  const intensity = redness == null ? 0 : Math.min(Math.max(redness / 10, 0), 1);
  const r = 0.4 + 0.6 * intensity;
  const g = 0.7 - 0.5 * intensity;
  const b = 0.7 - 0.5 * intensity;
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )})`;
};

function Chest({
  color,
  onClick,
  selected,
}: {
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <mesh
      position={[0, 1.4, 0]}
      onPointerDown={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.8, 0.6, 0.3]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? "orange" : "black"}
        emissiveIntensity={selected ? 0.3 : 0}
      />
    </mesh>
  );
}

function Thigh({
  side,
  color,
  onClick,
  selected,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  const x = side === "left" ? -0.25 : 0.25;
  return (
    <mesh
      position={[x, 0.6, 0]}
      onPointerDown={onClick}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[0.12, 0.12, 0.6, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? "orange" : "black"}
        emissiveIntensity={selected ? 0.3 : 0}
      />
    </mesh>
  );
}

function Knee({
  side,
  color,
  onClick,
  selected,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  const x = side === "left" ? -0.25 : 0.25;
  return (
    <mesh
      position={[x, 0.15, 0]}
      onPointerDown={onClick}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.1, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? "orange" : "black"}
        emissiveIntensity={selected ? 0.4 : 0}
      />
    </mesh>
  );
}

function Shin({ side }: { side: "left" | "right" }) {
  const x = side === "left" ? -0.25 : 0.25;
  return (
    <mesh position={[x, -0.2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
      <meshStandardMaterial color="#c8d1d8" />
    </mesh>
  );
}

function Head() {
  return (
    <mesh position={[0, 2.1, 0]} castShadow>
      <sphereGeometry args={[0.22, 24, 24]} />
      <meshStandardMaterial color="#f0d2c2" />
    </mesh>
  );
}

function Torso() {
  return (
    <mesh position={[0, 1, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.5, 0.25]} />
      <meshStandardMaterial color="#dde3e8" />
    </mesh>
  );
}

function Arm({
  side,
  color,
  onClick,
  selected,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  const x = side === "left" ? -0.7 : 0.7;
  return (
    <mesh
      position={[x, 1.0, 0]}
      rotation={[0, 0, 0]}
      onPointerDown={onClick}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[0.09, 0.09, 0.5, 18]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? "orange" : "black"}
        emissiveIntensity={selected ? 0.3 : 0}
      />
    </mesh>
  );
}

function Foot({
  side,
  color,
  onClick,
  selected,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  const x = side === "left" ? -0.25 : 0.25;
  const z = 0.08;
  return (
    <mesh
      position={[x, -0.55, z]}
      onPointerDown={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.18, 0.06, 0.32]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? "orange" : "black"}
        emissiveIntensity={selected ? 0.3 : 0}
      />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
  );
}

export default function BodyModel({
  selected,
  attributes,
  onSelect,
}: BodyModelProps) {
  const colors = useMemo(
    () => ({
      chest: colorFromRedness(attributes.chest.redness),
      leftThigh: colorFromRedness(attributes.leftThigh.redness),
      rightThigh: colorFromRedness(attributes.rightThigh.redness),
      leftKnee: colorFromRedness(attributes.leftKnee.redness),
      rightKnee: colorFromRedness(attributes.rightKnee.redness),
      leftArm: colorFromRedness(attributes.leftArm.redness),
      rightArm: colorFromRedness(attributes.rightArm.redness),
      leftFoot: colorFromRedness(attributes.leftFoot.redness),
      rightFoot: colorFromRedness(attributes.rightFoot.redness),
    }),
    [attributes]
  );

  return (
    <Canvas
      shadows
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 1.2, 3], fov: 50 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight castShadow position={[3, 3, 3]} intensity={1.1} />
      <OrbitControls enablePan={false} target={[0, 1, 0]} />

      <group>
        <Head />
        <Torso />

        {/* Chest */}
        <Chest
          color={colors.chest}
          onClick={() => onSelect("chest")}
          selected={selected === "chest"}
        />

        {/* Arms */}
        <Arm
          side="left"
          color={colors.leftArm}
          onClick={() => onSelect("leftArm")}
          selected={selected === "leftArm"}
        />
        <Arm
          side="right"
          color={colors.rightArm}
          onClick={() => onSelect("rightArm")}
          selected={selected === "rightArm"}
        />

        {/* Thighs */}
        <Thigh
          side="left"
          color={colors.leftThigh}
          onClick={() => onSelect("leftThigh")}
          selected={selected === "leftThigh"}
        />
        <Thigh
          side="right"
          color={colors.rightThigh}
          onClick={() => onSelect("rightThigh")}
          selected={selected === "rightThigh"}
        />

        {/* Knees and Shins */}
        <Knee
          side="left"
          color={colors.leftKnee}
          onClick={() => onSelect("leftKnee")}
          selected={selected === "leftKnee"}
        />
        <Shin side="left" />
        <Knee
          side="right"
          color={colors.rightKnee}
          onClick={() => onSelect("rightKnee")}
          selected={selected === "rightKnee"}
        />
        <Shin side="right" />

        {/* Feet */}
        <Foot
          side="left"
          color={colors.leftFoot}
          onClick={() => onSelect("leftFoot")}
          selected={selected === "leftFoot"}
        />
        <Foot
          side="right"
          color={colors.rightFoot}
          onClick={() => onSelect("rightFoot")}
          selected={selected === "rightFoot"}
        />

        {/* Ground */}
        <Ground />
      </group>
    </Canvas>
  );
}
