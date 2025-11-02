import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh, Box3, Vector3 } from "three";
import type { Object3D, Material } from "three";
import type { BodyPartKey, AttributesState } from "./BodyModel";

type RealHumanProps = {
  gender: 'male' | 'female';
  selected?: BodyPartKey | null;
  attributes: AttributesState;
  onSelect: (part: BodyPartKey) => void;
};

// Try to map common mesh/bone names used by popular rigs (Mixamo, MakeHuman, etc.)
const nameToPart = (name: string): BodyPartKey | null => {
  const n = name.toLowerCase();
  if (n.includes("chest") || n.includes("torso") || n.includes("spine"))
    return "chest";
  if (
    (n.includes("upleg") || n.includes("thigh") || n.includes("upperleg")) &&
    n.includes("left")
  )
    return "leftThigh";
  if (
    (n.includes("upleg") || n.includes("thigh") || n.includes("upperleg")) &&
    n.includes("right")
  )
    return "rightThigh";
  if (
    (n.includes("leg") || n.includes("knee") || n.includes("lowerleg")) &&
    n.includes("left")
  )
    return "leftKnee";
  if (
    (n.includes("leg") || n.includes("knee") || n.includes("lowerleg")) &&
    n.includes("right")
  )
    return "rightKnee";
  if ((n.includes("arm") || n.includes("upperarm")) && n.includes("left"))
    return "leftArm";
  if ((n.includes("arm") || n.includes("upperarm")) && n.includes("right"))
    return "rightArm";
  if ((n.includes("foot") || n.includes("feet")) && n.includes("left"))
    return "leftFoot";
  if ((n.includes("foot") || n.includes("feet")) && n.includes("right"))
    return "rightFoot";
  return null;
};

const colorFromRedness = (redness: number | null): [number, number, number] => {
  const intensity = redness == null ? 0 : Math.min(Math.max(redness / 10, 0), 1);
  const r = 0.4 + 0.6 * intensity;
  const g = 0.7 - 0.5 * intensity;
  const b = 0.7 - 0.5 * intensity;
  return [r, g, b];
};

const applyColor = (mat: Material, rgb: [number, number, number]) => {
  // Only set color for materials that expose a Color
  const anyMat = mat as unknown as {
    color?: { setRGB?: (r: number, g: number, b: number) => void };
  };
  const c = anyMat?.color;
  if (c && typeof c.setRGB === "function") {
    c.setRGB(rgb[0], rgb[1], rgb[2]);
  }
};

const traverseMeshes = (root: Object3D): Mesh[] => {
  const meshes: Mesh[] = [];
  root.traverse((obj) => {
    if (obj instanceof Mesh) meshes.push(obj);
  });
  return meshes;
};

function HumanModel({ gender, selected, attributes, onSelect }: RealHumanProps) {
  const gltf = useGLTF(`/models/${gender}.glb`);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const meshes = useMemo(() => traverseMeshes(scene), [scene]);
  const bbox = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const center = new Vector3();
    box.getCenter(center);
    return { box, size, center };
  }, [scene]);

  // Apply attribute-driven colors and selection highlight
  useEffect(() => {
    meshes.forEach((m) => {
      const part = nameToPart(m.name);
      if (!part) return;
      const rgb = colorFromRedness(attributes[part].redness);
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat) => applyColor(mat, rgb));
      mats.forEach((mat) => {
        const anyMat = mat as unknown as {
          emissive?: { set?: (color: string) => void };
          emissiveIntensity?: number;
        };
        if (anyMat.emissive && typeof anyMat.emissive.set === "function") {
          anyMat.emissive.set(selected === part ? "orange" : "black");
        }
        if (typeof anyMat.emissiveIntensity === "number") {
          anyMat.emissiveIntensity = selected === part ? 0.35 : 0;
        }
      });
    });
  }, [meshes, attributes, selected]);

  return (
    <Canvas
      shadows
      camera={{ position: [3.4, 6.0, 8.52], fov: 95 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight castShadow position={[3, 3, 3]} intensity={1.1} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={0.8}
        // Lock vertical tilt to a slight top-down angle
        minPolarAngle={Math.PI / 2 - 0.3}
        maxPolarAngle={Math.PI / 2 - 0.3}
        target={[bbox.center.x, bbox.center.y, bbox.center.z]}
      />

      {/* Render the entire scene to preserve hierarchy */}
      <primitive object={scene} />

      {/* Transparent clickable hotspots ensure interactions regardless of mesh names */}
      {(() => {
        const sx = bbox.size.x;
        const sy = bbox.size.y;
        const sz = bbox.size.z;
        const cx = bbox.center.x;
        const bottom = bbox.box.min.y;
        // place hotspots slightly offset from model surface
        const frontZ = bbox.box.max.z - sz * 0.2;
        const backZ = bbox.box.min.z + sz * 0.2;

        const thighX = sx * 0.12; // move thigh/knee hotspots closer to body center
        const armX = sx * 0.22;
        const chestY = bottom + sy * 0.76;
        const thighY = bottom + sy * 0.42;
        const kneeY = bottom + sy * 0.3;
        const armY = bottom + sy * 0.75;
        const footY = bottom + sy * 0.06;
        const hipY = bottom + sy * 0.5;
        const hamstringY = bottom + sy * 0.42; // mid-thigh back
        const gluteY = bottom + sy * 0.55;

        const hotspot = (
          keyId: string,
          part: BodyPartKey,
          pos: [number, number, number],
          dims: [number, number, number]
        ) => (
          <mesh
            key={`${part}-hot-${keyId}`}
            position={pos}
            onPointerDown={() => onSelect(part)}
          >
            <boxGeometry args={dims} />
            <meshStandardMaterial
              transparent
              opacity={selected === part ? 0.12 : 0}
              depthWrite={false}
              color={selected === part ? "red" : "white"}
            />
          </mesh>
        );

        return (
          <group>
            {hotspot(
              "front",
              "chest",
              [cx, chestY, frontZ],
              [sx * 0.26, sy * 0.22, sz * 0.06]
            )}
            {hotspot(
              "back",
              "chest",
              [cx, chestY, backZ],
              [sx * 0.26, sy * 0.22, sz * 0.06]
            )}
            {hotspot(
              "front",
              "leftThigh",
              [cx - thighX, thighY, frontZ],
              [sx * 0.14, sy * 0.16, sz * 0.06]
            )}
            {hotspot(
              "back",
              "leftThigh",
              [cx - thighX, thighY, backZ],
              [sx * 0.14, sy * 0.16, sz * 0.06]
            )}
            {hotspot(
              "front",
              "rightThigh",
              [cx + thighX, thighY, frontZ],
              [sx * 0.14, sy * 0.16, sz * 0.06]
            )}
            {hotspot(
              "back",
              "rightThigh",
              [cx + thighX, thighY, backZ],
              [sx * 0.14, sy * 0.16, sz * 0.06]
            )}
            {hotspot(
              "front",
              "leftKnee",
              [cx - thighX, kneeY, frontZ],
              [sx * 0.11, sy * 0.16, sz * 0.05]
            )}
            {hotspot(
              "back",
              "leftKnee",
              [cx - thighX, kneeY, backZ],
              [sx * 0.11, sy * 0.16, sz * 0.05]
            )}
            {hotspot(
              "front",
              "rightKnee",
              [cx + thighX, kneeY, frontZ],
              [sx * 0.11, sy * 0.16, sz * 0.05]
            )}
            {hotspot(
              "back",
              "rightKnee",
              [cx + thighX, kneeY, backZ],
              [sx * 0.11, sy * 0.16, sz * 0.05]
            )}
            {hotspot(
              "front",
              "leftArm",
              [cx - armX, armY, frontZ],
              [sx * 0.12, sy * 0.12, sz * 0.05]
            )}
            {hotspot(
              "back",
              "leftArm",
              [cx - armX, armY, backZ],
              [sx * 0.12, sy * 0.12, sz * 0.05]
            )}
            {hotspot(
              "front",
              "rightArm",
              [cx + armX, armY, frontZ],
              [sx * 0.12, sy * 0.12, sz * 0.05]
            )}
            {hotspot(
              "back",
              "rightArm",
              [cx + armX, armY, backZ],
              [sx * 0.12, sy * 0.12, sz * 0.05]
            )}
            {hotspot(
              "front",
              "leftFoot",
              [cx - thighX, footY, frontZ],
              [sx * 0.18, sy * 0.08, sz * 0.1]
            )}
            {hotspot(
              "back",
              "leftFoot",
              [cx - thighX, footY, backZ],
              [sx * 0.18, sy * 0.08, sz * 0.1]
            )}
            {hotspot(
              "front",
              "rightFoot",
              [cx + thighX, footY, frontZ],
              [sx * 0.18, sy * 0.08, sz * 0.1]
            )}
            {hotspot(
              "back",
              "rightFoot",
              [cx + thighX, footY, backZ],
              [sx * 0.18, sy * 0.08, sz * 0.1]
            )}

            {/* Hips */}
            {hotspot(
              "front",
              "leftHip",
              [cx - thighX, hipY, frontZ],
              [sx * 0.16, sy * 0.12, sz * 0.06]
            )}
            {hotspot(
              "back",
              "leftHip",
              [cx - thighX, hipY, backZ],
              [sx * 0.16, sy * 0.12, sz * 0.06]
            )}
            {hotspot(
              "front",
              "rightHip",
              [cx + thighX, hipY, frontZ],
              [sx * 0.16, sy * 0.12, sz * 0.06]
            )}
            {hotspot(
              "back",
              "rightHip",
              [cx + thighX, hipY, backZ],
              [sx * 0.16, sy * 0.12, sz * 0.06]
            )}

            {/* Hamstrings (back only) */}
            {hotspot(
              "back",
              "leftHamstring",
              [cx - thighX, hamstringY, backZ],
              [sx * 0.14, sy * 0.16, sz * 0.06]
            )}
            {hotspot(
              "back",
              "rightHamstring",
              [cx + thighX, hamstringY, backZ],
              [sx * 0.14, sy * 0.16, sz * 0.06]
            )}

            {/* Glutes (back only) */}
            {hotspot(
              "back",
              "leftGlute",
              [cx - thighX, gluteY, backZ],
              [sx * 0.18, sy * 0.14, sz * 0.06]
            )}
            {hotspot(
              "back",
              "rightGlute",
              [cx + thighX, gluteY, backZ],
              [sx * 0.18, sy * 0.14, sz * 0.06]
            )}
          </group>
        );
      })()}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.6, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </Canvas>
  );
}

export default HumanModel;
